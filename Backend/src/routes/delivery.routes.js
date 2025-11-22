// FILE: backend/src/routes/delivery.routes.js
const express = require('express');
const {
  createDelivery,
  getDeliveries,
  getDelivery,
  validateDelivery
} = require('../controllers/delivery.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { deliveryRules } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin', 'manager', 'staff'), deliveryRules, validate, createDelivery)
  .get(getDeliveries);

router.route('/:id')
  .get(getDelivery);

router.post('/:id/validate', authorize('admin', 'manager'), validateDelivery);

module.exports = router;