import { apiClient } from '@/services/api-client';

// ============================================================
// Dashboard API Service — Placeholder functions
// ============================================================

export const dashboardApi = {
  getOverview: (params?: { dateRange?: string; platform?: string }) =>
    apiClient.get('/dashboard/overview', { params }),

  getKpis: (params?: { dateRange?: string }) =>
    apiClient.get('/dashboard/kpis', { params }),

  getGrowthChart: (params?: { dateRange?: string; platform?: string }) =>
    apiClient.get('/dashboard/charts/growth', { params }),

  getReachChart: (params?: { dateRange?: string }) =>
    apiClient.get('/dashboard/charts/reach', { params }),

  getEngagementChart: (params?: { dateRange?: string }) =>
    apiClient.get('/dashboard/charts/engagement', { params }),

  getFollowersChart: (params?: { dateRange?: string }) =>
    apiClient.get('/dashboard/charts/followers', { params }),

  getPlatformComparison: () =>
    apiClient.get('/dashboard/platform-comparison'),

  getTopPosts: (params?: { limit?: number }) =>
    apiClient.get('/dashboard/top-posts', { params }),

  getAiInsights: () =>
    apiClient.get('/dashboard/ai-insights'),

  getRecentActivity: (params?: { limit?: number }) =>
    apiClient.get('/dashboard/activity', { params }),

  getAudienceOverview: () =>
    apiClient.get('/dashboard/audience'),
};
