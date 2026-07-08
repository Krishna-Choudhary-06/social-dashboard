const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getOverview,
  getPlatforms,
  getTrends,
  getEngagement,
  getTopPosts,
  getGrowth,
  getSnapshots,
} = require('../controllers/analytics.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

const analyticsQueryOptions = queryMiddleware({
  allowedFilters: ['platform', 'dateRange']
});

router.get('/workspaces/:workspaceId/analytics/overview', authMiddleware, analyticsQueryOptions, getOverview);
router.get('/workspaces/:workspaceId/analytics/platforms', authMiddleware, analyticsQueryOptions, getPlatforms);
router.get('/workspaces/:workspaceId/analytics/trends', authMiddleware, analyticsQueryOptions, getTrends);
router.get('/workspaces/:workspaceId/analytics/engagement', authMiddleware, analyticsQueryOptions, getEngagement);
router.get('/workspaces/:workspaceId/analytics/top-posts', authMiddleware, analyticsQueryOptions, getTopPosts);
router.get('/workspaces/:workspaceId/analytics/growth', authMiddleware, analyticsQueryOptions, getGrowth);
router.get('/workspaces/:workspaceId/analytics/snapshots', authMiddleware, analyticsQueryOptions, getSnapshots);

module.exports = router;
