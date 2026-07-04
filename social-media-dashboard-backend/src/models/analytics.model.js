const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      index: true,
    },
    rangeType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
      index: true,
    },
    metrics: {
      followers: { type: Number, default: 0 },
      followerGrowth: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      videoViews: { type: Number, default: 0 },
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ workspaceId: 1, accountId: 1, date: 1, rangeType: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
