const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/auth');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required', 'AUTH_REQUIRED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    req.userId = decoded.sub;
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }
};

module.exports = authMiddleware;
