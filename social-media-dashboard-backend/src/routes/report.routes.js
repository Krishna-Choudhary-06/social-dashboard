const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  generateReport,
  listReports,
  getReport,
  downloadReport,
  deleteReport,
} = require('../controllers/report.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

router.post('/workspaces/:workspaceId/reports', authMiddleware, generateReport);
router.get(
  '/workspaces/:workspaceId/reports', 
  authMiddleware, 
  queryMiddleware({
    searchFields: ['name'],
    allowedFilters: ['type', 'status', 'createdBy']
  }),
  listReports
);
router.get('/reports/:reportId', authMiddleware, getReport);
router.get('/reports/:reportId/download', authMiddleware, downloadReport);
router.delete('/reports/:reportId', authMiddleware, deleteReport);

module.exports = router;
