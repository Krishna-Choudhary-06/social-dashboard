const fs = require('node:fs');
const path = require('node:path');
const Organization = require('../models/organization.model');
const Report = require('../models/report.model');
const dashboardService = require('./dashboard.service');
const analyticsService = require('./analytics.service');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');
const {
  buildReportFilename,
  buildReportMetadata,
  prepareDashboardSummary,
  prepareAnalyticsSection,
  preparePlatformSection,
  prepareGrowthSection,
  prepareEngagementSection,
  prepareTopPosts,
  generateMockPDF,
  generateMockCSV,
  generateMockExcel,
} = require('../utils/report.utils');

const ensureWorkspaceAccess = async (workspaceId, userId) => {
  const workspace = await Organization.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND');
  }

  const member = workspace.members.find((item) => String(item.user) === String(userId));
  if (!member) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not belong to this workspace', 'FORBIDDEN');
  }

  return { workspace, member };
};

const ensureCanGenerateReport = async (workspaceId, userId) => {
  const { member } = await ensureWorkspaceAccess(workspaceId, userId);
  const role = (member.role || 'viewer').toLowerCase();
  if (['owner', 'admin', 'analyst'].includes(role)) {
    return { workspaceId, userId };
  }

  throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to generate reports', 'FORBIDDEN');
};

const ensureCanViewReport = async (report, userId) => {
  const { workspace } = await ensureWorkspaceAccess(report.workspaceId, userId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND');
  }
  return report;
};

const validateDateRange = (dateRange) => {
  if (!dateRange?.startDate || !dateRange?.endDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Date range is required', 'VALIDATION_ERROR');
  }

  const start = new Date(dateRange.startDate);
  const end = new Date(dateRange.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date range', 'VALIDATION_ERROR');
  }

  return { startDate: start, endDate: end };
};

const buildReportPayload = async ({ workspaceId, userId, payload }) => {
  const query = {
    startDate: payload?.dateRange?.startDate,
    endDate: payload?.dateRange?.endDate,
    rangeType: payload?.filters?.rangeType,
    platform: payload?.filters?.platform,
    accountId: payload?.filters?.accountId,
  };

  const [dashboardData, growthData, engagementData, platformsData, topPostsData] = await Promise.all([
    dashboardService.getDashboardSummary({ workspaceId, userId, query }),
    analyticsService.getGrowth({ workspaceId, userId, query }),
    analyticsService.getEngagement({ workspaceId, userId, query }),
    analyticsService.getPlatforms({ workspaceId, userId, query }),
    analyticsService.getTopPosts({ workspaceId, userId, query }),
  ]);

  return {
    dashboard: prepareDashboardSummary(dashboardData),
    analytics: prepareAnalyticsSection({
      growth: growthData,
      engagement: engagementData,
      platforms: preparePlatformSection(platformsData),
      topPosts: prepareTopPosts(topPostsData),
    }),
  };
};

const writeReportFile = ({ report, reportData }) => {
  const baseDir = path.join(__dirname, '..', 'storage', 'reports');
  const fileName = buildReportFilename({
    workspaceId: report.workspaceId,
    reportName: report.reportName,
    reportFormat: report.reportFormat,
  });
  const outputPath = path.join(baseDir, fileName);
  const metadata = buildReportMetadata({
    report,
    workspace: { name: report.reportName },
    dashboardData: reportData.dashboard,
    analyticsData: reportData.analytics,
  });

  if (report.reportFormat === 'CSV') {
    generateMockCSV({ metadata, outputPath });
  } else if (report.reportFormat === 'Excel') {
    generateMockExcel({ metadata, outputPath });
  } else {
    generateMockPDF({ metadata, outputPath });
  }

  return { outputPath, metadata };
};

const generateReport = async ({ workspaceId, userId, payload = {} }) => {
  await ensureCanGenerateReport(workspaceId, userId);
  validateDateRange(payload.dateRange);

  const report = await Report.create({
    workspaceId,
    generatedBy: userId,
    reportName: payload.reportName || 'Workspace Report',
    reportType: payload.reportType || 'Dashboard Summary',
    reportFormat: payload.reportFormat || 'PDF',
    dateRange: payload.dateRange,
    filters: payload.filters || {},
    reportStatus: 'Processing',
  });

  try {
    const reportData = await buildReportPayload({ workspaceId, userId, payload });
    const { outputPath, metadata } = writeReportFile({ report, reportData });

    report.reportStatus = 'Completed';
    report.fileName = path.basename(outputPath);
    report.filePath = outputPath;
    report.fileSize = fs.statSync(outputPath).size;
    report.generatedAt = new Date();
    report.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    report.downloadCount = 0;
    if (typeof report.save === 'function') {
      await report.save();
    }

    return report.toObject ? report.toObject() : report;
  } catch (error) {
    report.reportStatus = 'Failed';
    report.filePath = null;
    if (typeof report.save === 'function') {
      await report.save();
    }
    throw error;
  }
};

const listReports = async ({ workspaceId, userId }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const reportsQuery = await Report.find({ workspaceId });
  const reports = Array.isArray(reportsQuery)
    ? reportsQuery.sort((left, right) => new Date(right.generatedAt || 0) - new Date(left.generatedAt || 0))
    : typeof reportsQuery?.sort === 'function'
      ? await reportsQuery.sort({ generatedAt: -1 })
      : reportsQuery;
  return {
    reports: Array.isArray(reports) ? reports : [reports],
    count: Array.isArray(reports) ? reports.length : 1,
  };
};

const getReport = async ({ reportId, userId }) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found', 'REPORT_NOT_FOUND');
  }

  await ensureCanViewReport(report, userId);
  return report;
};

const downloadReport = async ({ reportId, userId }) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found', 'REPORT_NOT_FOUND');
  }

  await ensureCanViewReport(report, userId);
  if (report.reportStatus !== 'Completed' || !report.filePath || !fs.existsSync(report.filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report file not found', 'REPORT_FILE_NOT_FOUND');
  }

  report.downloadCount = (report.downloadCount || 0) + 1;
  await report.save();
  return {
    reportId,
    filePath: report.filePath,
    downloadCount: report.downloadCount,
  };
};

const deleteReport = async ({ reportId, userId }) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found', 'REPORT_NOT_FOUND');
  }

  await ensureCanViewReport(report, userId);
  if (report.filePath && fs.existsSync(report.filePath)) {
    fs.unlinkSync(report.filePath);
  }

  await Report.findByIdAndDelete(reportId);
  return report;
};

const cleanupExpiredReports = async () => {
  const expiredReports = await Report.find({ expiresAt: { $lt: new Date() } });
  await Promise.all(expiredReports.map(async (report) => {
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }
    await Report.findByIdAndDelete(report._id);
  }));

  return expiredReports.length;
};

module.exports = {
  generateReport,
  listReports,
  getReport,
  downloadReport,
  deleteReport,
  cleanupExpiredReports,
};
