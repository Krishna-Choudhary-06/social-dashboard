const { addReportJob } = require('../jobs/report.job');
const { addAnalyticsSyncJob } = require('../jobs/analytics.job');
const { getQueueHealth } = require('../queues/queue.manager');
const { sendSuccess } = require('../utils/response');
const { reportQueue } = require('../queues/report.queue');
const { analyticsQueue } = require('../queues/analytics.queue');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

const queueJobReport = async (req, res, next) => {
  try {
    const jobData = {
      workspaceId: req.body.workspaceId,
      userId: req.user.id,
      payload: req.body.payload,
    };
    const job = await addReportJob(jobData);
    sendSuccess(res, httpStatus.ACCEPTED, 'Report generation job enqueued', { jobId: job.id });
  } catch (error) {
    next(error);
  }
};

const queueJobAnalytics = async (req, res, next) => {
  try {
    const jobData = {
      workspaceId: req.body.workspaceId,
      userId: req.user.id,
    };
    const job = await addAnalyticsSyncJob(jobData);
    sendSuccess(res, httpStatus.ACCEPTED, 'Analytics sync job enqueued', { jobId: job.id });
  } catch (error) {
    next(error);
  }
};

const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    let job = await reportQueue.getJob(jobId);
    let queueName = 'reportQueue';
    
    if (!job) {
      job = await analyticsQueue.getJob(jobId);
      queueName = 'analyticsQueue';
    }

    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found', 'JOB_NOT_FOUND');
    }

    const state = await job.getState();
    const progress = job.progress;
    const failedReason = job.failedReason;

    sendSuccess(res, httpStatus.OK, 'Job status retrieved', {
      jobId: job.id,
      queue: queueName,
      state,
      progress,
      failedReason,
    });
  } catch (error) {
    next(error);
  }
};

const getHealth = async (req, res, next) => {
  try {
    const health = await getQueueHealth();
    sendSuccess(res, httpStatus.OK, 'Queue health retrieved', health);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  queueJobReport,
  queueJobAnalytics,
  getJobStatus,
  getHealth,
};
