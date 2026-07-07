const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SocialAccount',
      default: null,
      index: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'linkedin', 'youtube'],
      default: 'instagram',
      index: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    summary: {
      followers: { type: Number, default: 0 },
      followerGrowth: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      videoViews: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
