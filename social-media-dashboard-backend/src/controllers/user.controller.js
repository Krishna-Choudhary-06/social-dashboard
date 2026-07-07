const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const { buildUserQuery } = require('../utils/user'); // Can remove later if unused everywhere
const httpStatus = require('../constants/httpStatus');
const { getPaginationMetadata } = require('../utils/pagination');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-refreshToken');

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'User not found', 'USER_NOT_FOUND'));
    }

    return sendSuccess(res, user, httpStatus.OK, 'Profile fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'User not found', 'USER_NOT_FOUND'));
    }

    Object.keys(updates).forEach((key) => {
      if (['password', 'email', 'role', 'refreshToken'].includes(key)) return;
      user[key] = updates[key];
    });

    await user.save();
    return sendSuccess(res, user, httpStatus.OK, 'Profile updated successfully');
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const { filter, sort, skip, limit, page } = req.queryOptions;
    
    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).select('-refreshToken'),
      User.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      {
        users,
        pagination: getPaginationMetadata(page, limit, total),
      },
      httpStatus.OK,
      'Users fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-refreshToken');

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'User not found', 'USER_NOT_FOUND'));
    }

    return sendSuccess(res, user, httpStatus.OK, 'User fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'User not found', 'USER_NOT_FOUND'));
    }

    user.status = 'inactive';
    await user.save();

    return sendSuccess(res, user, httpStatus.OK, 'User deactivated successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
  deactivateUser,
};
