import { useState } from 'react';
import { Grid, Box, Card, CardContent, Typography, Avatar, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Link, LinkOff, Refresh, CheckCircle, Error, Sync, MoreVert } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { tokens } from '@/app/theme';

const accounts = [
  { id: '1', platform: 'Instagram', username: '@insightai', followers: '124.5K', status: 'synced', lastSync: '2 min ago', color: '#E4405F' },
  { id: '2', platform: 'Facebook', username: 'InsightAI', followers: '89.2K', status: 'synced', lastSync: '5 min ago', color: '#1877F2' },
  { id: '3', platform: 'Twitter / X', username: '@InsightAI_HQ', followers: '67.8K', status: 'synced', lastSync: '8 min ago', color: '#1DA1F2' },
  { id: '4', platform: 'LinkedIn', username: 'InsightAI', followers: '45.3K', status: 'synced', lastSync: '12 min ago', color: '#0A66C2' },
  { id: '5', platform: 'YouTube', username: 'InsightAI', followers: '32.1K', status: 'error', lastSync: 'Failed', color: '#FF0000' },
  { id: '6', platform: 'TikTok', username: '@InsightAI', followers: '—', status: 'disconnected', lastSync: 'Never', color: '#69C9D0' },
];

export default function ConnectedAccountsPage() {
  const [disconnectId, setDisconnectId] = useState<string | null>(null);

  return (
    <Box>
      <PageHeader title="Connected Accounts" subtitle="Manage your social media platform connections." actions={<Button variant="contained" startIcon={<Link />}>Connect</Button>} />
      <Grid container spacing={2.5}>
        {accounts.map((a) => (
          <Grid key={a.id} item xs={12} sm={6} lg={4}>
            <Card component={motion.div} whileHover={{ y: -3 }} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${a.color}18`, color: a.color, width: 44, height: 44, fontWeight: 700, fontSize: 18 }}>{a.platform[0]}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{a.platform}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.username}</Typography>
                  </Box>
                  <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box><Typography variant="overline">Followers</Typography><Typography variant="h5" fontWeight={700}>{a.followers}</Typography></Box>
                  <Chip icon={a.status === 'synced' ? <CheckCircle sx={{ fontSize: 14 }} /> : a.status === 'error' ? <Error sx={{ fontSize: 14 }} /> : <LinkOff sx={{ fontSize: 14 }} />} label={a.status} size="small" color={a.status === 'synced' ? 'success' : a.status === 'error' ? 'error' : 'default'} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: tokens.typography.fontFamily.mono, fontSize: '0.625rem', mb: 2, display: 'block' }}>Last sync: {a.lastSync}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {a.status !== 'disconnected' ? (<><Button size="small" startIcon={<Refresh />} variant="outlined" fullWidth>Refresh</Button><Button size="small" color="error" variant="outlined" onClick={() => setDisconnectId(a.id)}>Disconnect</Button></>) : (<Button size="small" startIcon={<Link />} variant="contained" fullWidth>Connect</Button>)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!disconnectId} onClose={() => setDisconnectId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Disconnect Account?</DialogTitle>
        <DialogContent><Typography variant="body2" color="text.secondary">This will stop syncing data. You can reconnect anytime.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDisconnectId(null)}>Cancel</Button><Button color="error" variant="contained" onClick={() => setDisconnectId(null)}>Disconnect</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
