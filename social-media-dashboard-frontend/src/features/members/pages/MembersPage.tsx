import { useState } from 'react';
import { Box, Button, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { DataTable } from '@/components/tables/DataTable';

interface MemberRow { id: string; name: string; email: string; role: string; status: string; joined: string; avatar: string; }

const members: MemberRow[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@insightai.com', role: 'Owner', status: 'Active', joined: 'Jan 15, 2024', avatar: 'AR' },
  { id: '2', name: 'Sarah Kim', email: 'sarah@insightai.com', role: 'Editor', status: 'Active', joined: 'Feb 3, 2024', avatar: 'SK' },
  { id: '3', name: 'Jake Torres', email: 'jake@insightai.com', role: 'Viewer', status: 'Active', joined: 'Mar 12, 2024', avatar: 'JT' },
  { id: '4', name: 'Mia Chen', email: 'mia@insightai.com', role: 'Admin', status: 'Active', joined: 'Apr 8, 2024', avatar: 'MC' },
  { id: '5', name: 'pending@email.com', email: 'pending@email.com', role: 'Viewer', status: 'Invited', joined: '—', avatar: '?' },
];

const col = createColumnHelper<MemberRow>();
const columns = [
  col.accessor('name', {
    header: 'Member', cell: (info) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.dark' }}>{info.row.original.avatar}</Avatar>
        <Box><Typography variant="body2" fontWeight={500}>{info.getValue()}</Typography><Typography variant="caption" color="text.secondary">{info.row.original.email}</Typography></Box>
      </Box>
    ),
  }),
  col.accessor('role', { header: 'Role', cell: (info) => <Chip label={info.getValue()} size="small" variant="outlined" /> }),
  col.accessor('status', { header: 'Status', cell: (info) => <Chip label={info.getValue()} size="small" color={info.getValue() === 'Active' ? 'success' : 'default'} /> }),
  col.accessor('joined', { header: 'Joined' }),
];

export default function MembersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <Box>
      <PageHeader title="Members" subtitle="Manage workspace members and invitations." actions={<Button variant="contained" startIcon={<PersonAdd />} onClick={() => setInviteOpen(true)}>Invite Member</Button>} />
      <GlassCard><DataTable data={members} columns={columns} searchPlaceholder="Search members..." emptyTitle="No members" /></GlassCard>
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <TextField label="Email Address" fullWidth type="email" />
          <TextField label="Role" select fullWidth defaultValue="Viewer">{['Viewer', 'Editor', 'Admin'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}</TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}><Button onClick={() => setInviteOpen(false)}>Cancel</Button><Button variant="contained" onClick={() => setInviteOpen(false)}>Send Invite</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
