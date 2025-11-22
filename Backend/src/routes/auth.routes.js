// FILE: backend/src/routes/auth.routes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerRules, loginRules } = require('../utils/validators');

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);

module.exports = router;