require("dotenv").config();

const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const logger = require("./config/logger");
const { gracefulShutdown: reportWorkerShutdown } = require("./workers/report.worker");
const { gracefulShutdown: analyticsWorkerShutdown } = require("./workers/analytics.worker");

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    logger.warn(error, "MongoDB startup skipped");
  }

  try {
    await connectRedis();
  } catch (error) {
    logger.warn(error, "Redis startup skipped");
  }

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      logger.warn(`Port ${PORT} is busy, trying ${PORT + 1}`);
      server.listen(PORT + 1, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT + 1}`);
      });
    } else {
      logger.fatal(error, "Server failed to start");
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  await reportWorkerShutdown();
  await analyticsWorkerShutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Server terminated");
  await reportWorkerShutdown();
  await analyticsWorkerShutdown();
  process.exit(0);
});