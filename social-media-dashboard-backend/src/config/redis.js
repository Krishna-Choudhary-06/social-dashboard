const { createClient } = require("redis");
const logger = require("./logger");

let redisClient;

const connectRedis = async () => {
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    logger.warn("Redis configuration is missing, skipping Redis connection");
    return null;
  }

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  redisClient.on("error", (err) => {
    logger.error(err, "Redis error");
  });

  redisClient.on("connect", () => {
    logger.info("✅ Redis connected");
  });

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn(error, "Redis not available, continuing without Redis");
    return null;
  }
};

const getRedisClient = () => redisClient;

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

module.exports = {
  connectRedis,
  getRedisClient,
  redisConfig,
};