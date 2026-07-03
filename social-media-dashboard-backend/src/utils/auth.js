const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getJwtSecret = () => process.env.JWT_SECRET || 'development-secret';

const signAccessToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || getJwtSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const verifyToken = (token, secret = getJwtSecret()) => jwt.verify(token, secret);

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
