// FILE: backend/src/routes/warehouse.routes.js
const express = require('express');
const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
} = require('../controllers/warehouse.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { warehouseRules } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), warehouseRules, validate, createWarehouse)
  .get(getWarehouses);

router.route('/:id')
  .get(getWarehouse)
  .put(authorize('admin'), warehouseRules, validate, updateWarehouse)
  .delete(authorize('admin'), deleteWarehouse);

module.exports = router;