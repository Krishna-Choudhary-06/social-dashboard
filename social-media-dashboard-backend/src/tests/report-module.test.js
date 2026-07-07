const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const reportService = require('../services/report.service');
const Organization = require('../models/organization.model');
const Report = require('../models/report.model');
const dashboardService = require('../services/dashboard.service');
const analyticsService = require('../services/analytics.service');
const ApiError = require('../utils/ApiError');

const originalOrgFindById = Organization.findById;
const originalReportCreate = Report.create;
const originalReportFind = Report.find;
const originalReportFindOne = Report.findOne;
const originalReportFindById = Report.findById;
const originalReportFindByIdAndDelete = Report.findByIdAndDelete;
const originalReportFindByIdAndUpdate = Report.findByIdAndUpdate;
const originalDashboardSummary = dashboardService.getDashboardSummary;
const originalAnalyticsGrowth = analyticsService.getGrowth;
const originalAnalyticsEngagement = analyticsService.getEngagement;
const originalAnalyticsPlatforms = analyticsService.getPlatforms;
const originalAnalyticsTopPosts = analyticsService.getTopPosts;

test.beforeEach(() => {
  Organization.findById = async () => ({
    _id: 'workspace-1',
    name: 'Growth Lab',
    members: [{ user: 'user-1', role: 'analyst' }],
  });

  Report.create = async (payload) => ({
    _id: 'report-1',
    ...payload,
    reportStatus: payload.reportStatus || 'Completed',
    downloadCount: 0,
    generatedAt: new Date('2024-01-01T00:00:00.000Z'),
    expiresAt: new Date('2024-02-01T00:00:00.000Z'),
  });

  Report.find = async () => [
    {
      _id: 'report-1',
      workspaceId: 'workspace-1',
      reportName: 'Weekly Summary',
      reportStatus: 'Completed',
      reportFormat: 'PDF',
    },
  ];

  Report.findOne = async () => ({
    _id: 'report-1',
    workspaceId: 'workspace-1',
    generatedBy: 'user-1',
    reportName: 'Weekly Summary',
    reportStatus: 'Completed',
    reportFormat: 'PDF',
    filePath: null,
    save: async function save() { return this; },
  });

  Report.findById = async () => ({
    _id: 'report-1',
    workspaceId: 'workspace-1',
    generatedBy: 'user-1',
    reportName: 'Weekly Summary',
    reportStatus: 'Completed',
    reportFormat: 'PDF',
    filePath: null,
    downloadCount: 0,
    save: async function save() { return this; },
  });

  Report.findByIdAndDelete = async () => ({
    _id: 'report-1',
    workspaceId: 'workspace-1',
  });

  Report.findByIdAndUpdate = async () => ({
    _id: 'report-1',
    downloadCount: 1,
  });

  dashboardService.getDashboardSummary = async () => ({
    totalFollowers: 1200,
    reach: 3400,
    impressions: 5600,
  });

  analyticsService.getGrowth = async () => ({ growth: 4.3, followers: 1200 });
  analyticsService.getEngagement = async () => ({ likes: 50, comments: 4, shares: 2 });
  analyticsService.getPlatforms = async () => [
    { platform: 'instagram', summary: { followers: 1000, reach: 2000 } },
  ];
  analyticsService.getTopPosts = async () => [
    { id: 'post-1', impressions: 2000, engagementRate: 5.1 },
  ];
});

test.afterEach(() => {
  Organization.findById = originalOrgFindById;
  Report.create = originalReportCreate;
  Report.find = originalReportFind;
  Report.findOne = originalReportFindOne;
  Report.findById = originalReportFindById;
  Report.findByIdAndDelete = originalReportFindByIdAndDelete;
  Report.findByIdAndUpdate = originalReportFindByIdAndUpdate;
  dashboardService.getDashboardSummary = originalDashboardSummary;
  analyticsService.getGrowth = originalAnalyticsGrowth;
  analyticsService.getEngagement = originalAnalyticsEngagement;
  analyticsService.getPlatforms = originalAnalyticsPlatforms;
  analyticsService.getTopPosts = originalAnalyticsTopPosts;
});

test('generateReport creates a report record with completed status', async () => {
  const report = await reportService.generateReport({
    workspaceId: 'workspace-1',
    userId: 'user-1',
    payload: {
      reportName: 'Weekly Summary',
      reportType: 'Dashboard Summary',
      reportFormat: 'PDF',
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      filters: { platform: 'instagram' },
    },
  });

  assert.equal(report.reportName, 'Weekly Summary');
  assert.equal(report.reportStatus, 'Completed');
  assert.equal(report.reportFormat, 'PDF');
  assert.ok(report.filePath);
});

test('listReports returns workspace reports', async () => {
  const result = await reportService.listReports({ workspaceId: 'workspace-1', userId: 'user-1' });

  assert.equal(result.reports.length, 1);
  assert.equal(result.reports[0].reportName, 'Weekly Summary');
});

test('getReport returns a single report', async () => {
  const report = await reportService.getReport({ reportId: 'report-1', userId: 'user-1' });

  assert.equal(report._id, 'report-1');
});

test('downloadReport increments the download count', async () => {
  const tempDir = path.join(__dirname, '..', 'storage', 'reports');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempFile = path.join(tempDir, 'download-test.txt');
  fs.writeFileSync(tempFile, 'report-content');

  Report.findById = async () => ({
    _id: 'report-1',
    workspaceId: 'workspace-1',
    generatedBy: 'user-1',
    reportName: 'Weekly Summary',
    reportStatus: 'Completed',
    reportFormat: 'PDF',
    filePath: tempFile,
    downloadCount: 0,
    save: async function save() { return this; },
  });

  const result = await reportService.downloadReport({ reportId: 'report-1', userId: 'user-1' });

  assert.equal(result.downloadCount, 1);
  assert.equal(result.filePath, tempFile);
});

test('deleteReport removes the report', async () => {
  const result = await reportService.deleteReport({ reportId: 'report-1', userId: 'user-1' });

  assert.equal(result._id, 'report-1');
});

test('generateReport rejects viewers without generation permission', async () => {
  Organization.findById = async () => ({
    _id: 'workspace-1',
    name: 'Growth Lab',
    members: [{ user: 'user-1', role: 'viewer' }],
  });

  await assert.rejects(
    () => reportService.generateReport({
      workspaceId: 'workspace-1',
      userId: 'user-1',
      payload: {
        reportName: 'Weekly Summary',
        reportType: 'Dashboard Summary',
        reportFormat: 'PDF',
        dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      },
    }),
    (error) => error instanceof ApiError && error.statusCode === 403
  );
});

test('generateReport rejects invalid date ranges', async () => {
  await assert.rejects(
    () => reportService.generateReport({
      workspaceId: 'workspace-1',
      userId: 'user-1',
      payload: {
        reportName: 'Weekly Summary',
        reportType: 'Dashboard Summary',
        reportFormat: 'PDF',
        dateRange: { startDate: '2024-01-31', endDate: '2024-01-01' },
      },
    }),
    (error) => error instanceof ApiError && error.statusCode === 400
  );
});
