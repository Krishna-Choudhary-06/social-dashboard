const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Dashboard fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardSummary({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Dashboard summary fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getDashboardCharts = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardCharts({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Dashboard charts fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getPlatformComparison = async (req, res, next) => {
  try {
    const data = await dashboardService.getPlatformComparison({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Platform comparison fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getDashboardTopPosts = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardTopPosts({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Top posts fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getRecentPosts = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentPosts({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Recent posts fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const data = await dashboardService.getActivity({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      query: req.query,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(res, data, httpStatus.OK, 'Recent activity fetched successfully');
  } catch (error) {
    return next(error);
  }
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
