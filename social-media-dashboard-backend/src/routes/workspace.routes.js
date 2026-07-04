const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  updateWorkspace,
  inviteMember,
  updateMemberRole,
} = require('../controllers/workspace.controller');

const router = express.Router();

router.post('/', authMiddleware, createWorkspace);
router.get('/', authMiddleware, listWorkspaces);
router.get('/:id', authMiddleware, getWorkspace);
router.patch('/:id', authMiddleware, authorizeRole(['owner', 'admin']), updateWorkspace);
router.post('/:id/invite', authMiddleware, authorizeRole(['owner', 'admin']), inviteMember);
router.patch('/:id/members/:userId', authMiddleware, authorizeRole(['owner', 'admin']), updateMemberRole);

module.exports = router;
