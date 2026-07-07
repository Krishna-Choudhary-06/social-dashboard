import { useLocation, useNavigate } from 'react-router';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  Assessment,
  AccountTree,
  Notifications,
  Work,
  Group,
  Settings,
  Person,
  ChevronLeft,
  ChevronRight,
  AutoAwesome,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store';
import { useIsMobile } from '@/hooks';
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH, APP_NAME } from '@/constants';
import { tokens } from '@/app/theme';

// ---- Icon Map ----
const iconMap: Record<string, React.ElementType> = {
  Dashboard, Analytics, Assessment, AccountTree,
  Notifications, Work, Group, Settings, Person,
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { label: 'Analytics', path: '/analytics', icon: 'Analytics' },
  { label: 'Reports', path: '/reports', icon: 'Assessment' },
  { label: 'Connected Accounts', path: '/connected-accounts', icon: 'AccountTree' },
  { label: 'Notifications', path: '/notifications', icon: 'Notifications' },
];

const bottomNav = [
  { label: 'Workspace', path: '/workspace', icon: 'Work' },
  { label: 'Members', path: '/members', icon: 'Group' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Profile', path: '/profile', icon: 'Person' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.mobileDrawerOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen);

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileDrawerOpen(false);
  };

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 2,
        px: collapsed ? 1 : 2,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: collapsed ? 0.5 : 1, mb: 3, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <AutoAwesome sx={{ fontSize: 20 }} />
        </Avatar>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {APP_NAME}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.625rem', opacity: 0.5 }}>
                Social Analytics
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Workspace Chip */}
      {!collapsed && (
        <Box sx={{ px: 1, mb: 2 }}>
          <Chip
            label="Pro Plan"
            size="small"
            sx={{
              bgcolor: 'rgba(192, 193, 255, 0.12)',
              color: 'primary.main',
              fontFamily: tokens.typography.fontFamily.mono,
              fontSize: '0.6875rem',
              fontWeight: 600,
              width: '100%',
              justifyContent: 'flex-start',
              px: 1,
            }}
          />
        </Box>
      )}

      {/* Main Nav */}
      <List sx={{ flex: 1, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right" arrow>
              <ListItemButton
                selected={active}
                onClick={() => handleNav(item.path)}
                sx={{
                  minHeight: 44,
                  px: collapsed ? 1.5 : 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  '&::before': active
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: 3,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: 'primary.main',
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: active ? 600 : 400,
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Bottom Nav */}
      <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        {bottomNav.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right" arrow>
              <ListItemButton
                selected={active}
                onClick={() => handleNav(item.path)}
                sx={{
                  minHeight: 40,
                  px: collapsed ? 1.5 : 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  '&::before': active
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: 3,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: 'primary.main',
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: active ? 600 : 400,
                      fontSize: '0.8125rem',
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {/* Collapse Toggle */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton onClick={toggleSidebar} size="small" sx={{ color: 'text.secondary' }}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  // Mobile: temporary drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_EXPANDED_WIDTH,
            bgcolor: 'background.paper',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop: persistent drawer
  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        transition: tokens.motion.normal,
      }}
    >
      <Drawer
        variant="permanent"
        open
        sx={{
          '& .MuiDrawer-paper': {
            width,
            transition: tokens.motion.normal,
            overflowX: 'hidden',
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? tokens.colors.surfaceContainerLow
              : undefined,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
}
