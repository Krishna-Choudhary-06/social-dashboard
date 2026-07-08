import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router';

// Adjust these types based on the actual backend response
interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: any; // User type from auth.store
    workspaces: any[]; // Workspace array
  };
}

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: Parameters<typeof authApi.login>[0]) => {
      const response = await authApi.login(credentials);
      return response.data as LoginResponse;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user, workspaces } = data.data;
      login({ accessToken, refreshToken }, user, workspaces || []);
      navigate('/dashboard', { replace: true });
    },
  });
}

export function useRegister() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: Parameters<typeof authApi.register>[0]) => {
      const response = await authApi.register(data);
      return response.data as LoginResponse;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user, workspaces } = data.data;
      login({ accessToken, refreshToken }, user, workspaces || []);
      navigate('/dashboard', { replace: true });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSettled: () => {
      // Regardless of whether API logout succeeds or fails, we clear local state
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}
