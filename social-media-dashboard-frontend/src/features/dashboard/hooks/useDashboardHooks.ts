import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { useAuthStore } from '@/store/auth.store';

export function useDashboardKpis(dateRange?: string) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'kpis', activeWorkspace?.id, dateRange],
    queryFn: async () => {
      const response = await dashboardApi.getKpis({ dateRange });
      return response.data.data;
    },
    enabled: !!activeWorkspace?.id,
  });
}

export function usePlatformVelocity(dateRange?: string) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'velocity', activeWorkspace?.id, dateRange],
    queryFn: async () => {
      // Mocking combining reach, engagement, followers charts into velocity
      // In a real app, you might have a single /dashboard/velocity endpoint
      // For now, we'll assume getOverview returns velocityData
      const response = await dashboardApi.getOverview({ dateRange });
      return response.data.data.velocity;
    },
    enabled: !!activeWorkspace?.id,
  });
}

export function useAiInsights() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'ai-insights', activeWorkspace?.id],
    queryFn: async () => {
      const response = await dashboardApi.getAiInsights();
      return response.data.data;
    },
    enabled: !!activeWorkspace?.id,
  });
}

export function useTopPosts(limit = 5) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'top-posts', activeWorkspace?.id, limit],
    queryFn: async () => {
      const response = await dashboardApi.getTopPosts({ limit });
      return response.data.data;
    },
    enabled: !!activeWorkspace?.id,
  });
}

export function useRecentActivity(limit = 5) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'activity', activeWorkspace?.id, limit],
    queryFn: async () => {
      const response = await dashboardApi.getRecentActivity({ limit });
      return response.data.data;
    },
    enabled: !!activeWorkspace?.id,
  });
}

export function usePlatformComparison() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  return useQuery({
    queryKey: ['dashboard', 'platform-comparison', activeWorkspace?.id],
    queryFn: async () => {
      const response = await dashboardApi.getPlatformComparison();
      return response.data.data;
    },
    enabled: !!activeWorkspace?.id,
  });
}
