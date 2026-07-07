const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  createNotification,
  listNotifications,
  getNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
} = require('../controllers/notification.controller');

const queryMiddleware = require('../middlewares/query.middleware');

const router = express.Router();

router.get(
  '/workspaces/:workspaceId/notifications', 
  authMiddleware, 
  queryMiddleware({
    searchFields: ['title', 'message'],
    allowedFilters: ['type', 'isRead', 'priority']
  }),
  listNotifications
);
router.get('/workspaces/:workspaceId/notifications/unread-count', authMiddleware, getUnreadCount);
router.get('/notifications/:id', authMiddleware, getNotification);
router.post('/workspaces/:workspaceId/notifications', authMiddleware, createNotification);
router.patch('/notifications/:id/read', authMiddleware, markNotificationAsRead);
router.patch('/notifications/read-all', authMiddleware, markAllNotificationsAsRead);
router.delete('/notifications/:id', authMiddleware, deleteNotification);

module.exports = router;
