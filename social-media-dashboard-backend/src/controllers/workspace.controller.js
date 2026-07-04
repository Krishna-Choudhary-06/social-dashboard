const Organization = require('../models/organization.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess, buildPagination } = require('../utils/response');
const { buildWorkspaceQuery, canManageMembers } = require('../utils/workspace');
const httpStatus = require('../constants/httpStatus');

const createWorkspace = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Name and slug are required', 'VALIDATION_ERROR'));
    }

    const existing = await Organization.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return next(new ApiError(httpStatus.CONFLICT, 'Workspace already exists', 'WORKSPACE_EXISTS'));
    }

    const workspace = await Organization.create({
      name,
      slug,
      owner: req.userId,
      members: [{ user: req.userId, role: 'owner' }],
    });

    return sendSuccess(res, workspace, httpStatus.CREATED, 'Workspace created successfully');
  } catch (error) {
    return next(error);
  }
};

const listWorkspaces = async (req, res, next) => {
  try {
    const { filter, pagination } = buildWorkspaceQuery(req.query);
    const [workspaces, total] = await Promise.all([
      Organization.find(filter).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
      Organization.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      {
        workspaces,
        pagination: buildPagination(pagination.page, pagination.limit, total),
      },
      httpStatus.OK,
      'Workspaces fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Organization.findById(req.params.id);

    if (!workspace) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND'));
    }

    return sendSuccess(res, workspace, httpStatus.OK, 'Workspace fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Organization.findById(req.params.id);

    if (!workspace) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND'));
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (['owner', 'members'].includes(key)) return;
      workspace[key] = updates[key];
    });

    await workspace.save();
    return sendSuccess(res, workspace, httpStatus.OK, 'Workspace updated successfully');
  } catch (error) {
    return next(error);
  }
};

const inviteMember = async (req, res, next) => {
  try {
    const workspace = await Organization.findById(req.params.id);

    if (!workspace) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND'));
    }

    const member = workspace.members.find((item) => String(item.user) === String(req.body.userId));
    if (member) {
      return next(new ApiError(httpStatus.CONFLICT, 'Member already exists', 'MEMBER_EXISTS'));
    }

    const role = req.body.role || 'viewer';
    workspace.members.push({ user: req.body.userId, role });
    await workspace.save();

    return sendSuccess(res, workspace, httpStatus.OK, 'Member invited successfully');
  } catch (error) {
    return next(error);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const workspace = await Organization.findById(req.params.id);

    if (!workspace) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Workspace not found', 'WORKSPACE_NOT_FOUND'));
    }

    const member = workspace.members.find((item) => String(item.user) === String(req.params.userId));
    if (!member) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Member not found', 'MEMBER_NOT_FOUND'));
    }

    if (!canManageMembers(req.user?.role || 'viewer')) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'You cannot manage members', 'FORBIDDEN'));
    }

    member.role = req.body.role || member.role;
    await workspace.save();

    return sendSuccess(res, workspace, httpStatus.OK, 'Member role updated successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  updateWorkspace,
  inviteMember,
  updateMemberRole,
};
