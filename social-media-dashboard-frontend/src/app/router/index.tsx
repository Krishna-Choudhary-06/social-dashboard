import { createBrowserRouter, Navigate } from 'react-router';
import { Suspense, lazy } from 'react';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ProtectedRoute, GuestRoute } from './guards';
import { NotFoundPage, ForbiddenPage, ServerErrorPage } from './error-pages';
import { LoadingOverlay } from '@/components/loaders/LoadingOverlay';

// ---- Lazy-loaded Pages ----
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const ConnectedAccountsPage = lazy(() => import('@/features/connected-accounts/pages/ConnectedAccountsPage'));
const WorkspacePage = lazy(() => import('@/features/workspace/pages/WorkspacePage'));
const MembersPage = lazy(() => import('@/features/members/pages/MembersPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingOverlay fullScreen message="Loading page..." />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // ---- Public / Auth Routes ----
  {
    element: <GuestRoute><AuthLayout /></GuestRoute>,
    children: [
      { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: '/register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      { path: '/forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: '/reset-password', element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper> },
    ],
  },

  // ---- Protected / App Routes ----
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: '/analytics', element: <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper> },
      { path: '/reports', element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper> },
      { path: '/notifications', element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
      { path: '/connected-accounts', element: <SuspenseWrapper><ConnectedAccountsPage /></SuspenseWrapper> },
      { path: '/workspace', element: <SuspenseWrapper><WorkspacePage /></SuspenseWrapper> },
      { path: '/members', element: <SuspenseWrapper><MembersPage /></SuspenseWrapper> },
      { path: '/profile', element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
    ],
  },

  // ---- Error Routes ----
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/500', element: <ServerErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
