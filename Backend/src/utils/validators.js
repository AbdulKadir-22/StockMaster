// FILE: backend/src/utils/validators.js
const { body } = require('express-validator');

exports.registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
];

exports.productRules = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('uom').notEmpty().withMessage('Unit of Measure (UOM) is required'),
  body('reorderLevel').optional().isNumeric(),
];

exports.warehouseRules = [
  body('name').notEmpty().withMessage('Warehouse name is required'),
  body('code').notEmpty().withMessage('Warehouse code is required'),
  body('address').notEmpty().withMessage('Address is required'),
];

exports.receiptRules = [
  body('supplier').notEmpty().withMessage('Supplier is required'),
  body('warehouse').notEmpty().withMessage('Warehouse ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array cannot be empty'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for items'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

exports.deliveryRules = [
  body('customer').notEmpty().withMessage('Customer is required'),
  body('warehouse').notEmpty().withMessage('Warehouse ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array cannot be empty'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for items'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

exports.transferRules = [
  body('sourceWarehouse').notEmpty().withMessage('Source Warehouse is required'),
  body('destinationWarehouse').notEmpty().withMessage('Destination Warehouse is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array cannot be empty'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for items'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

exports.adjustmentRules = [
  body('warehouse').notEmpty().withMessage('Warehouse ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array cannot be empty'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for items'),
  body('items.*.countedQuantity').isInt({ min: 0 }).withMessage('Counted quantity is required'),
];