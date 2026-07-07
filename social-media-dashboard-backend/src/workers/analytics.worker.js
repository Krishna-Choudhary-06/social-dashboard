const { Worker } = require('bullmq');
const { analyticsQueueName } = require('../queues/analytics.queue');
const { workerOptions } = require('../utils/queue.utils');
const analyticsService = require('../services/analytics.service');
const logger = require('../config/logger'); // Assuming logger exists

const processJob = async (job) => {
  try {
    if (logger && logger.info) logger.info(`Processing analytics sync job ${job.id}`);
    else console.log(`Processing analytics sync job ${job.id}`);

    // Call AnalyticsService to get overview as a way of "syncing" or checking data, 
    // since a real sync logic is not implemented, we reuse getOverview to trigger some queries
    const { workspaceId, userId } = job.data;
    
    // As mock sync, we just verify access and load overview data.
    if (workspaceId && userId) {
      await analyticsService.getOverview({ workspaceId, userId, query: {} });
    } else {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (logger && logger.info) logger.info(`Completed analytics sync job ${job.id}`);
    else console.log(`Completed analytics sync job ${job.id}`);

    return { success: true, synced: true };
  } catch (error) {
    if (logger && logger.error) logger.error(`Failed analytics sync job ${job.id}:`, error);
    else console.error(`Failed analytics sync job ${job.id}:`, error);
    throw error;
  }
};

const analyticsWorker = new Worker(analyticsQueueName, processJob, workerOptions);

analyticsWorker.on('completed', (job) => {
  if (logger && logger.info) logger.info(`Analytics worker completed job ${job.id}`);
  else console.log(`Analytics worker completed job ${job.id}`);
});

analyticsWorker.on('failed', (job, err) => {
  if (logger && logger.error) logger.error(`Analytics worker failed job ${job?.id} with error: ${err.message}`);
  else console.error(`Analytics worker failed job ${job?.id} with error: ${err.message}`);
});

const gracefulShutdown = async () => {
  if (logger && logger.info) logger.info('Shutting down analytics worker...');
  else console.log('Shutting down analytics worker...');
  await analyticsWorker.close();
};

module.exports = {
  analyticsWorker,
  gracefulShutdown,
};
