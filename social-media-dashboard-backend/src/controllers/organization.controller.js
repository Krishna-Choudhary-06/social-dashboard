const Organization = require('../models/organization.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess, buildPagination } = require('../utils/response');
const { buildOrganizationQuery } = require('../utils/organization');
const httpStatus = require('../constants/httpStatus');

const createOrganization = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Name and slug are required', 'VALIDATION_ERROR'));
    }

    const exists = await Organization.findOne({ $or: [{ name }, { slug }] });
    if (exists) {
      return next(new ApiError(httpStatus.CONFLICT, 'Organization already exists', 'ORGANIZATION_EXISTS'));
    }

    const organization = await Organization.create({
      name,
      slug,
      owner: req.userId,
      members: [{ user: req.userId, role: 'owner' }],
    });

    return sendSuccess(res, organization, httpStatus.CREATED, 'Organization created successfully');
  } catch (error) {
    return next(error);
  }
};

const listOrganizations = async (req, res, next) => {
  try {
    const { filter, pagination } = buildOrganizationQuery(req.query);
    const [organizations, total] = await Promise.all([
      Organization.find(filter).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
      Organization.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      {
        organizations,
        pagination: buildPagination(pagination.page, pagination.limit, total),
      },
      httpStatus.OK,
      'Organizations fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Organization not found', 'ORGANIZATION_NOT_FOUND'));
    }

    return sendSuccess(res, organization, httpStatus.OK, 'Organization fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Organization not found', 'ORGANIZATION_NOT_FOUND'));
    }

    const exists = organization.members.some((member) => String(member.user) === String(req.body.userId));
    if (exists) {
      return next(new ApiError(httpStatus.CONFLICT, 'Member already exists', 'MEMBER_EXISTS'));
    }

    organization.members.push({ user: req.body.userId, role: req.body.role || 'viewer' });
    await organization.save();

    return sendSuccess(res, organization, httpStatus.OK, 'Member added successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrganization,
  listOrganizations,
  getOrganization,
  addMember,
};
