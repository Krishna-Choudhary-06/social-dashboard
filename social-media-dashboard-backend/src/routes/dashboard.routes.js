const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getDashboard,
  getDashboardSummary,
  getDashboardCharts,
  getPlatformComparison,
  getDashboardTopPosts,
  getRecentPosts,
  getActivity,
} = require('../controllers/dashboard.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

router.get('/workspaces/:workspaceId/dashboard', authMiddleware, getDashboard);
router.get('/workspaces/:workspaceId/dashboard/summary', authMiddleware, getDashboardSummary);
router.get('/workspaces/:workspaceId/dashboard/charts', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/platform-comparison', authMiddleware, getPlatformComparison);
router.get('/workspaces/:workspaceId/dashboard/top-posts', authMiddleware, queryMiddleware({ allowedFilters: ['platform', 'dateRange'] }), getDashboardTopPosts);
router.get('/workspaces/:workspaceId/dashboard/recent-posts', authMiddleware, queryMiddleware({ allowedFilters: ['platform', 'dateRange'] }), getRecentPosts);
router.get('/workspaces/:workspaceId/dashboard/activity', authMiddleware, queryMiddleware({ allowedFilters: ['type', 'dateRange'] }), getActivity);

module.exports = router;
