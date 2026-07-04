const calculateEngagementRate = (metrics = {}) => {
  const likes = Number(metrics.likes) || 0;
  const comments = Number(metrics.comments) || 0;
  const shares = Number(metrics.shares) || 0;
  const impressions = Number(metrics.impressions) || 0;

  if (!impressions) return 0;
  return Number(((likes + comments + shares) / impressions) * 100);
};

const growthPercentage = (current = 0, previous = 0) => {
  if (!previous) return current ? 100 : 0;
  return Number(((current - previous) / previous) * 100);
};

const compareDateRanges = (current = {}, previous = {}) => {
  const currentFollowers = Number(current.followers) || 0;
  const previousFollowers = Number(previous.followers) || 0;
  const followersDelta = currentFollowers - previousFollowers;

  return {
    followersDelta,
    followersGrowth: growthPercentage(currentFollowers, previousFollowers),
  };
};

const aggregateMetrics = (records = []) => {
  const totals = records.reduce(
    (acc, record) => ({
      followers: acc.followers + (Number(record.followers) || 0),
      followerGrowth: acc.followerGrowth + (Number(record.followerGrowth) || 0),
      reach: acc.reach + (Number(record.reach) || 0),
      impressions: acc.impressions + (Number(record.impressions) || 0),
      likes: acc.likes + (Number(record.likes) || 0),
      comments: acc.comments + (Number(record.comments) || 0),
      shares: acc.shares + (Number(record.shares) || 0),
      videoViews: acc.videoViews + (Number(record.videoViews) || 0),
    }),
    {
      followers: 0,
      followerGrowth: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      videoViews: 0,
    }
  );

  return {
    ...totals,
    engagementRate: calculateEngagementRate({
      likes: totals.likes,
      comments: totals.comments,
      shares: totals.shares,
      impressions: totals.impressions,
    }),
  };
};

module.exports = {
  calculateEngagementRate,
  growthPercentage,
  compareDateRanges,
  aggregateMetrics,
};
