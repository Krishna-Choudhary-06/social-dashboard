const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock User Model if we don't have direct access, but usually we'll just require it
const User = require('../src/models/user.model');
const Workspace = require('../src/models/organization.model');

const generateToken = (userId, role = 'admin') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );
};

const createTestUser = async (role = 'admin') => {
  const user = await User.create({
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    role
  });
  const token = generateToken(user._id, role);
  return { user, token };
};

const createTestWorkspace = async (ownerId) => {
  return await Workspace.create({
    name: 'Test Workspace',
    owner: ownerId,
    members: [{ user: ownerId, role: 'admin' }]
  });
};

module.exports = {
  generateToken,
  createTestUser,
  createTestWorkspace,
};
