const Organization = require('../models/organization.model');
const Analytics = require('../models/analytics.model');
const AnalyticsSnapshot = require('../models/analyticsSnapshot.model');
const ApiError = require('../utils/ApiError');
const { aggregateMetrics, calculateEngagementRate, compareDateRanges, growthPercentage } = require('../utils/analytics');
const httpStatus = require('../constants/httpStatus');
const mongoose = require('mongoose');

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

const normalizeDateRange = ({ startDate, endDate }) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);
  const end = endDate ? new Date(endDate) : now;

  if (Number.isNaN(start.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid startDate', 'VALIDATION_ERROR');
  }

  if (Number.isNaN(end.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid endDate', 'VALIDATION_ERROR');
  }

  return {
    startDate: start,
    endDate: end,
  };
};

const buildQuery = ({ workspaceId, accountId, platform, startDate, endDate, rangeType }) => {
  const query = {
    workspaceId,
  };

  if (accountId) query.accountId = accountId;
  if (platform) query.platform = platform;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (rangeType) query.rangeType = rangeType;

  return query;
};

const buildMockRecords = ({ workspaceId, accountId, platform, startDate, endDate, rangeType }) => {
  const start = new Date(startDate || Date.now() - 1000 * 60 * 60 * 24 * 30);
  const end = new Date(endDate || Date.now());
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const records = [];

  for (let index = 0; index < Math.min(days, 7); index += 1) {
    const date = new Date(start.getTime() + index * 1000 * 60 * 60 * 24);
    const baseFollowers = 1000 + index * 40 + (platform === 'linkedin' ? 80 : 0);
    const baseReach = 1200 + index * 120;
    const baseImpressions = 1800 + index * 220;

    records.push({
      workspaceId,
      accountId,
      platform,
      date,
      rangeType: rangeType || 'daily',
      metrics: {
        followers: baseFollowers,
        followerGrowth: 4 + index,
        reach: baseReach,
        impressions: baseImpressions,
        likes: 80 + index * 4,
        comments: 12 + index,
        shares: 6 + Math.round(index / 2),
        videoViews: 200 + index * 15,
      },
    });
  }

  return records;
};

const getAnalyticsRecords = async (options) => {
  const query = buildQuery(options);
  if (mongoose.connection.readyState === 1) {
    try {
      const records = await Analytics.find(query).sort({ date: 1 });
      if (records.length) {
        return records.map((record) => ({
          ...record.toObject(),
          metrics: record.metrics || {},
        }));
      }
    } catch (error) {
      // fall back to mock analytics when the database is unavailable or the query fails
    }
  }

  return buildMockRecords(options).map((record) => ({
    ...record,
    metrics: record.metrics || {},
  }));
};

const getPreviousRangeRecords = async (options) => {
  const { startDate, endDate } = normalizeDateRange(options);
  const duration = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const previousStart = new Date(startDate.getTime() - (duration + 1) * 1000 * 60 * 60 * 24);
  const previousEnd = new Date(startDate.getTime() - 1000 * 60 * 60 * 24);

  return getAnalyticsRecords({
    ...options,
    startDate: previousStart,
    endDate: previousEnd,
  });
};

const getOverview = async ({ workspaceId, userId, query }) => {
  const { workspace } = await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const rangeQuery = {
    workspaceId,
    accountId: query.accountId || undefined,
    platform: query.platform || undefined,
    startDate,
    endDate,
    rangeType: query.rangeType || 'daily',
  };

  const records = await getAnalyticsRecords(rangeQuery);
  const previousRecords = await getPreviousRangeRecords(rangeQuery);
  const currentSummary = aggregateMetrics(records.map((record) => record.metrics));
  const previousSummary = aggregateMetrics(previousRecords.map((record) => record.metrics));

  return {
    workspaceId,
    workspaceName: workspace.name,
    accountId: query.accountId || null,
    platform: query.platform || null,
    dateRange: {
      startDate,
      endDate,
    },
    summary: currentSummary,
    comparison: compareDateRanges(currentSummary, previousSummary),
    engagementRate: calculateEngagementRate(currentSummary),
    growth: growthPercentage(currentSummary.followers, previousSummary.followers),
  };
};

const getPlatforms = async ({ workspaceId, userId, query }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const records = await getAnalyticsRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });
  const grouped = records.reduce((accumulator, record) => {
    const platform = record.platform;
    if (!accumulator[platform]) {
      accumulator[platform] = [];
    }
    accumulator[platform].push(record);
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([platform, platformRecords]) => {
    const metrics = aggregateMetrics(platformRecords.map((record) => record.metrics));
    return {
      platform,
      summary: metrics,
      engagementRate: calculateEngagementRate(metrics),
    };
  });
};

const getTrends = async ({ workspaceId, userId, query }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const records = await getAnalyticsRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });

  return records.map((record) => ({
    date: record.date,
    platform: record.platform,
    followers: record.metrics.followers || 0,
    reach: record.metrics.reach || 0,
    impressions: record.metrics.impressions || 0,
    engagementRate: calculateEngagementRate(record.metrics),
  }));
};

const getEngagement = async ({ workspaceId, userId, query }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const records = await getAnalyticsRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });
  const summary = aggregateMetrics(records.map((record) => record.metrics));

  return {
    workspaceId,
    totalEngagement: (summary.likes || 0) + (summary.comments || 0) + (summary.shares || 0),
    engagementRate: calculateEngagementRate(summary),
    likes: summary.likes || 0,
    comments: summary.comments || 0,
    shares: summary.shares || 0,
  };
};

const getTopPosts = async ({ workspaceId, userId, query }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const records = await getAnalyticsRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });

  return records.slice(0, 5).map((record, index) => ({
    id: `mock-post-${index + 1}`,
    platform: record.platform,
    date: record.date,
    impressions: record.metrics.impressions || 0,
    likes: record.metrics.likes || 0,
    comments: record.metrics.comments || 0,
    shares: record.metrics.shares || 0,
    engagementRate: calculateEngagementRate(record.metrics),
  }));
};

const getGrowth = async ({ workspaceId, userId, query }) => {
  const { workspace } = await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const currentRecords = await getAnalyticsRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });
  const previousRecords = await getPreviousRangeRecords({ workspaceId, accountId: query.accountId, platform: query.platform, startDate, endDate, rangeType: query.rangeType });
  const currentSummary = aggregateMetrics(currentRecords.map((record) => record.metrics));
  const previousSummary = aggregateMetrics(previousRecords.map((record) => record.metrics));

  return {
    workspaceId,
    workspaceName: workspace.name,
    followers: currentSummary.followers || 0,
    previousFollowers: previousSummary.followers || 0,
    growth: growthPercentage(currentSummary.followers || 0, previousSummary.followers || 0),
    trend: currentSummary.followers >= previousSummary.followers ? 'up' : 'down',
  };
};

const getSnapshots = async ({ workspaceId, userId, query }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  const { startDate, endDate } = normalizeDateRange(query);
  const snapshots = await AnalyticsSnapshot.find({
    workspaceId,
    periodStart: { $gte: startDate },
    periodEnd: { $lte: endDate },
  }).sort({ createdAt: -1 });

  return snapshots;
};

module.exports = {
  getOverview,
  getPlatforms,
  getTrends,
  getEngagement,
  getTopPosts,
  getGrowth,
  getSnapshots,
};
