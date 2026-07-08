const { Worker } = require('bullmq');
const { reportQueueName } = require('../queues/report.queue');
const { workerOptions } = require('../utils/queue.utils');
const reportService = require('../services/report.service');
const logger = require('../config/logger'); // Assuming a logger exists, or we can use console
const { getIO } = require('../sockets');

const processJob = async (job) => {
  try {
    if (logger && logger.info) logger.info(`Processing report job ${job.id}`);
    else console.log(`Processing report job ${job.id}`);

    const { workspaceId, userId, payload } = job.data;
    
    // Emit progress
    try {
      getIO().to(`workspace_${workspaceId}`).emit("report_progress", { jobId: job.id, progress: 25, status: "started", message: "Report generation started..." });
    } catch (err) {}

    // Reuse existing business logic
    const report = await reportService.generateReport({ workspaceId, userId, payload });

    if (logger && logger.info) logger.info(`Completed report job ${job.id}`);
    else console.log(`Completed report job ${job.id}`);

    // Emit completion
    try {
      getIO().to(`workspace_${workspaceId}`).emit("report_progress", { jobId: job.id, progress: 100, status: "completed", message: "Report generated successfully!" });
      // Emit a notification
      getIO().to(`workspace_${workspaceId}`).emit("new_notification", {
        type: "success", title: "Report Generated", message: `Your report for ${payload?.title || "Analytics"} is ready.`
      });
    } catch (err) {}

    return report;
  } catch (error) {
    if (logger && logger.error) logger.error(`Failed report job ${job.id}:`, error);
    else console.error(`Failed report job ${job.id}:`, error);
    
    // Emit failure
    try {
      if (job.data?.workspaceId) {
        getIO().to(`workspace_${job.data.workspaceId}`).emit("report_progress", { jobId: job.id, progress: 0, status: "failed", message: "Report generation failed." });
        getIO().to(`workspace_${job.data.workspaceId}`).emit("new_notification", {
          type: "error", title: "Report Failed", message: `Failed to generate report.`
        });
      }
    } catch (err) {}

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
