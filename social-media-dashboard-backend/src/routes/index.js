const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const authRoutes = require('./auth.routes');
const rbacRoutes = require('./rbac.routes');
const userRoutes = require('./user.routes');
const organizationRoutes = require('./organization.routes');
const mediaRoutes = require('./media.routes');
const workspaceRoutes = require('./workspace.routes');
const socialAccountRoutes = require('./socialAccount.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/rbac', rbacRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/media', mediaRoutes);
router.use('/', socialAccountRoutes);
router.use('/', analyticsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
  });
});

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile endpoint ready',
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
