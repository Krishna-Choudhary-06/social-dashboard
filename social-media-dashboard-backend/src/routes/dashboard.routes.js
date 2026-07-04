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

const router = express.Router();

router.get('/workspaces/:workspaceId/dashboard', authMiddleware, getDashboard);
router.get('/workspaces/:workspaceId/dashboard/summary', authMiddleware, getDashboardSummary);
router.get('/workspaces/:workspaceId/dashboard/charts', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/platform-comparison', authMiddleware, getPlatformComparison);
router.get('/workspaces/:workspaceId/dashboard/top-posts', authMiddleware, getDashboardTopPosts);
router.get('/workspaces/:workspaceId/dashboard/recent-posts', authMiddleware, getRecentPosts);
router.get('/workspaces/:workspaceId/dashboard/activity', authMiddleware, getActivity);

module.exports = router;
