import { apiClient } from '@/services/api-client';

// ============================================================
// Auth API Service — Placeholder functions
// ============================================================

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.post('/auth/register', {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password
    }),

  forgotPassword: (data: { email: string }) =>
    apiClient.post('/auth/forgot-password', data),

  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post('/auth/reset-password', data),

  logout: () => apiClient.post('/auth/logout'),

  getMe: () => apiClient.get('/auth/me'),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};
