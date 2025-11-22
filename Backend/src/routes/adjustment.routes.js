// FILE: backend/src/routes/adjustment.routes.js
const express = require('express');
const {
  createAdjustment,
  getAdjustments,
  getAdjustment
} = require('../controllers/adjustment.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { adjustmentRules } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin', 'manager'), adjustmentRules, validate, createAdjustment)
  .get(getAdjustments);

router.route('/:id')
  .get(getAdjustment);

module.exports = router;