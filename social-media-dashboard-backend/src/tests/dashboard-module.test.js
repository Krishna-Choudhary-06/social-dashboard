const test = require('node:test');
const assert = require('node:assert/strict');

const {
  formatSummary,
  formatCharts,
  formatPlatformComparison,
  formatTopPosts,
  formatRecentActivity,
  buildDashboardPayload,
} = require('../utils/dashboard.utils');

test('formatSummary maps overview data into frontend-ready KPI values', () => {
  const payload = formatSummary({
    summary: {
      followers: 1250,
      reach: 3400,
      impressions: 5000,
      likes: 120,
      comments: 12,
      shares: 8,
      videoViews: 300,
      engagementRate: 2.8,
    },
    comparison: { followersDelta: 120, followersGrowth: 10.7 },
    growth: 10.7,
  });

  assert.equal(payload.totalFollowers, 1250);
  assert.equal(payload.followerGrowth, 10.7);
  assert.equal(payload.reach, 3400);
  assert.equal(payload.engagementRate, 2.8);
});

test('formatCharts returns chart-ready datasets', () => {
  const payload = formatCharts([
    { date: '2024-01-01', followers: 100, reach: 200, impressions: 300 },
    { date: '2024-01-02', followers: 120, reach: 220, impressions: 330 },
  ]);

  assert.equal(payload.labels[0], '2024-01-01');
  assert.equal(payload.datasets[0].data[1], 120);
  assert.equal(payload.datasets[2].data[0], 300);
});

test('formatPlatformComparison groups metrics by platform', () => {
  const payload = formatPlatformComparison([
    { platform: 'instagram', summary: { followers: 1000, reach: 900, engagementRate: 3.2 } },
    { platform: 'youtube', summary: { followers: 800, reach: 700, engagementRate: 2.4 } },
  ]);

  assert.equal(payload[0].platform, 'instagram');
  assert.equal(payload[1].metrics.followers, 800);
});

test('formatRecentActivity returns a list of dashboard events', () => {
  const payload = formatRecentActivity([
    { id: 'post-1', date: '2024-01-01', platform: 'instagram', engagementRate: 4.5, impressions: 320 },
  ]);

  assert.equal(payload[0].type, 'post');
  assert.equal(payload[0].platform, 'instagram');
});

test('buildDashboardPayload assembles the full dashboard view', () => {
  const payload = buildDashboardPayload({
    summary: { totalFollowers: 1000, followerGrowth: 5, reach: 2000, impressions: 3000, likes: 50, comments: 6, shares: 2, videoViews: 100, engagementRate: 1.9 },
    charts: { labels: ['Mon'], datasets: [] },
    platformComparison: [{ platform: 'instagram', metrics: { followers: 1000 } }],
    topPosts: [{ id: 'p1' }],
    recentPosts: [{ id: 'p2' }],
    activity: [{ id: 'a1', type: 'sync' }],
  });

  assert.equal(payload.summary.totalFollowers, 1000);
  assert.equal(payload.platformComparison[0].platform, 'instagram');
  assert.equal(payload.recentPosts.length, 1);
});
