const test = require('node:test');
const assert = require('node:assert/strict');

const { buildWorkspaceQuery, canManageMembers } = require('../utils/workspace');

test('buildWorkspaceQuery returns filters and pagination values', () => {
  const query = buildWorkspaceQuery({ search: 'acme', page: '2', limit: '5' });

  assert.equal(query.filter.$or[0].name.$regex, 'acme');
  assert.equal(query.pagination.page, 2);
  assert.equal(query.pagination.limit, 5);
});

test('member-management permission logic matches workspace roles', () => {
  assert.equal(canManageMembers('owner'), true);
  assert.equal(canManageMembers('admin'), true);
  assert.equal(canManageMembers('analyst'), false);
  assert.equal(canManageMembers('viewer'), false);
});
