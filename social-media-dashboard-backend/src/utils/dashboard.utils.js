const formatSummary = (overview = {}) => ({
  totalFollowers: overview.summary?.followers || overview.totalFollowers || 0,
  followerGrowth: overview.comparison?.followersGrowth || overview.growth || 0,
  reach: overview.summary?.reach || 0,
  impressions: overview.summary?.impressions || 0,
  likes: overview.summary?.likes || 0,
  comments: overview.summary?.comments || 0,
  shares: overview.summary?.shares || 0,
  videoViews: overview.summary?.videoViews || 0,
  engagementRate: overview.summary?.engagementRate || overview.engagementRate || 0,
});

const formatCharts = (trends = []) => ({
  labels: trends.map((item) => item.date),
  datasets: [
    {
      label: 'Followers',
      data: trends.map((item) => item.followers || 0),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
    },
    {
      label: 'Reach',
      data: trends.map((item) => item.reach || 0),
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
    },
    {
      label: 'Impressions',
      data: trends.map((item) => item.impressions || 0),
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.2)',
    },
  ],
});

const formatPlatformComparison = (platforms = []) =>
  platforms.map((item) => ({
    platform: item.platform,
    metrics: {
      followers: item.summary?.followers || 0,
      reach: item.summary?.reach || 0,
      engagementRate: item.summary?.engagementRate || 0,
    },
  }));

const formatTopPosts = (posts = []) =>
  posts.map((post) => ({
    id: post.id,
    platform: post.platform,
    impressions: post.impressions || 0,
    likes: post.likes || 0,
    comments: post.comments || 0,
    shares: post.shares || 0,
    engagementRate: post.engagementRate || 0,
  }));

const formatRecentActivity = (activity = []) =>
  activity.map((item) => ({
    id: item.id,
    type: item.type || 'post',
    title: item.title || 'Recent activity',
    platform: item.platform || 'unknown',
    timestamp: item.date || item.timestamp || new Date().toISOString(),
    engagementRate: item.engagementRate || 0,
    impressions: item.impressions || 0,
  }));

const buildDashboardPayload = ({ summary, charts, platformComparison, topPosts, recentPosts, activity }) => ({
  summary: summary || {},
  charts: charts || { labels: [], datasets: [] },
  platformComparison: platformComparison || [],
  topPosts: topPosts || [],
  recentPosts: recentPosts || [],
  activity: activity || [],
});

module.exports = {
  formatSummary,
  formatCharts,
  formatPlatformComparison,
  formatTopPosts,
  formatRecentActivity,
  buildDashboardPayload,
};
