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
router.get('/workspaces/:workspaceId/dashboard/overview', authMiddleware, getDashboardSummary);
router.get('/workspaces/:workspaceId/dashboard/kpis', authMiddleware, getDashboardSummary);

router.get('/workspaces/:workspaceId/dashboard/charts', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/charts/growth', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/charts/reach', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/charts/engagement', authMiddleware, getDashboardCharts);
router.get('/workspaces/:workspaceId/dashboard/charts/followers', authMiddleware, getDashboardCharts);

router.get('/workspaces/:workspaceId/dashboard/platform-comparison', authMiddleware, getPlatformComparison);
router.get('/workspaces/:workspaceId/dashboard/top-posts', authMiddleware, queryMiddleware({ allowedFilters: ['platform', 'dateRange'] }), getDashboardTopPosts);
router.get('/workspaces/:workspaceId/dashboard/recent-posts', authMiddleware, queryMiddleware({ allowedFilters: ['platform', 'dateRange'] }), getRecentPosts);
router.get('/workspaces/:workspaceId/dashboard/activity', authMiddleware, queryMiddleware({ allowedFilters: ['type', 'dateRange'] }), getActivity);

// Mocks for missing backend features requested by frontend
router.get('/workspaces/:workspaceId/dashboard/ai-insights', authMiddleware, (req, res) => res.json({ success: true, data: [] }));
router.get('/workspaces/:workspaceId/dashboard/audience', authMiddleware, getDashboardSummary);

module.exports = router;
