const SocialAccount = require('../models/socialAccount.model');
const Organization = require('../models/organization.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

const ensureWorkspaceAccess = async (workspaceId, userId) => {
  const workspace = await Organization.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND');
  }

  const member = workspace.members.find((item) => String(item.user) === String(userId));
  if (!member) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not belong to this workspace', 'FORBIDDEN');
  }

  return { workspace, member };
};

const connectAccount = async ({ workspaceId, platform, accountId, username, displayName, profileImage, createdBy, accessToken = 'placeholder-access-token', refreshToken = 'placeholder-refresh-token' }) => {
  const { workspace } = await ensureWorkspaceAccess(workspaceId, createdBy);

  const existing = await SocialAccount.findOne({ workspaceId, platform, accountId });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Account already connected', 'ACCOUNT_EXISTS');
  }

  const account = await SocialAccount.create({
    workspaceId,
    platform,
    accountId,
    username,
    displayName,
    profileImage,
    accessToken,
    refreshToken,
    tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    connectionStatus: 'connected',
    lastSyncStatus: 'pending',
    createdBy,
  });

  return account;
};

const listWorkspaceAccounts = async ({ workspaceId, userId, queryOptions = {} }) => {
  await ensureWorkspaceAccess(workspaceId, userId);
  
  const { filter = {}, sort = '-createdAt', skip = 0, limit = 10 } = queryOptions;
  const finalFilter = { workspaceId, ...filter };
  
  const [accounts, total] = await Promise.all([
    SocialAccount.find(finalFilter).sort(sort).skip(skip).limit(limit),
    SocialAccount.countDocuments(finalFilter)
  ]);
  
  return { accounts, total };
};

const getAccountById = async ({ id, userId }) => {
  const account = await SocialAccount.findById(id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found', 'ACCOUNT_NOT_FOUND');
  }

  await ensureWorkspaceAccess(account.workspaceId, userId);
  return account;
};

const updateAccount = async ({ id, userId, updates }) => {
  const account = await getAccountById({ id, userId });
  Object.keys(updates).forEach((key) => {
    if (['workspaceId', 'createdBy', '_id'].includes(key)) return;
    account[key] = updates[key];
  });
  await account.save();
  return account;
};

const disconnectAccount = async ({ id, userId }) => {
  const account = await getAccountById({ id, userId });
  account.connectionStatus = 'disconnected';
  account.accessToken = '';
  account.refreshToken = '';
  account.syncError = 'Disconnected by user';
  await account.save();
  return account;
};

const refreshAccountToken = async ({ id, userId }) => {
  const account = await getAccountById({ id, userId });
  account.tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  account.connectionStatus = 'connected';
  account.syncError = '';
  await account.save();
  return account;
};

module.exports = {
  connectAccount,
  listWorkspaceAccounts,
  getAccountById,
  updateAccount,
  disconnectAccount,
  refreshAccountToken,
};
