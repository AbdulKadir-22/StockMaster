// FILE: backend/src/middlewares/validate.middleware.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        details: errors.array()
      }
    });
  }
  next();
};

module.exports = validate;