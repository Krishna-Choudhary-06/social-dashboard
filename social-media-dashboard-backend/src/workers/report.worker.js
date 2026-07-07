const { Worker } = require('bullmq');
const { reportQueueName } = require('../queues/report.queue');
const { workerOptions } = require('../utils/queue.utils');
const reportService = require('../services/report.service');
const logger = require('../config/logger'); // Assuming a logger exists, or we can use console

const processJob = async (job) => {
  try {
    if (logger && logger.info) logger.info(`Processing report job ${job.id}`);
    else console.log(`Processing report job ${job.id}`);

    // Reuse existing business logic
    const { workspaceId, userId, payload } = job.data;
    const report = await reportService.generateReport({ workspaceId, userId, payload });

    if (logger && logger.info) logger.info(`Completed report job ${job.id}`);
    else console.log(`Completed report job ${job.id}`);

    return report;
  } catch (error) {
    if (logger && logger.error) logger.error(`Failed report job ${job.id}:`, error);
    else console.error(`Failed report job ${job.id}:`, error);
    throw error;
  }
};

const reportWorker = new Worker(reportQueueName, processJob, workerOptions);

reportWorker.on('completed', (job) => {
  if (logger && logger.info) logger.info(`Report worker completed job ${job.id}`);
  else console.log(`Report worker completed job ${job.id}`);
});

reportWorker.on('failed', (job, err) => {
  if (logger && logger.error) logger.error(`Report worker failed job ${job?.id} with error: ${err.message}`);
  else console.error(`Report worker failed job ${job?.id} with error: ${err.message}`);
});

const gracefulShutdown = async () => {
  if (logger && logger.info) logger.info('Shutting down report worker...');
  else console.log('Shutting down report worker...');
  await reportWorker.close();
};

module.exports = {
  reportWorker,
  gracefulShutdown,
};
