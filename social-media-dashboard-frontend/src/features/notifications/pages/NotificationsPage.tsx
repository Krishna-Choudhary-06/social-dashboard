import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, Button, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { MarkEmailRead, Delete, Info, CheckCircle, Warning, Error, AutoAwesome } from '@mui/icons-material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { tokens } from '@/app/theme';
import { useNotifications } from '../hooks/useNotifications';

const notifications = [
  { id: '1', type: 'success' as const, title: 'Report Generated', message: 'Monthly Performance Report is ready for download.', time: '5 min ago', read: false },
  { id: '2', type: 'ai_insight' as const, title: 'AI Insight', message: 'Engagement spike detected on Instagram — 34% above average.', time: '1 hour ago', read: false },
  { id: '3', type: 'info' as const, title: 'Sync Complete', message: 'All connected accounts have been synced successfully.', time: '2 hours ago', read: false },
  { id: '4', type: 'warning' as const, title: 'Token Expiring', message: 'Your Facebook access token expires in 3 days. Please reconnect.', time: '4 hours ago', read: true },
  { id: '5', type: 'error' as const, title: 'Sync Failed', message: 'Twitter sync failed due to API rate limits. Retrying in 15 minutes.', time: '6 hours ago', read: true },
  { id: '6', type: 'info' as const, title: 'New Member', message: 'Sarah K. joined the workspace as Editor.', time: '1 day ago', read: true },
  { id: '7', type: 'success' as const, title: 'Milestone', message: 'You crossed 500K combined followers! 🎉', time: '2 days ago', read: true },
];

const iconMap: any = {
  info: <Info />,
  success: <CheckCircle />,
  warning: <Warning />,
  error: <Error />,
  ai_insight: <AutoAwesome />,
};

const colorMap: any = {
  info: tokens.colors.tertiary,
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  error: tokens.colors.error,
  ai_insight: tokens.colors.primary,
};

export default function NotificationsPage() {
  const [tab, setTab] = useState(0);
  const { list, unreadCount, markAllAsRead, remove } = useNotifications({ unreadOnly: tab === 1 });

  const displayNotifications = list.data || notifications;
  const filtered = tab === 1 ? displayNotifications.filter((n: any) => !n.read) : displayNotifications;
  const currentUnreadCount = unreadCount.data || notifications.filter((n) => !n.read).length;

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle={`${currentUnreadCount} unread notifications`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          <Button startIcon={<MarkEmailRead />} variant="outlined" size="small" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
            Mark All Read
          </Button>
        }
      />

      <GlassCard>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="All" />
          <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Unread <Chip label={currentUnreadCount} size="small" color="primary" sx={{ height: 20, fontSize: '0.625rem' }} /></Box>} />
        </Tabs>

        <List disablePadding>
          <AnimatePresence>
            {filtered.map((notif: any) => (
              <ListItem
                key={notif.id}
                component={motion.li}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                sx={{
                  py: 2,
                  px: 0,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: notif.read ? 'transparent' : (t) => t.palette.mode === 'dark' ? 'rgba(192, 193, 255, 0.03)' : 'rgba(73, 75, 214, 0.03)',
                }}
                secondaryAction={
                  <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => remove.mutate(notif.id)}><Delete fontSize="small" /></IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${colorMap[notif.type]}18`, color: colorMap[notif.type], width: 40, height: 40 }}>
                    {iconMap[notif.type]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={notif.read ? 400 : 600}>{notif.title}</Typography>
                      {!notif.read && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>{notif.message}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: tokens.typography.fontFamily.mono, fontSize: '0.625rem', mt: 0.5, display: 'block' }}>{notif.time}</Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </AnimatePresence>
        </List>

        {filtered.length === 0 && <EmptyState title="All caught up!" description="No unread notifications." />}
      </GlassCard>
    </Box>
  );
}
