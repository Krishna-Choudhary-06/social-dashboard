import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useAnalytics(dateRange?: string, platform?: string) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;

  const overview = useQuery({
    queryKey: [...QUERY_KEYS.analyticsOverview, workspaceId, dateRange, platform],
    queryFn: async () => {
      const response = await analyticsApi.getOverview({ dateRange, platform });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const growth = useQuery({
    queryKey: [...QUERY_KEYS.analyticsGrowth, workspaceId, dateRange, platform],
    queryFn: async () => {
      const response = await analyticsApi.getGrowthData({ dateRange, platform });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const engagement = useQuery({
    queryKey: [...QUERY_KEYS.analyticsEngagement, workspaceId, dateRange, platform],
    queryFn: async () => {
      const response = await analyticsApi.getEngagementData({ dateRange, platform });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const audience = useQuery({
    queryKey: [...QUERY_KEYS.analyticsAudience, workspaceId, platform],
    queryFn: async () => {
      const response = await analyticsApi.getAudienceData({ platform });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const platformComparison = useQuery({
    queryKey: ['analytics', 'platform-comparison', workspaceId, dateRange],
    queryFn: async () => {
      const response = await analyticsApi.getPlatformComparison({ dateRange });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const contentPerformance = useQuery({
    queryKey: ['analytics', 'content-performance', workspaceId, dateRange],
    queryFn: async () => {
      const response = await analyticsApi.getContentPerformance({ dateRange });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  return {
    overview,
    growth,
    engagement,
    audience,
    platformComparison,
    contentPerformance,
    isLoading: overview.isLoading || growth.isLoading || engagement.isLoading,
    isError: overview.isError || growth.isError || engagement.isError,
  };
}
