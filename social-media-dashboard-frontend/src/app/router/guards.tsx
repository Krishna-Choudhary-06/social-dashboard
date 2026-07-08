import { Navigate, type ReactNode } from 'react-router';
import { useAuthStore } from '@/store/auth.store';

/** Protects routes that require authentication */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects authenticated users away from guest-only pages */
export function GuestRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Role-based access guard */
export function RoleGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
  const user = useAuthStore((state) => state.user);
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/403" replace />;
  return <>{children}</>;
}

/** Workspace selection guard */
export function WorkspaceGuard({ children }: { children: ReactNode }) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  if (!activeWorkspace) return <Navigate to="/workspace" replace />;
  return <>{children}</>;
}
