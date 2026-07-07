import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tooltip,
  InputBase,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  DarkMode,
  LightMode,
  Person,
  Settings,
  Logout,
  KeyboardArrowDown,
  CalendarMonth,
  FilterList,
  AutoAwesome,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUIStore } from '@/store';
import { useIsMobile } from '@/hooks';
import { TOPBAR_HEIGHT } from '@/constants';
import { tokens } from '@/app/theme';

export function Topbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const themeMode = useUIStore((s) => s.themeMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setNotificationPanelOpen = useUIStore((s) => s.setNotificationPanelOpen);

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [workspaceAnchor, setWorkspaceAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      sx={{
        height: TOPBAR_HEIGHT,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: '100%', gap: 1, px: { xs: 1.5, md: 3 } }}>
        {/* Mobile Hamburger */}
        {isMobile && (
          <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: 'text.primary' }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Workspace Switcher */}
        <Button
          onClick={(e) => setWorkspaceAnchor(e.currentTarget)}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          Workspace
        </Button>
        <Menu
          anchorEl={workspaceAnchor}
          open={Boolean(workspaceAnchor)}
          onClose={() => setWorkspaceAnchor(null)}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { setWorkspaceAnchor(null); navigate('/workspace'); }}>
            <ListItemText primary="Alex Rivera" secondary="Pro Plan" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setWorkspaceAnchor(null); navigate('/workspace'); }}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            <ListItemText>Manage Workspaces</ListItemText>
          </MenuItem>
        </Menu>

        {/* Global Search */}
        <Box
          onClick={() => setSearchOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            minWidth: { xs: 0, sm: 200, md: 280 },
            transition: tokens.motion.fast,
            '&:hover': { borderColor: 'text.secondary' },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
          <InputBase
            placeholder="Search... ⌘K"
            readOnly
            sx={{
              flex: 1,
              fontSize: '0.8125rem',
              color: 'text.secondary',
              cursor: 'pointer',
              '& input': { cursor: 'pointer' },
            }}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Platform Filter */}
        <Tooltip title="Platform Filter">
          <IconButton sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
            <FilterList />
          </IconButton>
        </Tooltip>

        {/* Date Range */}
        <Chip
          icon={<CalendarMonth sx={{ fontSize: 16 }} />}
          label="Last 30 days"
          variant="outlined"
          size="small"
          sx={{
            display: { xs: 'none', lg: 'flex' },
            borderColor: 'divider',
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: '0.6875rem',
          }}
        />

        {/* AI Insights */}
        <Tooltip title="AI Insights">
          <IconButton sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
            <AutoAwesome />
          </IconButton>
        </Tooltip>

        {/* Notification Bell */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={() => setNotificationPanelOpen(true)}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={3} color="secondary" variant="dot">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
        <Tooltip title="Profile">
          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.875rem',
                fontWeight: 600,
                bgcolor: 'primary.dark',
              }}
            >
              AR
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { width: 220, mt: 1 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>Alex Rivera</Typography>
            <Typography variant="caption" color="text.secondary">alex@insightai.com</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>
            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setProfileAnchor(null); navigate('/login'); }}>
            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
