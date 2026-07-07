import { Navigate, type ReactNode } from 'react-router';

/** Protects routes that require authentication */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects authenticated users away from guest-only pages */
export function GuestRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('access_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Role-based access guard */
export function RoleGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
  // In production, this would read from an auth context/query
  const userRole = localStorage.getItem('user_role') || 'viewer';
  if (!allowedRoles.includes(userRole)) return <Navigate to="/403" replace />;
  return <>{children}</>;
}

/** Workspace selection guard */
export function WorkspaceGuard({ children }: { children: ReactNode }) {
  const workspaceId = localStorage.getItem('active_workspace_id');
  if (!workspaceId) return <Navigate to="/workspace" replace />;
  return <>{children}</>;
}
