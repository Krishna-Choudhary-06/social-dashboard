import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const { isAuthenticated, activeWorkspace } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      });

      // Global notification listener
      socket.on('new_notification', (notification) => {
        // Invalidate notifications to fetch the new one
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
        
        // Optionally show a toast here if a toast system was available
        console.log('New notification:', notification);
      });
      
      // Global sync status listener
      socket.on('sync_status', (statusUpdate) => {
        // Invalidate connected accounts sync status
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.connectedAccounts, 'sync-status'] });
      });

      // Global report progress listener
      socket.on('report_progress', (progress) => {
        // We could invalidate reports list if it's completed
        if (progress.status === 'completed' || progress.status === 'failed') {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
        }
      });
    }

    return () => {
      // Don't disconnect on unmount, we want the socket to persist across page navigations
      // unless the token is cleared (handled above).
    };
  }, [isAuthenticated, queryClient]);

  // Join workspace room when active workspace changes
  useEffect(() => {
    if (socket && isConnected && activeWorkspace?.id) {
      socket.emit('joinWorkspace', activeWorkspace.id);

      return () => {
        if (socket && isConnected) {
          socket.emit('leaveWorkspace', activeWorkspace.id);
        }
      };
    }
  }, [isConnected, activeWorkspace?.id]);

  // Expose a method to listen to specific events if needed in individual components
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
    return () => {
      if (socket) {
        socket.off(event, callback);
      }
    };
  }, []);

  return { isConnected, subscribe };
};
