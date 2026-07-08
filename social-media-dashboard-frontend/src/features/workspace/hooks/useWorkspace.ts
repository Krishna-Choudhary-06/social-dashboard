import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../../shared-api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants';

export function useWorkspace() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const workspaceId = activeWorkspace?.id;
  const queryClient = useQueryClient();

  const details = useQuery({
    queryKey: QUERY_KEYS.workspace(workspaceId || ''),
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = await workspaceApi.getById(workspaceId);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const members = useQuery({
    queryKey: QUERY_KEYS.members(workspaceId || ''),
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await workspaceApi.getMembers(workspaceId);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });

  const inviteMember = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      if (!workspaceId) throw new Error('No active workspace');
      const response = await workspaceApi.inviteMember(workspaceId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members(workspaceId || '') });
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      if (!workspaceId) throw new Error('No active workspace');
      const response = await workspaceApi.removeMember(workspaceId, memberId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members(workspaceId || '') });
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      if (!workspaceId) throw new Error('No active workspace');
      const response = await workspaceApi.updateMemberRole(workspaceId, memberId, role);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members(workspaceId || '') });
    },
  });

  return {
    details,
    members,
    inviteMember,
    removeMember,
    updateRole,
    isLoading: details.isLoading || members.isLoading,
    isError: details.isError || members.isError,
  };
}
