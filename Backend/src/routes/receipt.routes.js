// FILE: backend/src/routes/receipt.routes.js
const express = require('express');
const {
  createReceipt,
  getReceipts,
  getReceipt,
  validateReceipt
} = require('../controllers/receipt.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { receiptRules } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin', 'manager', 'staff'), receiptRules, validate, createReceipt)
  .get(getReceipts);

router.route('/:id')
  .get(getReceipt);

router.post('/:id/validate', authorize('admin', 'manager'), validateReceipt);

module.exports = router;