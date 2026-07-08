import { useState } from 'react';
import { Box, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography } from '@mui/material';
import { Add, Download, Description } from '@mui/icons-material';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { DataTable } from '@/components/tables/DataTable';
import { tokens } from '@/app/theme';
import { useReports } from '../hooks/useReports';

interface ReportRow {
  id: string;
  title: string;
  type: string;
  status: string;
  format: string;
  dateRange: string;
  createdAt: string;
}

const reports: ReportRow[] = [
  { id: '1', title: 'Monthly Performance Report', type: 'Performance', status: 'completed', format: 'PDF', dateRange: 'Jun 1 - Jun 30, 2024', createdAt: '2024-07-01' },
  { id: '2', title: 'Q2 Engagement Analysis', type: 'Engagement', status: 'completed', format: 'XLSX', dateRange: 'Apr 1 - Jun 30, 2024', createdAt: '2024-07-02' },
  { id: '3', title: 'Instagram Growth Report', type: 'Growth', status: 'generating', format: 'PDF', dateRange: 'Jan 1 - Jun 30, 2024', createdAt: '2024-07-05' },
  { id: '4', title: 'Competitor Benchmarking', type: 'Benchmark', status: 'pending', format: 'CSV', dateRange: 'Jun 1 - Jun 30, 2024', createdAt: '2024-07-06' },
  { id: '5', title: 'Weekly Snapshot', type: 'Overview', status: 'completed', format: 'PDF', dateRange: 'Jun 24 - Jun 30, 2024', createdAt: '2024-07-07' },
];

const col = createColumnHelper<ReportRow>();

const columns = [
  col.accessor('title', {
    header: 'Report',
    cell: (info) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Description sx={{ fontSize: 18, color: 'primary.main', opacity: 0.7 }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
      </Box>
    ),
  }),
  col.accessor('type', { header: 'Type', cell: (info) => <Chip label={info.getValue()} size="small" variant="outlined" /> }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const s = info.getValue();
      const color = s === 'completed' ? 'success' : s === 'generating' ? 'info' : 'default';
      return <Chip label={s.charAt(0).toUpperCase() + s.slice(1)} size="small" color={color as any} />;
    },
  }),
  col.accessor('format', { header: 'Format', cell: (info) => <Chip label={info.getValue()} size="small" sx={{ fontFamily: tokens.typography.fontFamily.mono, fontSize: '0.6875rem' }} /> }),
  col.accessor('dateRange', { header: 'Date Range' }),
  col.display({
    id: 'actions',
    header: '',
    cell: () => (
      <Button size="small" startIcon={<Download sx={{ fontSize: 16 }} />} sx={{ minWidth: 'auto' }}>
        Export
      </Button>
    ),
  }),
];

export default function ReportsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Performance', format: 'PDF', startDate: '', endDate: '' });
  const { list, generate } = useReports();

  const displayReports = list.data || reports;

  const handleGenerate = async () => {
    await generate.mutateAsync({
      title: formData.title,
      type: formData.type,
      format: formData.format,
      dateRange: { start: formData.startDate, end: formData.endDate }
    });
    setDialogOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Generate, manage, and export analytics reports."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reports' }]}
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
            Generate Report
          </Button>
        }
      />

      <GlassCard>
        <DataTable
          data={displayReports}
          columns={columns}
          searchPlaceholder="Search reports..."
          emptyTitle="No reports yet"
          emptyDescription="Generate your first report to get started."
        />
      </GlassCard>

      {/* Generate Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <TextField label="Report Title" fullWidth value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <TextField label="Type" select fullWidth value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
            {['Performance', 'Engagement', 'Growth', 'Benchmark', 'Overview'].map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField label="Format" select fullWidth value={formData.format} onChange={e => setFormData({ ...formData, format: e.target.value })}>
            {['PDF', 'CSV', 'XLSX'].map((f) => (
              <MenuItem key={f} value={f}>{f}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Start Date" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
            <TextField label="End Date" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGenerate} disabled={generate.isPending}>{generate.isPending ? 'Generating...' : 'Generate'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
