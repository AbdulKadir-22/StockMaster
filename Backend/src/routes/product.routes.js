// FILE: backend/src/routes/product.routes.js
const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { productRules } = require('../utils/validators');

const router = express.Router();

// Publicly readable or protected? Assuming protected for internal system
router.use(protect);

router.route('/')
  .post(authorize('admin', 'manager'), productRules, validate, createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'manager'), productRules, validate, updateProduct)
  .delete(authorize('admin'), deleteProduct);

module.exports = router;