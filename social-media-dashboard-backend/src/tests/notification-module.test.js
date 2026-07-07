const test = require('node:test');
const assert = require('node:assert/strict');

const notificationService = require('../services/notification.service');
const Notification = require('../models/notification.model');
const Organization = require('../models/organization.model');
const ApiError = require('../utils/ApiError');

const originalFindById = Organization.findById;
const originalNotificationCreate = Notification.create;
const originalNotificationFind = Notification.find;
const originalNotificationFindById = Notification.findById;
const originalNotificationFindByIdAndDelete = Notification.findByIdAndDelete;
const originalNotificationCountDocuments = Notification.countDocuments;

const buildWorkspace = (role = 'owner') => ({
  _id: 'workspace-1',
  name: 'Growth Lab',
  members: [{ user: 'user-1', role }],
});

test.beforeEach(() => {
  Organization.findById = async () => buildWorkspace('owner');

  Notification.create = async (payload) => ({
    _id: 'notification-1',
    ...payload,
    isRead: false,
    createdAt: new Date(),
  });

  Notification.find = async () => [
    {
      _id: 'notification-1',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      type: 'Report Ready',
      title: 'Report ready',
      message: 'Your report is ready',
      priority: 'high',
      isRead: false,
      save: async function save() { return this; },
    },
  ];

  Notification.findById = async () => ({
    _id: 'notification-1',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    type: 'Report Ready',
    title: 'Report ready',
    message: 'Your report is ready',
    priority: 'high',
    isRead: false,
    save: async function save() { return this; },
  });

  Notification.findByIdAndDelete = async () => ({ _id: 'notification-1' });
  Notification.countDocuments = async () => 1;
});

test.afterEach(() => {
  Organization.findById = originalFindById;
  Notification.create = originalNotificationCreate;
  Notification.find = originalNotificationFind;
  Notification.findById = originalNotificationFindById;
  Notification.findByIdAndDelete = originalNotificationFindByIdAndDelete;
  Notification.countDocuments = originalNotificationCountDocuments;
});

test('createNotification stores a notification for the workspace', async () => {
  const notification = await notificationService.createNotification({
    workspaceId: 'workspace-1',
    userId: 'user-1',
    payload: {
      type: 'Report Ready',
      title: 'Report ready',
      message: 'Your report is ready',
      priority: 'high',
      metadata: { reportId: 'report-1' },
    },
  });

  assert.equal(notification.type, 'Report Ready');
  assert.equal(notification.workspaceId, 'workspace-1');
  assert.equal(notification.isRead, false);
});

test('listNotifications returns paginated workspace notifications', async () => {
  const result = await notificationService.listNotifications({ workspaceId: 'workspace-1', userId: 'user-1', page: 1, limit: 10 });

  assert.equal(result.notifications.length, 1);
  assert.equal(result.pagination.page, 1);
});

test('getNotification returns a single notification', async () => {
  const notification = await notificationService.getNotification({ notificationId: 'notification-1', userId: 'user-1' });

  assert.equal(notification._id, 'notification-1');
});

test('markNotificationAsRead updates the read state', async () => {
  const notification = await notificationService.markNotificationAsRead({ notificationId: 'notification-1', userId: 'user-1' });

  assert.equal(notification.isRead, true);
});

test('markAllNotificationsAsRead updates the unread set', async () => {
  const result = await notificationService.markAllNotificationsAsRead({ workspaceId: 'workspace-1', userId: 'user-1' });

  assert.equal(result.updatedCount, 1);
});

test('deleteNotification removes the notification', async () => {
  const notification = await notificationService.deleteNotification({ notificationId: 'notification-1', userId: 'user-1' });

  assert.equal(notification._id, 'notification-1');
});

test('createNotification denies viewers from creating notifications', async () => {
  Organization.findById = async () => buildWorkspace('viewer');

  await assert.rejects(
    () => notificationService.createNotification({
      workspaceId: 'workspace-1',
      userId: 'user-1',
      payload: { type: 'Report Ready', title: 'Report ready', message: 'Your report is ready' },
    }),
    (error) => error instanceof ApiError && error.statusCode === 403
  );
});
