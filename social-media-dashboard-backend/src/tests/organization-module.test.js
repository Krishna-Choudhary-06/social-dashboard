const test = require('node:test');
const assert = require('node:assert/strict');

const { buildOrganizationQuery } = require('../utils/organization');

test('buildOrganizationQuery returns filters and pagination values', () => {
  const query = buildOrganizationQuery({ search: 'acme', page: '2', limit: '5' });

  assert.equal(query.filter.$or[0].name.$regex, 'acme');
  assert.equal(query.pagination.page, 2);
  assert.equal(query.pagination.limit, 5);
});
