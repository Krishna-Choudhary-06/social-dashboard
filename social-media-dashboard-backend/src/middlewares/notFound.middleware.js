const ApiError = require('../utils/ApiError');

const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, 'Route not found', 'ROUTE_NOT_FOUND'));
};

module.exports = notFoundMiddleware;
