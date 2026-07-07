const express = require('express');
const {
  queueJobReport,
  queueJobAnalytics,
  getJobStatus,
  getHealth,
} = require('../controllers/job.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/reports', authMiddleware, queueJobReport);
router.post('/analytics', authMiddleware, queueJobAnalytics);
router.get('/health', authMiddleware, getHealth);
router.get('/:jobId', authMiddleware, getJobStatus);

module.exports = router;
