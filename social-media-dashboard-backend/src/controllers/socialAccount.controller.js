const socialAccountService = require('../services/socialAccount.service');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

const createAccount = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const account = await socialAccountService.connectAccount({
      workspaceId,
      platform: req.body.platform,
      accountId: req.body.accountId,
      username: req.body.username,
      displayName: req.body.displayName,
      profileImage: req.body.profileImage,
      createdBy: req.userId,
    });

    return sendSuccess(res, account, httpStatus.CREATED, 'Account connected successfully');
  } catch (error) {
    return next(error);
  }
};

const { getPaginationMetadata } = require('../utils/pagination');

const listAccounts = async (req, res, next) => {
  try {
    const { page, limit } = req.queryOptions || { page: 1, limit: 10 };
    
    const { accounts, total } = await socialAccountService.listWorkspaceAccounts({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(
      res, 
      { 
        accounts, 
        pagination: getPaginationMetadata(page, limit, total) 
      }, 
      httpStatus.OK, 
      'Accounts fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const account = await socialAccountService.getAccountById({ id: req.params.id, userId: req.userId });
    return sendSuccess(res, account, httpStatus.OK, 'Account fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const account = await socialAccountService.updateAccount({ id: req.params.id, userId: req.userId, updates: req.body });
    return sendSuccess(res, account, httpStatus.OK, 'Account updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const account = await socialAccountService.disconnectAccount({ id: req.params.id, userId: req.userId });
    return sendSuccess(res, account, httpStatus.OK, 'Account disconnected successfully');
  } catch (error) {
    return next(error);
  }
};

const refreshAccount = async (req, res, next) => {
  try {
    const account = await socialAccountService.refreshAccountToken({ id: req.params.id, userId: req.userId });
    return sendSuccess(res, account, httpStatus.OK, 'Account refreshed successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAccount,
  listAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  refreshAccount,
};
