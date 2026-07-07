const notificationService = require('../services/notification.service');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

const createNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      payload: req.body,
      createdBy: req.userId,
    });

    return sendSuccess(res, notification, httpStatus.CREATED, 'Notification created successfully');
  } catch (error) {
    return next(error);
  }
};

const { getPaginationMetadata } = require('../utils/pagination');

const listNotifications = async (req, res, next) => {
  try {
    const { page, limit } = req.queryOptions || { page: 1, limit: 20 };
    
    const { notifications, total, unreadCount } = await notificationService.listNotifications({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(
      res, 
      { 
        notifications,
        unreadCount,
        pagination: getPaginationMetadata(page, limit, total) 
      }, 
      httpStatus.OK, 
      'Notifications fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.getNotification({
      notificationId: req.params.id,
      userId: req.userId,
    });

    return sendSuccess(res, notification, httpStatus.OK, 'Notification fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead({
      notificationId: req.params.id,
      userId: req.userId,
    });

    return sendSuccess(res, notification, httpStatus.OK, 'Notification marked as read');
  } catch (error) {
    return next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead({
      workspaceId: req.query.workspaceId || req.params.workspaceId,
      userId: req.userId,
    });

    return sendSuccess(res, result, httpStatus.OK, 'All notifications marked as read');
  } catch (error) {
    return next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.deleteNotification({
      notificationId: req.params.id,
      userId: req.userId,
    });

    return sendSuccess(res, notification, httpStatus.OK, 'Notification deleted successfully');
  } catch (error) {
    return next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
    });

    return sendSuccess(res, result, httpStatus.OK, 'Unread count fetched successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNotification,
  listNotifications,
  getNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
};
