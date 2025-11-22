// FILE: backend/src/services/receipt.service.js
const mongoose = require('mongoose');
const Receipt = require('../models/receipt.model');
const stockService = require('./stock.service');
const ledgerService = require('./ledger.service');

const validateReceipt = async (receiptId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const receipt = await Receipt.findById(receiptId).session(session);

    if (!receipt) {
      throw new Error('Receipt not found');
    }

    if (receipt.status !== 'draft') {
      throw new Error('Receipt is already processed');
    }

    // Process each item
    for (const item of receipt.items) {
      // 1. Increment physical stock
      const updatedStock = await stockService.incrementStock(
        item.product,
        receipt.warehouse,
        item.quantity,
        session
      );

      // 2. Create Ledger Entry
      await ledgerService.createEntry({
        type: 'receipt',
        referenceId: receipt._id,
        referenceModel: 'Receipt',
        product: item.product,
        toWarehouse: receipt.warehouse,
        qtyDelta: item.quantity, // Positive for receipt
        balanceAfter: updatedStock.quantity,
        reason: `Receipt #${receipt.receiptNumber}`
      }, session);
    }

    // 3. Update Receipt Status
    receipt.status = 'validated';
    // In a real app, you might store validatedBy (userId) here if added to schema
    await receipt.save({ session });

    await session.commitTransaction();
    return receipt;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  validateReceipt,
};