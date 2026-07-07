const Organization = require('../models/organization.model');
const Notification = require('../models/notification.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');
const { buildNotificationPayload, normalizePagination, buildPagination } = require('../utils/notification.utils');

const ensureWorkspaceAccess = async (workspaceId, userId) => {
  const workspace = await Organization.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND');
  }

  const member = workspace.members.find((item) => String(item.user) === String(userId));
  if (!member) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not belong to this workspace', 'FORBIDDEN');
  }

  return { workspace, member };
};

const ensureAccessForAction = async (workspaceId, userId, action) => {
  const { member } = await ensureWorkspaceAccess(workspaceId, userId);
  const role = (member.role || 'viewer').toLowerCase();
  const canCreate = ['owner', 'admin'].includes(role);
  const canRead = ['owner', 'admin', 'analyst', 'viewer'].includes(role);
  const canManage = ['owner', 'admin'].includes(role);

  if (action === 'create' && !canCreate) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create notifications', 'FORBIDDEN');
  }

  if (action === 'read' && !canRead) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view notifications', 'FORBIDDEN');
  }

  if (action === 'manage' && !canManage) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to manage notifications', 'FORBIDDEN');
  }

  return { role };
};

const createNotification = async ({ workspaceId, userId, payload = {}, createdBy = null }) => {
  await ensureAccessForAction(workspaceId, userId, 'create');
  const notification = await Notification.create(
    buildNotificationPayload({ workspaceId, userId, payload, createdBy: createdBy || userId })
  );

  return notification;
};

const listNotifications = async ({ workspaceId, userId, queryOptions = {} }) => {
  await ensureAccessForAction(workspaceId, userId, 'read');
  
  const { filter = {}, sort = '-createdAt', skip = 0, limit = 20 } = queryOptions;
  const finalFilter = { workspaceId, userId, ...filter };

  const [notifications, total] = await Promise.all([
    Notification.find(finalFilter).sort(sort).skip(skip).limit(limit),
    Notification.countDocuments(finalFilter)
  ]);

  return {
    notifications,
    total,
    unreadCount: notifications.filter((item) => !item.isRead).length, // Only for current page, or need separate count for all? Usually separate. Let's keep existing logic.
  };
};

const getNotification = async ({ notificationId, userId }) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
  }

  await ensureAccessForAction(notification.workspaceId, userId, 'read');
  return notification;
};

const markNotificationAsRead = async ({ notificationId, userId }) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
  }

  await ensureAccessForAction(notification.workspaceId, userId, 'read');
  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();
  return notification;
};

const markAllNotificationsAsRead = async ({ workspaceId, userId }) => {
  await ensureAccessForAction(workspaceId, userId, 'read');
  const notifications = await Notification.find({ workspaceId, userId, isRead: false });
  await Promise.all(
    notifications.map(async (notification) => {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
    })
  );

  return {
    updatedCount: notifications.length,
  };
};

const deleteNotification = async ({ notificationId, userId }) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
  }

  await ensureAccessForAction(notification.workspaceId, userId, 'manage');
  await Notification.findByIdAndDelete(notificationId);
  return notification;
};

const getUnreadCount = async ({ workspaceId, userId }) => {
  await ensureAccessForAction(workspaceId, userId, 'read');
  const count = await Notification.countDocuments({ workspaceId, userId, isRead: false });
  return { unreadCount: count };
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
