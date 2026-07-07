import { apiClient } from '@/services/api-client';

export const analyticsApi = {
  getOverview: (params?: { dateRange?: string; platform?: string }) =>
    apiClient.get('/analytics/overview', { params }),

  getGrowthData: (params?: { dateRange?: string; platform?: string }) =>
    apiClient.get('/analytics/growth', { params }),

  getEngagementData: (params?: { dateRange?: string; platform?: string }) =>
    apiClient.get('/analytics/engagement', { params }),

  getAudienceData: (params?: { platform?: string }) =>
    apiClient.get('/analytics/audience', { params }),

  getPlatformComparison: (params?: { dateRange?: string }) =>
    apiClient.get('/analytics/platform-comparison', { params }),

  getContentPerformance: (params?: { dateRange?: string; limit?: number }) =>
    apiClient.get('/analytics/content-performance', { params }),
};
