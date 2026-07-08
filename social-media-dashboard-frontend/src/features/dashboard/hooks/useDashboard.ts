import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useDashboard(dateRange?: string) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;

  const kpis = useQuery({
    queryKey: [...QUERY_KEYS.dashboardKpis, workspaceId, dateRange],
    queryFn: async () => {
      const response = await dashboardApi.getKpis({ dateRange });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const overview = useQuery({
    queryKey: [...QUERY_KEYS.dashboardOverview, workspaceId, dateRange],
    queryFn: async () => {
      const response = await dashboardApi.getOverview({ dateRange });
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const aiInsights = useQuery({
    queryKey: [...QUERY_KEYS.aiInsights, workspaceId],
    queryFn: async () => {
      const response = await dashboardApi.getAiInsights();
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const topPosts = useQuery({
    queryKey: [...QUERY_KEYS.topPosts, workspaceId],
    queryFn: async () => {
      const response = await dashboardApi.getTopPosts();
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const activity = useQuery({
    queryKey: [...QUERY_KEYS.activity, workspaceId],
    queryFn: async () => {
      const response = await dashboardApi.getRecentActivity();
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
  
  const platformComparison = useQuery({
    queryKey: ['dashboard', 'platform-comparison', workspaceId],
    queryFn: async () => {
      const response = await dashboardApi.getPlatformComparison();
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  return {
    kpis,
    overview,
    aiInsights,
    topPosts,
    activity,
    platformComparison,
    isLoading: kpis.isLoading || overview.isLoading || aiInsights.isLoading,
    isError: kpis.isError || overview.isError || aiInsights.isError,
  };
}
