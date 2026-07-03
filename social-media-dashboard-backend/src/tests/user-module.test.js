const test = require('node:test');
const assert = require('node:assert/strict');

const { buildUserQuery } = require('../utils/user');

test('buildUserQuery returns filters and pagination values', () => {
  const query = buildUserQuery({ role: 'admin', status: 'active', page: '2', limit: '10' });

  assert.equal(query.filter.role, 'admin');
  assert.equal(query.filter.status, 'active');
  assert.equal(query.pagination.page, 2);
  assert.equal(query.pagination.limit, 10);
});
