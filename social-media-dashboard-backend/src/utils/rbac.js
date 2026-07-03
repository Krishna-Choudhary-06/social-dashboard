const ROLE_HIERARCHY = {
  superadmin: ['superadmin', 'admin', 'manager', 'editor', 'viewer', 'user'],
  admin: ['admin', 'manager', 'editor', 'viewer', 'user'],
  manager: ['manager', 'editor', 'viewer', 'user'],
  editor: ['editor', 'viewer', 'user'],
  viewer: ['viewer', 'user'],
  user: ['user'],
};

const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: ['users:read', 'users:write', 'posts:read', 'posts:write', 'organizations:read', 'organizations:write'],
  manager: ['posts:read', 'posts:write', 'users:read'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read', 'users:read'],
  user: ['posts:read'],
};

const hasPermission = (role = 'user', moduleName, action) => {
  const normalizedRole = role.toLowerCase();
  const rolePermissions = ROLE_PERMISSIONS[normalizedRole] || [];
  const requiredPermission = `${moduleName}:${action}`;

  return rolePermissions.includes('*') || rolePermissions.includes(requiredPermission);
};

const getRoleHierarchy = (role = 'user') => ROLE_HIERARCHY[role.toLowerCase()] || ['user'];

module.exports = {
  hasPermission,
  getRoleHierarchy,
};
