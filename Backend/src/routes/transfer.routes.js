// FILE: backend/src/routes/transfer.routes.js
const express = require('express');
const {
  createTransfer,
  getTransfers,
  getTransfer,
  executeTransfer
} = require('../controllers/transfer.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { transferRules } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin', 'manager'), transferRules, validate, createTransfer)
  .get(getTransfers);

router.route('/:id')
  .get(getTransfer);

router.post('/:id/execute', authorize('admin', 'manager'), executeTransfer);

module.exports = router;