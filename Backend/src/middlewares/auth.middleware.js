// FILE: backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'AUTH_ERROR', 'Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return errorResponse(res, 401, 'AUTH_ERROR', 'Not authorized to access this route');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res, 
        403, 
        'FORBIDDEN', 
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };