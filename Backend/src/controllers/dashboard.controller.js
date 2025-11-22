// FILE: backend/src/controllers/dashboard.controller.js
const Product = require('../models/product.model');
const Warehouse = require('../models/warehouse.model');
const StockItem = require('../models/stockItem.model');
const { successResponse } = require('../utils/response');

exports.getSummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalWarehouses = await Warehouse.countDocuments();

    // Calculate approximate total stock value
    // Group by nothing, sum (quantity * product.costPrice)
    // Note: This requires lookup from StockItem to Product
    const valueAgg = await StockItem.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$quantity', '$productDetails.costPrice'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const summary = {
      totalProducts,
      totalWarehouses,
      totalStockValue: valueAgg[0] ? valueAgg[0].totalValue : 0,
      totalStockQuantity: valueAgg[0] ? valueAgg[0].totalQuantity : 0
    };

    successResponse(res, summary);
  } catch (error) {
    next(error);
  }
};

exports.getLowStock = async (req, res, next) => {
  try {
    // Find stock items where quantity <= product.reorderLevel
    const lowStockItems = await StockItem.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          $expr: { $lte: ['$quantity', '$product.reorderLevel'] }
        }
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: 'warehouse',
          foreignField: '_id',
          as: 'warehouse'
        }
      },
      { $unwind: '$warehouse' },
      {
        $project: {
          _id: 1,
          quantity: 1,
          productName: '$product.name',
          sku: '$product.sku',
          reorderLevel: '$product.reorderLevel',
          warehouseName: '$warehouse.name'
        }
      }
    ]);

    successResponse(res, lowStockItems, 'Low stock alerts');
  } catch (error) {
    next(error);
  }
};