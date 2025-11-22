// FILE: backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret_key_change_me',
    { expiresIn: '30d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
};

module.exports = { generateToken, verifyToken };