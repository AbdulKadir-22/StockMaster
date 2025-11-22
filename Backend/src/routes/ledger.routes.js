// FILE: backend/src/routes/ledger.routes.js
const express = require('express');
const LedgerEntry = require('../models/ledgerEntry.model');
const { protect } = require('../middlewares/auth.middleware');
const { successResponse } = require('../utils/response');

const router = express.Router();

router.use(protect);

//implementing simple controller logic here
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.product) query.product = req.query.product;
    if (req.query.type) query.type = req.query.type;

    const total = await LedgerEntry.countDocuments(query);
    const entries = await LedgerEntry.find(query)
      .populate('product', 'name sku')
      .populate('fromWarehouse', 'name')
      .populate('toWarehouse', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      items: entries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;