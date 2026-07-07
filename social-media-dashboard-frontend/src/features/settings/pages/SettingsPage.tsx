import { useState } from 'react';
import { Box, Tabs, Tab, Switch, FormControlLabel, Typography, Button, TextField, MenuItem, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Palette, Notifications, Security, Work } from '@mui/icons-material';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { useUIStore } from '@/store';

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
                  <ListItemSecondaryAction><Switch checked={themeMode === 'dark'} onChange={toggleTheme} /></ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Reduced Motion" secondary="Minimize animations for accessibility" />
                  <ListItemSecondaryAction><Switch /></ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Compact Mode" secondary="Use denser spacing for more content" />
                  <ListItemSecondaryAction><Switch /></ListItemSecondaryAction>
                </ListItem>
              </List>
            </GlassCard>
          )}

          {activeTab === 1 && (
            <GlassCard title="Notification Preferences">
              <List disablePadding>
                {['Email Notifications', 'Push Notifications', 'Weekly Digest', 'AI Insight Alerts', 'Sync Status Alerts'].map((n, i) => (
                  <Box key={n}><ListItem sx={{ px: 0 }}><ListItemText primary={n} /><ListItemSecondaryAction><Switch defaultChecked={i < 3} /></ListItemSecondaryAction></ListItem>{i < 4 && <Divider />}</Box>
                ))}
              </List>
            </GlassCard>
          )}

          {activeTab === 2 && (
            <GlassCard title="Security">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Two-Factor Authentication" />
                <TextField label="Session Timeout" select defaultValue="30" fullWidth sx={{ maxWidth: 300 }}>{['15', '30', '60', '120'].map((v) => <MenuItem key={v} value={v}>{v} minutes</MenuItem>)}</TextField>
                <Button variant="outlined" color="error" sx={{ alignSelf: 'flex-start' }}>Sign Out All Devices</Button>
              </Box>
            </GlassCard>
          )}

          {activeTab === 3 && (
            <GlassCard title="Workspace Settings">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Workspace Name" defaultValue="InsightAI Workspace" fullWidth />
                <TextField label="Default Timezone" select defaultValue="EST" fullWidth sx={{ maxWidth: 300 }}>{['EST', 'CST', 'MST', 'PST', 'UTC'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}><Button variant="contained">Save Changes</Button></Box>
              </Box>
            </GlassCard>
          )}
        </Box>
      </Box>
    </Box>
  );
}
