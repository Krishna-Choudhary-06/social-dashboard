import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';

// ============================================================
// UI Store — Sidebar, Theme, Dialogs, Drawer
// ============================================================

interface UIState {
  // Theme
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile drawer
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;

  // Dialogs
  activeDialog: string | null;
  dialogData: Record<string, unknown> | null;
  openDialog: (id: string, data?: Record<string, unknown>) => void;
  closeDialog: () => void;

  // Workspace
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;

  // Global search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Notification panel
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      themeMode: 'dark',
      toggleTheme: () =>
        set((s) => ({ themeMode: s.themeMode === 'dark' ? 'light' : 'dark' })),
      setThemeMode: (mode) => set({ themeMode: mode }),

      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Mobile drawer
      mobileDrawerOpen: false,
      setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),

      // Dialogs
      activeDialog: null,
      dialogData: null,
      openDialog: (id, data) => set({ activeDialog: id, dialogData: data ?? null }),
      closeDialog: () => set({ activeDialog: null, dialogData: null }),

      // Workspace
      activeWorkspaceId: null,
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

      // Global search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Notification panel
      notificationPanelOpen: false,
      setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
    }),
    {
      name: 'insightai-ui-preferences',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
