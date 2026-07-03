const test = require('node:test');
const assert = require('node:assert/strict');

const ApiError = require('../utils/ApiError');
const { sendSuccess, sendError, buildPagination } = require('../utils/response');

test('ApiError preserves status and code', () => {
  const err = new ApiError(401, 'Token expired', 'TOKEN_EXPIRED');

  assert.equal(err.statusCode, 401);
  assert.equal(err.code, 'TOKEN_EXPIRED');
  assert.equal(err.message, 'Token expired');
});

test('response helpers build expected payloads', () => {
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
    },
  };

  sendSuccess(res, { id: 1 }, 201, 'Created');
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.payload, {
    success: true,
    message: 'Created',
    data: { id: 1 },
  });

  sendError(res, new ApiError(404, 'User not found', 'USER_NOT_FOUND'));
  assert.equal(res.statusCode, 404);
  assert.equal(res.payload.success, false);
  assert.equal(res.payload.code, 'USER_NOT_FOUND');
});

test('pagination helper returns metadata', () => {
  const pagination = buildPagination(2, 10, 45);

  assert.deepEqual(pagination, {
    page: 2,
    limit: 10,
    total: 45,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: true,
  });
});
