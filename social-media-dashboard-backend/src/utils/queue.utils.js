const { redisConfig } = require('../config/redis');

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000, // 1s
  },
  removeOnComplete: true,
  removeOnFail: false,
};

module.exports = {
  defaultJobOptions,
  queueOptions: {
    connection: redisConfig,
    defaultJobOptions,
  },
  workerOptions: {
    connection: redisConfig,
  },
};
