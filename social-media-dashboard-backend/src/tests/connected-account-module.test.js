const test = require('node:test');
const assert = require('node:assert/strict');

const { buildConnectedAccountQuery } = require('../utils/socialAccount');

test('buildConnectedAccountQuery returns filters and pagination values', () => {
  const query = buildConnectedAccountQuery({ platform: 'instagram', page: '2', limit: '5' });

  assert.equal(query.filter.platform, 'instagram');
  assert.equal(query.pagination.page, 2);
  assert.equal(query.pagination.limit, 5);
});
