// FILE: backend/src/utils/response.js

/**
 * Sends a success response
 * @param {Object} res - Express response object
 * @param {any} data - Payload to send
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * Sends an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Internal error code string
 * @param {string} message - Human readable error message
 */
const errorResponse = (res, statusCode, errorCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};

module.exports = { successResponse, errorResponse };