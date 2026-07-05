const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      enum: [
        'Dashboard Summary',
        'Platform Analytics',
        'Engagement Report',
        'Growth Report',
        'Custom Report',
      ],
      default: 'Dashboard Summary',
    },
    reportFormat: {
      type: String,
      enum: ['PDF', 'CSV', 'Excel'],
      default: 'PDF',
    },
    dateRange: {
      startDate: Date,
      endDate: Date,
    },
    filters: {
      type: Object,
      default: {},
    },
    reportStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed'],
      default: 'Pending',
    },
    fileName: String,
    filePath: String,
    fileSize: Number,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ workspaceId: 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ reportStatus: 1 });
reportSchema.index({ generatedAt: -1 });
reportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Report', reportSchema);
