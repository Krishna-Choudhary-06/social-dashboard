const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['instagram', 'linkedin', 'youtube'],
      index: true,
    },
    accountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      default: '',
      trim: true,
    },
    displayName: {
      type: String,
      default: '',
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    accessToken: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
    tokenExpiresAt: {
      type: Date,
      default: null,
    },
    connectionStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'expired', 'error'],
      default: 'connected',
      index: true,
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
    lastSyncStatus: {
      type: String,
      default: 'pending',
    },
    syncError: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

socialAccountSchema.index({ workspaceId: 1, platform: 1, accountId: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
