const test = require('node:test');
const assert = require('node:assert/strict');
const { defaultJobOptions, queueOptions, workerOptions } = require('../utils/queue.utils');
const { reportQueueName } = require('../queues/report.queue');
const { analyticsQueueName } = require('../queues/analytics.queue');

test('Queue options contain proper defaults', () => {
  assert.equal(defaultJobOptions.attempts, 3);
  assert.equal(defaultJobOptions.backoff.type, 'exponential');
  assert.equal(defaultJobOptions.backoff.delay, 1000);
});

test('Queues are configured with proper names', () => {
  assert.equal(reportQueueName, 'report-generation');
  assert.equal(analyticsQueueName, 'analytics-sync');
});

test('Queue and Worker options include redis connection', () => {
  assert.ok(queueOptions.connection);
  assert.ok(workerOptions.connection);
});
