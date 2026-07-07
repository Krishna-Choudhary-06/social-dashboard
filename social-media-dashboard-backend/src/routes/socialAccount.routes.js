const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const {
  createAccount,
  listAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  refreshAccount,
} = require('../controllers/socialAccount.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

router.post('/workspaces/:workspaceId/accounts', authMiddleware, authorizeRole(['owner', 'admin', 'analyst']), createAccount);
router.get(
  '/workspaces/:workspaceId/accounts', 
  authMiddleware, 
  authorizeRole(['owner', 'admin', 'analyst', 'viewer']), 
  queryMiddleware({
    searchFields: ['username', 'displayName', 'platform'],
    allowedFilters: ['platform', 'connectionStatus', 'lastSyncStatus']
  }),
  listAccounts
);
router.get('/accounts/:id', authMiddleware, authorizeRole(['owner', 'admin', 'analyst', 'viewer']), getAccount);
router.patch('/accounts/:id', authMiddleware, authorizeRole(['owner', 'admin']), updateAccount);
router.delete('/accounts/:id', authMiddleware, authorizeRole(['owner', 'admin']), deleteAccount);
router.post('/accounts/:id/refresh', authMiddleware, authorizeRole(['owner', 'admin']), refreshAccount);

module.exports = router;
