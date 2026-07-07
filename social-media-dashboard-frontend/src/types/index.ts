// ============================================================
// Global Type Definitions
// ============================================================

export type ThemeMode = 'light' | 'dark';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'disconnected';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'ai_insight';

export type ReportStatus = 'pending' | 'generating' | 'completed' | 'failed';

export type ReportFormat = 'pdf' | 'csv' | 'xlsx';

// ---- API Response Wrappers ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ---- User & Auth ----
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ---- Workspace ----
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  ownerId: string;
  memberCount: number;
  connectedAccountsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatar'>;
  role: UserRole;
  joinedAt: string;
  status: 'active' | 'invited' | 'suspended';
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

// ---- Connected Accounts ----
export interface ConnectedAccount {
  id: string;
  platform: Platform;
  platformUserId: string;
  displayName: string;
  username: string;
  avatar?: string;
  status: SyncStatus;
  lastSyncAt: string;
  followerCount: number;
  createdAt: string;
}

// ---- Analytics ----
export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PlatformChartData {
  platform: Platform;
  data: ChartDataPoint[];
  color: string;
}

export interface AnalyticsOverview {
  kpis: KpiMetric[];
  growthChart: ChartDataPoint[];
  reachChart: ChartDataPoint[];
  engagementChart: ChartDataPoint[];
  followersChart: ChartDataPoint[];
  platformComparison: PlatformComparisonData[];
  audienceOverview: AudienceDemographic[];
}

export interface PlatformComparisonData {
  platform: Platform;
  followers: number;
  engagement: number;
  reach: number;
  posts: number;
}

export interface AudienceDemographic {
  category: string;
  value: number;
  percentage: number;
}

export interface TopPost {
  id: string;
  title: string;
  platform: Platform;
  engagement: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: string;
  thumbnail?: string;
}

// ---- AI Insights ----
export interface AiInsight {
  id: string;
  type: 'growth_forecast' | 'content_optimization' | 'sentiment_shift' | 'anomaly_detection';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  actionable: boolean;
}

// ---- Reports ----
export interface Report {
  id: string;
  title: string;
  type: string;
  status: ReportStatus;
  format: ReportFormat;
  createdBy: string;
  dateRange: { start: string; end: string };
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
  completedAt?: string;
}

// ---- Notifications ----
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ---- Activity ----
export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  actor?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ---- Date Range ----
export interface DateRange {
  startDate: string;
  endDate: string;
  label?: string;
}

// ---- Sidebar Navigation ----
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
