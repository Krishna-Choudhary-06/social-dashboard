import { useState } from 'react';
import { Grid, Box, Tabs, Tab, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { StatCard } from '@/components/cards/StatCard';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { DonutChartWidget } from '@/components/charts/DonutChartWidget';
import { tokens } from '@/app/theme';
import { useAnalytics } from '../hooks/useAnalytics';

const tabs = ['Overview', 'Growth', 'Engagement', 'Audience', 'Platform Comparison'];

const performanceData = [
  { date: 'Week 1', reach: 180000, engagement: 14200 },
  { date: 'Week 2', reach: 210000, engagement: 16800 },
  { date: 'Week 3', reach: 195000, engagement: 15100 },
  { date: 'Week 4', reach: 240000, engagement: 19400 },
  { date: 'Week 5', reach: 270000, engagement: 21000 },
  { date: 'Week 6', reach: 310000, engagement: 24500 },
  { date: 'Week 7', reach: 350000, engagement: 27800 },
  { date: 'Week 8', reach: 380000, engagement: 31200 },
];

const platformEngagement = [
  { name: 'Instagram', engagement: 42000 },
  { name: 'Facebook', engagement: 28000 },
  { name: 'Twitter', engagement: 18500 },
  { name: 'LinkedIn', engagement: 12000 },
  { name: 'YouTube', engagement: 9800 },
];

const audienceData = [
  { name: '18-24', value: 22 },
  { name: '25-34', value: 38 },
  { name: '35-44', value: 24 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 6 },
];

const contentPerformance = [
  { name: 'Videos', value: 45000 },
  { name: 'Images', value: 32000 },
  { name: 'Carousels', value: 28000 },
  { name: 'Stories', value: 22000 },
  { name: 'Text', value: 14000 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { overview, growth, engagement, audience, platformComparison, contentPerformance: contentPerfApi } = useAnalytics();

  const displayOverview = overview.data || {
    reach: '1.2M', reachChange: 8.7, reachTrend: 'up',
    engagement: '4.2%', engagementChange: 0.3, engagementTrend: 'up',
    impressions: '3.8M', impressionsChange: 12.1, impressionsTrend: 'up',
    visits: '89.4k', visitsChange: -2.4, visitsTrend: 'down'
  };

  const displayGrowth = growth.data || performanceData;
  const displayPlatform = platformComparison.data || platformEngagement;
  const displayAudience = audience.data || audienceData;
  const displayContent = contentPerfApi.data || contentPerformance;

  return (
    <Box>
      <PageHeader
        title="Deep Analytics"
        subtitle="Real-time audience performance and cross-platform benchmarks."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      {/* AI Insight Banner */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(192, 193, 255, 0.04)' : 'rgba(73, 75, 214, 0.04)',
        }}
      >
        <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          Video content on Tuesdays performs <strong style={{ color: tokens.colors.primary }}>24% better</strong> than image carousels.
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, '& .MuiTab-root': { minWidth: 'auto', px: 2 } }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Total Reach" value={displayOverview.reach} change={displayOverview.reachChange} trend={displayOverview.reachTrend as 'up'|'down'|'neutral'} changeLabel="vs prev period" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Engagement Rate" value={displayOverview.engagement} change={displayOverview.engagementChange} trend={displayOverview.engagementTrend as 'up'|'down'|'neutral'} changeLabel="vs prev period" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Impressions" value={displayOverview.impressions} change={displayOverview.impressionsChange} trend={displayOverview.impressionsTrend as 'up'|'down'|'neutral'} changeLabel="vs prev period" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Profile Visits" value={displayOverview.visits} change={displayOverview.visitsChange} trend={displayOverview.visitsTrend as 'up'|'down'|'neutral'} changeLabel="vs prev period" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} lg={8}>
          <GlassCard title="Performance Over Time" subtitle="Tracking Reach and Engagement across all nodes">
            <AreaChartWidget
              data={displayGrowth}
              dataKeys={[
                { key: 'reach', color: tokens.colors.primary, name: 'Reach' },
                { key: 'engagement', color: tokens.colors.secondary, name: 'Engagement' },
              ]}
              height={380}
              showLegend
            />
          </GlassCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <GlassCard title="Platform Split" subtitle="Engagement distribution across channels">
            <DonutChartWidget
              data={displayPlatform.map((d: any, i: number) => ({
                name: d.name,
                value: d.engagement || d.value,
                color: [tokens.colors.instagram, tokens.colors.facebook, tokens.colors.twitter, tokens.colors.linkedin, tokens.colors.youtube][i],
              }))}
              height={320}
            />
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <GlassCard title="Audience Demographics" subtitle="Age distribution of your audience">
            <BarChartWidget
              data={displayAudience}
              dataKey="value"
              categoryKey="name"
              layout="horizontal"
              height={280}
              colors={[tokens.colors.primary, tokens.colors.primaryContainer, tokens.colors.secondary, tokens.colors.tertiary, tokens.colors.onSurfaceVariant]}
            />
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard title="Content Performance" subtitle="Engagement by content type">
            <BarChartWidget
              data={displayContent}
              dataKey="value"
              categoryKey="name"
              layout="vertical"
              height={280}
            />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
