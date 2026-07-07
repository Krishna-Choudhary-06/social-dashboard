import { apiClient } from '@/services/api-client';

export const reportsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get('/reports', { params }),
  getById: (id: string) => apiClient.get(`/reports/${id}`),
  generate: (data: { title: string; type: string; dateRange: { start: string; end: string }; format: string }) =>
    apiClient.post('/reports', data),
  download: (id: string) => apiClient.get(`/reports/${id}/download`, { responseType: 'blob' }),
  delete: (id: string) => apiClient.delete(`/reports/${id}`),
};

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    apiClient.get('/notifications', { params }),
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
};

export const connectedAccountsApi = {
  getAll: () => apiClient.get('/connected-accounts'),
  connect: (platform: string) => apiClient.post(`/connected-accounts/${platform}/connect`),
  disconnect: (id: string) => apiClient.delete(`/connected-accounts/${id}`),
  refresh: (id: string) => apiClient.post(`/connected-accounts/${id}/refresh`),
  getSyncStatus: () => apiClient.get('/connected-accounts/sync-status'),
};

export const workspaceApi = {
  getAll: () => apiClient.get('/workspaces'),
  getById: (id: string) => apiClient.get(`/workspaces/${id}`),
  create: (data: { name: string }) => apiClient.post('/workspaces', data),
  update: (id: string, data: Partial<{ name: string }>) => apiClient.patch(`/workspaces/${id}`, data),
  delete: (id: string) => apiClient.delete(`/workspaces/${id}`),
  getMembers: (id: string) => apiClient.get(`/workspaces/${id}/members`),
  inviteMember: (id: string, data: { email: string; role: string }) =>
    apiClient.post(`/workspaces/${id}/invitations`, data),
  removeMember: (workspaceId: string, memberId: string) =>
    apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`),
  updateMemberRole: (workspaceId: string, memberId: string, role: string) =>
    apiClient.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role }),
};

export const profileApi = {
  get: () => apiClient.get('/profile'),
  update: (data: Partial<{ firstName: string; lastName: string; avatar: string }>) =>
    apiClient.patch('/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.patch('/profile/password', data),
  updatePreferences: (data: Record<string, unknown>) =>
    apiClient.patch('/profile/preferences', data),
};

export const settingsApi = {
  get: () => apiClient.get('/settings'),
  updateAppearance: (data: Record<string, unknown>) =>
    apiClient.patch('/settings/appearance', data),
  updateNotifications: (data: Record<string, unknown>) =>
    apiClient.patch('/settings/notifications', data),
  updateSecurity: (data: Record<string, unknown>) =>
    apiClient.patch('/settings/security', data),
};
