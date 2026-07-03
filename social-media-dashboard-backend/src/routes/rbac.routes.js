const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRole, authorizePermission } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/admin', authMiddleware, authorizeRole(['admin', 'superadmin']), (req, res) => {
  res.status(200).json({ success: true, message: 'Admin access granted' });
});

router.get('/users', authMiddleware, authorizePermission('users', 'read'), (req, res) => {
  res.status(200).json({ success: true, message: 'Users listing access granted' });
});

module.exports = router;
