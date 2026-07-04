const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Analytics overview fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getPlatforms = async (req, res, next) => {
  try {
    const data = await analyticsService.getPlatforms({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Platform analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const data = await analyticsService.getTrends({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Analytics trends fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getEngagement = async (req, res, next) => {
  try {
    const data = await analyticsService.getEngagement({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Engagement analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getTopPosts = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopPosts({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Top posts fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getGrowth = async (req, res, next) => {
  try {
    const data = await analyticsService.getGrowth({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Growth analytics fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getSnapshots = async (req, res, next) => {
  try {
    const data = await analyticsService.getSnapshots({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Analytics snapshots fetched successfully');
  } catch (error) {
    return next(error);
  }
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
