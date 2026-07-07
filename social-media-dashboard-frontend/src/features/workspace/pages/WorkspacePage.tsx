import { Grid, Box, Typography, Card, CardContent, Button, Chip, LinearProgress, List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material';
import { Add, People, AccountTree, Assessment, TrendingUp } from '@mui/icons-material';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/cards/StatCard';
import { GlassCard } from '@/components/cards/GlassCard';
import { tokens } from '@/app/theme';

const recentMembers = [
  { name: 'Alex Rivera', role: 'Owner', avatar: 'AR' },
  { name: 'Sarah Kim', role: 'Editor', avatar: 'SK' },
  { name: 'Jake Torres', role: 'Viewer', avatar: 'JT' },
  { name: 'Mia Chen', role: 'Admin', avatar: 'MC' },
];

export default function WorkspacePage() {
  return (
    <Box>
      <PageHeader title="Workspace" subtitle="Manage your workspace settings and overview." actions={<Button variant="contained" startIcon={<Add />}>New Workspace</Button>} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard label="Members" value="12" icon={<People sx={{ fontSize: 18 }} />} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Connected Accounts" value="5" icon={<AccountTree sx={{ fontSize: 18 }} />} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Reports Generated" value="48" change={12} trend="up" icon={<Assessment sx={{ fontSize: 18 }} />} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="API Usage" value="67%" icon={<TrendingUp sx={{ fontSize: 18 }} />} /></Grid>
      </Grid>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <GlassCard title="Workspace Details">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[['Name', 'InsightAI Workspace'], ['Plan', 'Pro'], ['Created', 'Jan 15, 2024'], ['Slug', 'insightai-hq']].map(([l, v]) => (
                <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">{l}</Typography>
                  <Typography variant="body2" fontWeight={500}>{v}</Typography>
                </Box>
              ))}
              <Box><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Storage Used (4.2 GB / 10 GB)</Typography><LinearProgress variant="determinate" value={42} sx={{ height: 6, borderRadius: 3 }} /></Box>
            </Box>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <GlassCard title="Recent Members" actions={<Button size="small" variant="text">View All</Button>}>
            <List disablePadding>
              {recentMembers.map((m, i) => (
                <ListItem key={i} sx={{ px: 0, borderBottom: i < recentMembers.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.dark', width: 36, height: 36, fontSize: '0.75rem' }}>{m.avatar}</Avatar></ListItemAvatar>
                  <ListItemText primary={m.name} secondary={m.role} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                  <Chip label={m.role} size="small" variant="outlined" sx={{ fontSize: '0.6875rem' }} />
                </ListItem>
              ))}
            </List>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
