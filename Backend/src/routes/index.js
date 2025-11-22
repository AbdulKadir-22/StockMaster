// FILE: backend/src/routes/index.js
const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const warehouseRoutes = require('./warehouse.routes');
const stockRoutes = require('./stock.routes');
const receiptRoutes = require('./receipt.routes');
const deliveryRoutes = require('./delivery.routes');
const transferRoutes = require('./transfer.routes');
const adjustmentRoutes = require('./adjustment.routes');
const ledgerRoutes = require('./ledger.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/stock', stockRoutes);
router.use('/receipts', receiptRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/transfers', transferRoutes);
router.use('/adjustments', adjustmentRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;