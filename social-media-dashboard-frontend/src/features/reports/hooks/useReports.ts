import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../../shared-api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useReports(params?: { page?: number; limit?: number; status?: string }) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [...QUERY_KEYS.reports, workspaceId, params],
    queryFn: async () => {
      const response = await reportsApi.getAll(params);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const generate = useMutation({
    mutationFn: async (data: { title: string; type: string; dateRange: { start: string; end: string }; format: string }) => {
      const response = await reportsApi.generate(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const response = await reportsApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    },
  });

  return {
    list,
    generate,
    remove,
    isLoading: list.isLoading,
    isError: list.isError,
  };
}
