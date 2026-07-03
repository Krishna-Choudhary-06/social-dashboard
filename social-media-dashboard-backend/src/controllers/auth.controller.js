const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess, sendError } = require('../utils/response');
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/auth');
const httpStatus = require('../constants/httpStatus');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Name, email, and password are required', 'VALIDATION_ERROR'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(httpStatus.CONFLICT, 'Email already registered', 'EMAIL_EXISTS'));
    }

    const user = await User.create({ name, email, password });
    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    return sendSuccess(res, { user, accessToken, refreshToken }, httpStatus.CREATED, 'User registered successfully');
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required', 'VALIDATION_ERROR'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials', 'INVALID_CREDENTIALS'));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials', 'INVALID_CREDENTIALS'));
    }

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save();

    return sendSuccess(res, { user, accessToken, refreshToken }, httpStatus.OK, 'Login successful');
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required', 'VALIDATION_ERROR'));
    }

    const decoded = verifyToken(incomingRefreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN'));
    }

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const nextRefreshToken = signRefreshToken({ sub: user._id });

    user.refreshToken = nextRefreshToken;
    await user.save();

    return sendSuccess(res, { accessToken, refreshToken: nextRefreshToken }, httpStatus.OK, 'Token refreshed');
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN'));
  }
};

const logout = async (req, res, next) => {
  try {
    const { userId } = req.user || {};
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
    }

    return sendSuccess(res, null, httpStatus.OK, 'Logged out successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
