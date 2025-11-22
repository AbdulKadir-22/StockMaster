// FILE: backend/src/controllers/stock.controller.js
const StockItem = require('../models/stockItem.model');
const { successResponse } = require('../utils/response');

exports.getStock = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.warehouse) query.warehouse = req.query.warehouse;
    if (req.query.product) query.product = req.query.product;

    // If filtering by low stock
    if (req.query.lowStock === 'true') {
      // This usually requires aggregation or post-processing if reorderLevel is on Product
      // For simplicity here, we assume basic filtering or client handles it, 
      // but typically this belongs in a specific low-stock endpoint or aggregation (see Dashboard).
    }

    const total = await StockItem.countDocuments(query);
    const stockItems = await StockItem.find(query)
      .populate('product', 'name sku category uom reorderLevel')
      .populate('warehouse', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    successResponse(res, {
      items: stockItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};