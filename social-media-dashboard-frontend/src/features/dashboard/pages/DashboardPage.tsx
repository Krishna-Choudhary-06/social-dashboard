import { Grid, Box, Typography, Avatar, Chip, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Button, IconButton } from '@mui/material';
import {
  TrendingUp, Visibility, SentimentSatisfied, ShoppingCart, AlternateEmail,
  ShowChart, AdsClick, Speed, AutoAwesome, Bolt, Refresh, MoreVert,
  Rocket, EmojiEvents, Assessment, PersonAdd, Campaign,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/cards/StatCard';
import { GlassCard } from '@/components/cards/GlassCard';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { DonutChartWidget } from '@/components/charts/DonutChartWidget';
import { tokens } from '@/app/theme';

// ---- Static dashboard data matching the Stitch design ----
const kpis = [
  { label: 'Engagement', value: '48.2k', change: 12.4, changeLabel: 'vs last month', trend: 'up' as const, icon: <TrendingUp sx={{ fontSize: 18 }} /> },
  { label: 'Reach', value: '1.2M', change: 8.7, changeLabel: 'vs last month', trend: 'up' as const, icon: <Visibility sx={{ fontSize: 18 }} /> },
  { label: 'Sentiment', value: '84%', change: 2.1, changeLabel: 'positive', trend: 'up' as const, icon: <SentimentSatisfied sx={{ fontSize: 18 }} /> },
  { label: 'Conversions', value: '2,410', change: -3.2, changeLabel: 'vs last month', trend: 'down' as const, icon: <ShoppingCart sx={{ fontSize: 18 }} /> },
  { label: 'Mentions', value: '8.5k', change: 15.3, changeLabel: 'vs last month', trend: 'up' as const, icon: <AlternateEmail sx={{ fontSize: 18 }} /> },
  { label: 'Net Growth', value: '452k', change: 6.8, changeLabel: 'new followers', trend: 'up' as const, icon: <ShowChart sx={{ fontSize: 18 }} /> },
  { label: 'Click Rate', value: '4.2%', change: 0.3, changeLabel: 'vs last month', trend: 'up' as const, icon: <AdsClick sx={{ fontSize: 18 }} /> },
  { label: 'Ad ROI', value: '4.8x', change: 1.2, changeLabel: 'multiplier', trend: 'up' as const, icon: <Bolt sx={{ fontSize: 18 }} /> },
  { label: 'Viral Posts', value: '4', change: 33.3, changeLabel: 'this month', trend: 'up' as const, icon: <Rocket sx={{ fontSize: 18 }} /> },
  { label: 'AI Latency', value: '120ms', change: -8.0, changeLabel: 'faster', trend: 'up' as const, icon: <Speed sx={{ fontSize: 18 }} /> },
];

const velocityData = [
  { date: 'Jan', reach: 420000, engagement: 32000, followers: 180000 },
  { date: 'Feb', reach: 480000, engagement: 35000, followers: 210000 },
  { date: 'Mar', reach: 520000, engagement: 38000, followers: 245000 },
  { date: 'Apr', reach: 610000, engagement: 42000, followers: 290000 },
  { date: 'May', reach: 750000, engagement: 44000, followers: 340000 },
  { date: 'Jun', reach: 890000, engagement: 46000, followers: 385000 },
  { date: 'Jul', reach: 1050000, engagement: 48000, followers: 420000 },
  { date: 'Aug', reach: 1200000, engagement: 48200, followers: 452000 },
];

const platformData = [
  { name: 'Instagram', value: 38 },
  { name: 'Facebook', value: 24 },
  { name: 'Twitter', value: 18 },
  { name: 'LinkedIn', value: 12 },
  { name: 'YouTube', value: 8 },
];

const aiInsights = [
  { type: 'Growth Forecast', title: 'Growth Forecast', description: 'Reach likely to increase by 14.2% over the next 7 days based on current engagement patterns.', color: tokens.colors.primary, icon: <ShowChart /> },
  { type: 'Content Optimization', title: 'Content Optimization', description: 'Video content posted at 6:00 PM EST generates 3.4x more conversions.', color: tokens.colors.tertiary, icon: <AutoAwesome /> },
  { type: 'Sentiment Shift', title: 'Sentiment Shift', description: 'Neutral sentiment in "Campaign X" is shifting positive. Recommendation: Increase spend.', color: tokens.colors.secondary, icon: <SentimentSatisfied /> },
];

const topPosts = [
  { title: 'Future of Generative AI in 2024...', time: '2h ago', engagement: '12.4k', reach: '89k' },
  { title: 'How to scale your SaaS with...', time: '5h ago', engagement: '8.2k', reach: '52k' },
  { title: 'Behind the scenes at HQ...', time: '1d ago', engagement: '6.1k', reach: '34k' },
];

const activity = [
  { icon: <Campaign />, title: 'Ad Campaign Launched', description: '"Summer Prime" is now live on 4 networks.', time: '12 minutes ago', color: tokens.colors.primary },
  { icon: <EmojiEvents />, title: 'Milestone Reached', description: 'Combined reach crossed 10M mark.', time: '1 hour ago', color: tokens.colors.secondary },
  { icon: <Assessment />, title: 'Weekly Report Ready', description: 'AI has finished analyzing last week\'s performance.', time: '3 hours ago', color: tokens.colors.tertiary },
  { icon: <PersonAdd />, title: 'New Member Joined', description: 'Sarah K. joined the workspace.', time: '5 hours ago', color: tokens.colors.onSurfaceVariant },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  return (
    <Box>
      <PageHeader
        title="Executive Overview"
        subtitle="Real-time data synchronization across 12 connected channels."
        actions={
          <Button startIcon={<Refresh />} variant="outlined" size="small">
            Sync Now
          </Button>
        }
      />

      {/* KPI Cards */}
      <Grid
        container
        spacing={2}
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
        sx={{ mb: 3 }}
      >
        {kpis.map((kpi) => (
          <Grid key={kpi.label} item xs={6} sm={4} md={3} lg={2.4} component={motion.div} variants={item}>
            <StatCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Platform Velocity + AI Insights */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} lg={8}>
          <GlassCard
            title="Platform Velocity"
            subtitle="Aggregated performance across all networks"
            actions={
              <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
            }
          >
            <AreaChartWidget
              data={velocityData}
              dataKeys={[
                { key: 'reach', color: tokens.colors.primary, name: 'Reach' },
                { key: 'engagement', color: tokens.colors.secondary, name: 'Engagement' },
                { key: 'followers', color: tokens.colors.tertiary, name: 'Followers' },
              ]}
              height={340}
              showLegend
            />
          </GlassCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <GlassCard title="AI Prediction Engine">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {aiInsights.map((insight) => (
                <Box
                  key={insight.type}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (t) => t.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.02)',
                    transition: tokens.motion.fast,
                    '&:hover': {
                      borderColor: insight.color,
                      bgcolor: `${insight.color}08`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Box sx={{ color: insight.color, display: 'flex' }}>
                      {insight.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {insight.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                    {insight.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Top Posts + Activity + Audience */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <GlassCard title="Top Performing Posts">
            <List disablePadding>
              {topPosts.map((post, i) => (
                <ListItem
                  key={i}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom: i < topPosts.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={post.title}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                        <Chip label={`${post.engagement} eng`} size="small" sx={{ height: 20, fontSize: '0.625rem', fontFamily: tokens.typography.fontFamily.mono }} />
                        <Typography variant="caption" color="text.secondary">{post.time}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <GlassCard title="Live Activity">
            <List disablePadding>
              {activity.map((act, i) => (
                <ListItem
                  key={i}
                  sx={{
                    px: 0,
                    py: 1.5,
                    alignItems: 'flex-start',
                    borderBottom: i < activity.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: `${act.color}18`,
                        color: act.color,
                      }}
                    >
                      {act.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={act.title}
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {act.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: tokens.typography.fontFamily.mono, fontSize: '0.625rem', mt: 0.25, display: 'block' }}>
                          {act.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <GlassCard title="Platform Split" subtitle="Engagement distribution across channels">
            <DonutChartWidget
              data={platformData.map((d, i) => ({
                name: d.name,
                value: d.value,
                color: [tokens.colors.instagram, tokens.colors.facebook, tokens.colors.twitter, tokens.colors.linkedin, tokens.colors.youtube][i],
              }))}
              height={280}
              centerLabel="Platforms"
              centerValue="5"
            />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
