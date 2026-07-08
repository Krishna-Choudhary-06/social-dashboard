import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../shared-api';

export function useSettings() {
  const queryClient = useQueryClient();

  const details = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.get();
      return response.data.data;
    },
  });

  const updateAppearance = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await settingsApi.updateAppearance(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateNotifications = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await settingsApi.updateNotifications(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateSecurity = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await settingsApi.updateSecurity(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    details,
    updateAppearance,
    updateNotifications,
    updateSecurity,
  };
}
