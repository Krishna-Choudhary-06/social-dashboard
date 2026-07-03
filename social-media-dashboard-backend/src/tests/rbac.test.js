const test = require('node:test');
const assert = require('node:assert/strict');

const { hasPermission, getRoleHierarchy } = require('../utils/rbac');

test('permission checks work for allowed roles', () => {
  assert.equal(hasPermission('admin', 'users', 'read'), true);
  assert.equal(hasPermission('manager', 'posts', 'write'), true);
  assert.equal(hasPermission('viewer', 'users', 'write'), false);
});

test('role hierarchy lookup returns inherited roles', () => {
  const hierarchy = getRoleHierarchy('admin');
  assert.ok(hierarchy.includes('admin'));
  assert.ok(hierarchy.includes('user'));
});
