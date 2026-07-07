const { analyticsQueue } = require('../queues/analytics.queue');

const addAnalyticsSyncJob = async (jobData) => {
  const job = await analyticsQueue.add('sync-analytics', jobData);
  return job;
};

module.exports = {
  addAnalyticsSyncJob,
};
