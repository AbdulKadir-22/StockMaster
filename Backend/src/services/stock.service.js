// FILE: backend/src/services/stock.service.js
const StockItem = require('../models/stockItem.model');

/**
 * Increments stock for a product in a specific warehouse.
 * Creates the StockItem if it doesn't exist.
 */
const incrementStock = async (productId, warehouseId, qty, session) => {
  const stockItem = await StockItem.findOneAndUpdate(
    { product: productId, warehouse: warehouseId },
    { $inc: { quantity: qty } },
    { new: true, upsert: true, session }
  );
  return stockItem;
};

/**
 * Decrements stock for a product in a specific warehouse.
 * Throws an error if insufficient stock (considering reserved items).
 */
const decrementStock = async (productId, warehouseId, qty, session) => {
  const stockItem = await StockItem.findOne({
    product: productId,
    warehouse: warehouseId,
  }).session(session);

  if (!stockItem) {
    const error = new Error(`Stock item not found for product ${productId} in warehouse ${warehouseId}`);
    error.statusCode = 404;
    throw error;
  }

  const availableStock = stockItem.quantity - stockItem.reserved;

  if (availableStock < qty) {
    const error = new Error(`Insufficient stock. Available: ${availableStock}, Required: ${qty}`);
    error.statusCode = 400;
    throw error;
  }

  stockItem.quantity -= qty;
  await stockItem.save({ session });

  return stockItem;
};

/**
 * Gets the current stock quantity for a product in a warehouse.
 * Used for calculations like Adjustments.
 */
const getStockLevel = async (productId, warehouseId, session) => {
  const stockItem = await StockItem.findOne({
    product: productId,
    warehouse: warehouseId,
  }).session(session);

  return stockItem ? stockItem.quantity : 0;
};

/**
 * Sets specific stock quantity (used for adjustments).
 */
const setStock = async (productId, warehouseId, newQty, session) => {
  const stockItem = await StockItem.findOneAndUpdate(
    { product: productId, warehouse: warehouseId },
    { $set: { quantity: newQty } },
    { new: true, upsert: true, session }
  );
  return stockItem;
};

module.exports = {
  incrementStock,
  decrementStock,
  getStockLevel,
  setStock
};