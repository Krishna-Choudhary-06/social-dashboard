const analyticsService = require('./analytics.service');
const {
  formatSummary,
  formatCharts,
  formatPlatformComparison,
  formatTopPosts,
  formatRecentActivity,
  buildDashboardPayload,
} = require('../utils/dashboard.utils');

const getDashboard = async ({ workspaceId, userId, query }) => {
  const [overview, platforms, trends, topPosts, recentPosts, activity] = await Promise.all([
    analyticsService.getOverview({ workspaceId, userId, query }),
    analyticsService.getPlatforms({ workspaceId, userId, query }),
    analyticsService.getTrends({ workspaceId, userId, query }),
    analyticsService.getTopPosts({ workspaceId, userId, query }),
    analyticsService.getTopPosts({ workspaceId, userId, query }),
    analyticsService.getSnapshots({ workspaceId, userId, query }),
  ]);

  return buildDashboardPayload({
    summary: formatSummary(overview),
    charts: formatCharts(trends),
    platformComparison: formatPlatformComparison(platforms),
    topPosts: formatTopPosts(topPosts),
    recentPosts: formatTopPosts(recentPosts),
    activity: formatRecentActivity(activity),
  });
};

const getDashboardSummary = async ({ workspaceId, userId, query }) => {
  const overview = await analyticsService.getOverview({ workspaceId, userId, query });
  return formatSummary(overview);
};

const getDashboardCharts = async ({ workspaceId, userId, query }) => {
  const trends = await analyticsService.getTrends({ workspaceId, userId, query });
  return formatCharts(trends);
};

const getPlatformComparison = async ({ workspaceId, userId, query }) => {
  const platforms = await analyticsService.getPlatforms({ workspaceId, userId, query });
  return formatPlatformComparison(platforms);
};

const getDashboardTopPosts = async ({ workspaceId, userId, query }) => {
  const posts = await analyticsService.getTopPosts({ workspaceId, userId, query });
  return formatTopPosts(posts);
};

const getRecentPosts = async ({ workspaceId, userId, query }) => {
  const posts = await analyticsService.getTopPosts({ workspaceId, userId, query });
  return formatTopPosts(posts);
};

const getActivity = async ({ workspaceId, userId, query }) => {
  const activity = await analyticsService.getSnapshots({ workspaceId, userId, query });
  return formatRecentActivity(activity);
};

module.exports = {
  getDashboard,
  getDashboardSummary,
  getDashboardCharts,
  getPlatformComparison,
  getDashboardTopPosts,
  getRecentPosts,
  getActivity,
};
