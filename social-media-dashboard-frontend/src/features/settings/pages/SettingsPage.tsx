import { useState } from 'react';
import { Box, Tabs, Tab, Switch, FormControlLabel, Typography, Button, TextField, MenuItem, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Palette, Notifications, Security, Work } from '@mui/icons-material';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { useUIStore } from '@/store';
import { useSettings } from '../hooks/useSettings';
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace';
import { useAuthStore } from '@/store/auth.store';

const tabs = [
  { label: 'Appearance', icon: <Palette /> },
  { label: 'Notifications', icon: <Notifications /> },
  { label: 'Security', icon: <Security /> },
  { label: 'Workspace', icon: <Work /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const themeMode = useUIStore((s) => s.themeMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const { details, updateAppearance, updateNotifications, updateSecurity } = useSettings();
  
  const activeWorkspace = useAuthStore((s) => s.activeWorkspace);
  const { details: workspaceDetails, update: updateWorkspace } = useWorkspace(activeWorkspace?.id || '');

  const [workspaceName, setWorkspaceName] = useState(workspaceDetails.data?.name || 'InsightAI Workspace');
  const [workspaceTz, setWorkspaceTz] = useState('EST');

  const settingsData = details.data || {};

  const handleAppearanceChange = (key: string, value: boolean) => {
    updateAppearance.mutate({ ...settingsData.appearance, [key]: value });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    updateNotifications.mutate({ ...settingsData.notifications, [key]: value });
  };

  const handleSecurityChange = (key: string, value: boolean) => {
    updateSecurity.mutate({ ...settingsData.security, [key]: value });
  };

  const handleWorkspaceSave = () => {
    if (activeWorkspace) {
      updateWorkspace.mutate({ name: workspaceName });
    }
  };

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Configure your application preferences." />
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} orientation="vertical" sx={{ minWidth: 200, display: { xs: 'none', md: 'flex' }, '& .MuiTab-root': { justifyContent: 'flex-start', textAlign: 'left', minHeight: 44 } }}>
          {tabs.map((t) => <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label} />)}
        </Tabs>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ display: { xs: 'flex', md: 'none' }, mb: 2 }}>
          {tabs.map((t) => <Tab key={t.label} label={t.label} />)}
        </Tabs>

        <Box sx={{ flex: 1 }}>
          {activeTab === 0 && (
            <GlassCard title="Appearance">
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Dark Mode" secondary="Use dark theme across the application" />
                  <ListItemSecondaryAction><Switch checked={themeMode === 'dark'} onChange={(e) => { toggleTheme(); handleAppearanceChange('darkMode', e.target.checked); }} disabled={updateAppearance.isPending} /></ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Reduced Motion" secondary="Minimize animations for accessibility" />
                  <ListItemSecondaryAction><Switch defaultChecked={settingsData.appearance?.reducedMotion} onChange={(e) => handleAppearanceChange('reducedMotion', e.target.checked)} disabled={updateAppearance.isPending} /></ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Compact Mode" secondary="Use denser spacing for more content" />
                  <ListItemSecondaryAction><Switch defaultChecked={settingsData.appearance?.compactMode} onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)} disabled={updateAppearance.isPending} /></ListItemSecondaryAction>
                </ListItem>
              </List>
            </GlassCard>
          )}

          {activeTab === 1 && (
            <GlassCard title="Notification Preferences">
              <List disablePadding>
                {['Email Notifications', 'Push Notifications', 'Weekly Digest', 'AI Insight Alerts', 'Sync Status Alerts'].map((n, i) => {
                  const key = n.replace(/\s+/g, '');
                  return (
                    <Box key={n}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary={n} />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked={settingsData.notifications?.[key] ?? i < 3} onChange={(e) => handleNotificationChange(key, e.target.checked)} disabled={updateNotifications.isPending} />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {i < 4 && <Divider />}
                    </Box>
                  );
                })}
              </List>
            </GlassCard>
          )}

          {activeTab === 2 && (
            <GlassCard title="Security">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel control={<Switch defaultChecked={settingsData.security?.twoFactor} onChange={(e) => handleSecurityChange('twoFactor', e.target.checked)} disabled={updateSecurity.isPending} />} label="Two-Factor Authentication" />
                <TextField label="Session Timeout" select defaultValue="30" fullWidth sx={{ maxWidth: 300 }}>{['15', '30', '60', '120'].map((v) => <MenuItem key={v} value={v}>{v} minutes</MenuItem>)}</TextField>
                <Button variant="outlined" color="error" sx={{ alignSelf: 'flex-start' }}>Sign Out All Devices</Button>
              </Box>
            </GlassCard>
          )}

          {activeTab === 3 && (
            <GlassCard title="Workspace Settings">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Workspace Name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} fullWidth />
                <TextField label="Default Timezone" select value={workspaceTz} onChange={(e) => setWorkspaceTz(e.target.value)} fullWidth sx={{ maxWidth: 300 }}>{['EST', 'CST', 'MST', 'PST', 'UTC'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}><Button variant="contained" onClick={handleWorkspaceSave} disabled={updateWorkspace.isPending}>{updateWorkspace.isPending ? 'Saving...' : 'Save Changes'}</Button></Box>
              </Box>
            </GlassCard>
          )}
        </Box>
      </Box>
    </Box>
  );
}
