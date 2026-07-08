import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectedAccountsApi } from '../../shared-api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useConnectedAccounts() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [...QUERY_KEYS.connectedAccounts, workspaceId],
    queryFn: async () => {
      const response = await connectedAccountsApi.getAll();
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const syncStatus = useQuery({
    queryKey: [...QUERY_KEYS.connectedAccounts, 'sync-status', workspaceId],
    queryFn: async () => {
      const response = await connectedAccountsApi.getSyncStatus();
      return response.data.data;
    },
    enabled: !!workspaceId,
    refetchInterval: 60000,
  });

  const connect = useMutation({
    mutationFn: async (platform: string) => {
      const response = await connectedAccountsApi.connect(platform);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.connectedAccounts });
    },
  });

  const disconnect = useMutation({
    mutationFn: async (id: string) => {
      const response = await connectedAccountsApi.disconnect(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.connectedAccounts });
    },
  });

  const refresh = useMutation({
    mutationFn: async (id: string) => {
      const response = await connectedAccountsApi.refresh(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.connectedAccounts });
    },
  });

  return {
    list,
    syncStatus,
    connect,
    disconnect,
    refresh,
    isLoading: list.isLoading || syncStatus.isLoading,
    isError: list.isError || syncStatus.isError,
  };
}
