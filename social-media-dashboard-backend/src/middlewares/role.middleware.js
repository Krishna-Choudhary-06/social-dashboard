const ApiError = require('../utils/ApiError');
const { hasPermission, getRoleHierarchy } = require('../utils/rbac');

const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = (req.user?.role || 'user').toLowerCase();
    const roleHierarchy = getRoleHierarchy(role);

    const isAllowed = allowedRoles.some((allowedRole) => roleHierarchy.includes(allowedRole.toLowerCase()));

    if (!isAllowed) {
      return next(new ApiError(403, 'You do not have permission to access this resource', 'FORBIDDEN'));
    }

    return next();
  };
};

const authorizePermission = (moduleName, action) => {
  return (req, res, next) => {
    const role = (req.user?.role || 'user').toLowerCase();

    if (!hasPermission(role, moduleName, action)) {
      return next(new ApiError(403, 'You do not have the required permission', 'FORBIDDEN'));
    }

    return next();
  };
};

module.exports = {
  authorizeRole,
  authorizePermission,
};
