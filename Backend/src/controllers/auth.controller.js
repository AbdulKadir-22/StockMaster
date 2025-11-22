// FILE: backend/src/controllers/auth.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs'); // Assumed installed
const { generateToken } = require('../utils/jwt');
const { successResponse } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = generateToken(user);

    successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = generateToken(user);

    successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // req.user set by middleware
    successResponse(res, user, 'Current user profile');
  } catch (error) {
    next(error);
  }
};