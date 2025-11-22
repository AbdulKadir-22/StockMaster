// FILE: backend/src/routes/user.routes.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
// Note: A specific user.controller.js was not generated in Part 3. 
// Reusing auth controller for 'me' and assuming future admin CRUD implementation.
const { getMe } = require('../controllers/auth.controller');

const router = express.Router();

router.use(protect);

router.get('/profile', getMe);

// Placeholder for Admin User Management
router.get('/', authorize('admin'), (req, res) => {
  res.status(501).json({ success: false, message: 'List users not implemented' });
});

module.exports = router;