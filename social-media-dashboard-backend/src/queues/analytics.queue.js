const { Queue } = require('bullmq');
const { queueOptions } = require('../utils/queue.utils');

const analyticsQueueName = 'analytics-sync';
const analyticsQueue = new Queue(analyticsQueueName, queueOptions);

module.exports = {
  analyticsQueue,
  analyticsQueueName,
};
