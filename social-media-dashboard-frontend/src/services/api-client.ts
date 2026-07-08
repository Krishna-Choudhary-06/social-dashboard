import axios from 'axios';
import { API_BASE_URL } from '@/constants';

// ============================================================
// Axios Instance — Configured with interceptors
// ============================================================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor — Attach JWT ----
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const workspaceId = localStorage.getItem('active_workspace_id');
    if (workspaceId) {
      config.headers['X-Workspace-Id'] = workspaceId;

      // Dynamically rewrite URLs to include workspaceId where required by backend
      if (config.url) {
        if (config.url.startsWith('/dashboard') || config.url.startsWith('/analytics')) {
          config.url = `/workspaces/${workspaceId}${config.url}`;
        } else if (config.url === '/reports' || config.url === '/notifications' || config.url === '/notifications/unread-count') {
          config.url = `/workspaces/${workspaceId}${config.url}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor — Handle 401 refresh ----
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
