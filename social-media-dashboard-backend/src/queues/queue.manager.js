const { reportQueue } = require('./report.queue');
const { analyticsQueue } = require('./analytics.queue');

const getQueueHealth = async () => {
  const [reportHealth, analyticsHealth] = await Promise.all([
    getMetrics(reportQueue),
    getMetrics(analyticsQueue),
  ]);

  return {
    reportQueue: reportHealth,
    analyticsQueue: analyticsHealth,
  };
};

const getMetrics = async (queue) => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
  };
};

module.exports = {
  getQueueHealth,
};
