import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../shared-api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [...QUERY_KEYS.notifications, workspaceId, params],
    queryFn: async () => {
      const response = await notificationsApi.getAll(params);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const unreadCount = useQuery({
    queryKey: [...QUERY_KEYS.notifications, 'unread-count', workspaceId],
    queryFn: async () => {
      const response = await notificationsApi.getUnreadCount();
      return response.data.data;
    },
    enabled: !!workspaceId,
    refetchInterval: 60000, // Poll every minute for new notifications
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsApi.markAsRead(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const response = await notificationsApi.markAllAsRead();
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });

  return {
    list,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    isLoading: list.isLoading || unreadCount.isLoading,
    isError: list.isError || unreadCount.isError,
  };
}
