import type { Platform, NavItem, DateRange } from '@/types';

// ============================================================
// Application Constants
// ============================================================

export const APP_NAME = 'InsightAI';
export const APP_TAGLINE = 'Intelligence with Transparency';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const SIDEBAR_EXPANDED_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const TOPBAR_HEIGHT = 64;

// ---- Platform Metadata ----
export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; icon: string }> = {
  facebook: { label: 'Facebook', color: '#1877F2', icon: 'Facebook' },
  instagram: { label: 'Instagram', color: '#E4405F', icon: 'Instagram' },
  twitter: { label: 'X (Twitter)', color: '#1DA1F2', icon: 'Twitter' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: 'LinkedIn' },
  youtube: { label: 'YouTube', color: '#FF0000', icon: 'YouTube' },
  tiktok: { label: 'TikTok', color: '#000000', icon: 'MusicNote' },
};

// ---- Navigation Items ----
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { label: 'Analytics', path: '/analytics', icon: 'Analytics' },
  { label: 'Reports', path: '/reports', icon: 'Assessment' },
  { label: 'Connected Accounts', path: '/connected-accounts', icon: 'AccountTree' },
  { label: 'Notifications', path: '/notifications', icon: 'Notifications' },
  { label: 'Workspace', path: '/workspace', icon: 'Work' },
  { label: 'Members', path: '/members', icon: 'Group' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Profile', path: '/profile', icon: 'Person' },
];

// ---- Date Range Presets ----
export const DATE_RANGE_PRESETS: (DateRange & { label: string })[] = [
  { label: 'Last 7 days', startDate: '', endDate: '' },
  { label: 'Last 14 days', startDate: '', endDate: '' },
  { label: 'Last 30 days', startDate: '', endDate: '' },
  { label: 'Last 90 days', startDate: '', endDate: '' },
  { label: 'This Month', startDate: '', endDate: '' },
  { label: 'Last Month', startDate: '', endDate: '' },
  { label: 'This Quarter', startDate: '', endDate: '' },
  { label: 'This Year', startDate: '', endDate: '' },
];

// ---- Role Labels ----
export const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

// ---- Query Keys ----
export const QUERY_KEYS = {
  user: ['user'] as const,
  workspaces: ['workspaces'] as const,
  workspace: (id: string) => ['workspace', id] as const,
  members: (workspaceId: string) => ['members', workspaceId] as const,
  connectedAccounts: ['connected-accounts'] as const,
  dashboardOverview: ['dashboard', 'overview'] as const,
  dashboardKpis: ['dashboard', 'kpis'] as const,
  analyticsOverview: ['analytics', 'overview'] as const,
  analyticsGrowth: ['analytics', 'growth'] as const,
  analyticsEngagement: ['analytics', 'engagement'] as const,
  analyticsAudience: ['analytics', 'audience'] as const,
  reports: ['reports'] as const,
  notifications: ['notifications'] as const,
  topPosts: ['top-posts'] as const,
  aiInsights: ['ai-insights'] as const,
  activity: ['activity'] as const,
} as const;

// ---- Breakpoints ----
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;
