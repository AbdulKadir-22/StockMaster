// FILE: backend/src/services/adjustment.service.js
const mongoose = require('mongoose');
const Adjustment = require('../models/adjustment.model');
const stockService = require('./stock.service');
const ledgerService = require('./ledger.service');

/**
 * Creates and processes an inventory adjustment immediately.
 * @param {Object} data - { warehouse, items: [{ product, countedQuantity }], reason, notes }
 * @param {String} userId - ID of user performing action
 */
const createAdjustment = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const adjustmentItems = [];
    const { warehouse, items, reason, notes } = data;

    // Generate a temporary ID for the adjustment doc to use in Ledger reference
    // or create the doc instance first.
    const adjustmentDoc = new Adjustment({
      warehouse,
      reason,
      notes,
      status: 'validated', // Auto-validating as per requirements for this specific flow
      adjustmentNumber: `ADJ-${Date.now()}`, // Simple auto-gen for now
      items: [] 
    });

    for (const item of items) {
      const currentQty = await stockService.getStockLevel(item.product, warehouse, session);
      const delta = item.countedQuantity - currentQty;

      // If there is no difference, we might still record it as a verified count, 
      // but usually ledger entries track changes.
      
      // 1. Update Stock to match physical count exactly
      const updatedStock = await stockService.setStock(
        item.product,
        warehouse,
        item.countedQuantity,
        session
      );

      // 2. Add to adjustment document items
      adjustmentItems.push({
        product: item.product,
        systemQuantity: currentQty,
        countedQuantity: item.countedQuantity,
        difference: delta
      });

      // 3. Create Ledger Entry if stock changed
      if (delta !== 0) {
        await ledgerService.createEntry({
          type: 'adjustment',
          referenceId: adjustmentDoc._id,
          referenceModel: 'Adjustment',
          product: item.product,
          fromWarehouse: delta < 0 ? warehouse : null, // If lost, moved 'from' warehouse
          toWarehouse: delta > 0 ? warehouse : null,   // If found, moved 'to' warehouse
          qtyDelta: delta,
          balanceAfter: updatedStock.quantity,
          reason: reason || 'Stock Count Adjustment'
        }, session);
      }
    }

    adjustmentDoc.items = adjustmentItems;
    await adjustmentDoc.save({ session });

    await session.commitTransaction();
    return adjustmentDoc;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createAdjustment,
};