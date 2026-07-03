const test = require('node:test');
const assert = require('node:assert/strict');

const { hashPassword, comparePassword, signAccessToken, verifyToken } = require('../utils/auth');
const User = require('../models/user.model');

test('password hashing and comparison work', async () => {
  const password = 'StrongPassword123!';
  const hashed = await hashPassword(password);

  assert.notEqual(hashed, password);
  assert.equal(await comparePassword(password, hashed), true);
  assert.equal(await comparePassword('wrong', hashed), false);
});

test('JWT access tokens can be signed and verified', () => {
  const token = signAccessToken({ sub: 'user-1', role: 'admin' });
  const decoded = verifyToken(token);

  assert.equal(decoded.sub, 'user-1');
  assert.equal(decoded.role, 'admin');
});

test('user model removes password from JSON output', () => {
  const user = new User({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret',
  });

  const payload = user.toJSON();

  assert.equal(payload.password, undefined);
  assert.equal(payload.email, 'jane@example.com');
});
