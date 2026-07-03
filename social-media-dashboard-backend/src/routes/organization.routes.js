const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const {
  createOrganization,
  listOrganizations,
  getOrganization,
  addMember,
} = require('../controllers/organization.controller');

const router = express.Router();

router.post('/', authMiddleware, createOrganization);
router.get('/', authMiddleware, listOrganizations);
router.get('/:id', authMiddleware, getOrganization);
router.post('/:id/members', authMiddleware, authorizeRole(['admin', 'superadmin']), addMember);

module.exports = router;
