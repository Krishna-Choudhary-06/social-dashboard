const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.warn("MONGODB_URI is not configured, skipping MongoDB connection");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    logger.info("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error(err, "MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    return true;
  } catch (error) {
    logger.warn(error, "MongoDB not available, continuing without DB");
    return false;
  }
};

module.exports = connectDB;