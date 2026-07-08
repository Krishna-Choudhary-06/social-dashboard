import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../../shared-api';
import { useAuthStore } from '@/store/auth.store';

export function useProfile() {
  const queryClient = useQueryClient();

  const details = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await profileApi.get();
      return response.data.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<{ firstName: string; lastName: string; avatar: string }>) => {
      const response = await profileApi.update(data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });

  const updatePassword = useMutation({
    mutationFn: async (data: any) => {
      const response = await profileApi.updatePassword(data);
      return response.data.data;
    },
  });

  return {
    details,
    updateProfile,
    updatePassword,
  };
}
