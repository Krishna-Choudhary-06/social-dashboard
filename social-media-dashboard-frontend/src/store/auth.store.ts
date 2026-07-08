import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
}

interface AuthState {
  user: User | null;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User, workspaces: Workspace[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activeWorkspace: null,
      workspaces: [],
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setActiveWorkspace: (workspace) => {
        if (workspace) {
          localStorage.setItem('active_workspace_id', workspace.id);
        } else {
          localStorage.removeItem('active_workspace_id');
        }
        set({ activeWorkspace: workspace });
      },
      login: (tokens, user, workspaces) => {
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;
        if (activeWorkspace) {
          localStorage.setItem('active_workspace_id', activeWorkspace.id);
        }
        set({ user, workspaces, activeWorkspace, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('active_workspace_id');
        set({ user: null, activeWorkspace: null, workspaces: [], isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      // We only persist the non-sensitive state, token is already in localStorage.
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        workspaces: state.workspaces,
        activeWorkspace: state.activeWorkspace
      }),
    }
  )
);
