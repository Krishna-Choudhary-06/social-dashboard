const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRole, authorizePermission } = require('../middlewares/role.middleware');
const {
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
  deactivateUser,
} = require('../controllers/user.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.patch('/me', authMiddleware, updateProfile);
router.get(
  '/', 
  authMiddleware, 
  authorizePermission('users', 'read'), 
  queryMiddleware({
    searchFields: ['name', 'email', 'username'],
    allowedFilters: ['role', 'status']
  }),
  listUsers
);
router.get('/:id', authMiddleware, authorizePermission('users', 'read'), getUserById);
router.patch('/:id/deactivate', authMiddleware, authorizeRole(['admin', 'superadmin']), deactivateUser);

module.exports = router;
