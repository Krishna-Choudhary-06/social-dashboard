const fs = require('node:fs');
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

const buildReportFilename = ({ workspaceId, reportName, reportFormat }) => {
  const safeName = (reportName || 'report').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${safeName}-${workspaceId || 'workspace'}-${Date.now()}-${uuidv4().slice(0, 6)}.${(reportFormat || 'pdf').toLowerCase()}`;
};

const buildReportMetadata = ({ report, workspace, dashboardData, analyticsData }) => ({
  id: report._id,
  workspaceId: report.workspaceId,
  workspaceName: workspace?.name || null,
  reportName: report.reportName,
  reportType: report.reportType,
  reportFormat: report.reportFormat,
  reportStatus: report.reportStatus,
  dateRange: report.dateRange,
  filters: report.filters,
  dashboard: dashboardData,
  analytics: analyticsData,
  generatedAt: report.generatedAt,
  expiresAt: report.expiresAt,
  downloadCount: report.downloadCount || 0,
});

const prepareDashboardSummary = (dashboardData = {}) => ({
  summary: dashboardData.summary || {},
  charts: dashboardData.charts || { labels: [], datasets: [] },
  platformComparison: dashboardData.platformComparison || [],
  topPosts: dashboardData.topPosts || [],
  recentPosts: dashboardData.recentPosts || [],
  activity: dashboardData.activity || [],
});

const prepareAnalyticsSection = (analyticsData = {}) => ({
  growth: analyticsData.growth || {},
  engagement: analyticsData.engagement || {},
  platforms: analyticsData.platforms || [],
  topPosts: analyticsData.topPosts || [],
});

const preparePlatformSection = (platforms = []) => platforms.map((platform) => ({
  platform: platform.platform,
  summary: platform.summary || {},
  engagementRate: platform.engagementRate || 0,
}));

const prepareGrowthSection = (growthData = {}) => ({
  followers: growthData.followers || 0,
  previousFollowers: growthData.previousFollowers || 0,
  growth: growthData.growth || 0,
  trend: growthData.trend || 'up',
});

const prepareEngagementSection = (engagementData = {}) => ({
  totalEngagement: engagementData.totalEngagement || 0,
  likes: engagementData.likes || 0,
  comments: engagementData.comments || 0,
  shares: engagementData.shares || 0,
  engagementRate: engagementData.engagementRate || 0,
});

const prepareTopPosts = (posts = []) => posts.map((post) => ({
  id: post.id,
  platform: post.platform,
  impressions: post.impressions || 0,
  likes: post.likes || 0,
  comments: post.comments || 0,
  shares: post.shares || 0,
  engagementRate: post.engagementRate || 0,
}));

const generateMockPDF = ({ metadata, outputPath }) => {
  const content = JSON.stringify(metadata, null, 2);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `Mock PDF\n${content}`);
  return outputPath;
};

const generateMockCSV = ({ metadata, outputPath }) => {
  const lines = ['reportName,reportType,reportFormat,downloadCount'];
  lines.push(`${metadata.reportName},${metadata.reportType},${metadata.reportFormat},${metadata.downloadCount}`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join('\n'));
  return outputPath;
};

const generateMockExcel = ({ metadata, outputPath }) => {
  const content = `Mock Excel\n${JSON.stringify(metadata, null, 2)}`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  return outputPath;
};

module.exports = {
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
};
