const { Queue } = require('bullmq');
const { queueOptions } = require('../utils/queue.utils');

const reportQueueName = 'report-generation';
const reportQueue = new Queue(reportQueueName, queueOptions);

module.exports = {
  reportQueue,
  reportQueueName,
};
