const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  logger.error(err, 'Unhandled error');

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
};

module.exports = errorMiddleware;
