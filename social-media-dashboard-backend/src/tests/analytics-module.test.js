const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateEngagementRate,
  growthPercentage,
  compareDateRanges,
  aggregateMetrics,
} = require('../utils/analytics');

test('calculateEngagementRate returns a percentage based on engagement events', () => {
  const rate = calculateEngagementRate({ likes: 30, comments: 10, shares: 5, impressions: 1000 });
  assert.equal(rate, 4.5);
});

test('growthPercentage computes relative growth', () => {
  assert.equal(growthPercentage(120, 100), 20);
  assert.equal(growthPercentage(100, 200), -50);
});

test('compareDateRanges produces baseline deltas', () => {
  const comparison = compareDateRanges({ followers: 1200 }, { followers: 1000 });
  assert.equal(comparison.followersDelta, 200);
  assert.equal(comparison.followersGrowth, 20);
});

test('aggregateMetrics combines metric values across records', () => {
  const aggregated = aggregateMetrics([
    { followers: 100, reach: 200, impressions: 500, likes: 10, comments: 2, shares: 1, videoViews: 50 },
    { followers: 120, reach: 250, impressions: 650, likes: 15, comments: 3, shares: 2, videoViews: 80 },
  ]);

  assert.equal(aggregated.followers, 220);
  assert.equal(aggregated.reach, 450);
  assert.equal(aggregated.impressions, 1150);
  assert.equal(aggregated.engagementRate, 2.869565217391304);
});
