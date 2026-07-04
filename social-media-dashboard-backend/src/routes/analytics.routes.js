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

const router = express.Router();

router.get('/workspaces/:workspaceId/analytics/overview', authMiddleware, getOverview);
router.get('/workspaces/:workspaceId/analytics/platforms', authMiddleware, getPlatforms);
router.get('/workspaces/:workspaceId/analytics/trends', authMiddleware, getTrends);
router.get('/workspaces/:workspaceId/analytics/engagement', authMiddleware, getEngagement);
router.get('/workspaces/:workspaceId/analytics/top-posts', authMiddleware, getTopPosts);
router.get('/workspaces/:workspaceId/analytics/growth', authMiddleware, getGrowth);
router.get('/workspaces/:workspaceId/analytics/snapshots', authMiddleware, getSnapshots);

module.exports = router;
