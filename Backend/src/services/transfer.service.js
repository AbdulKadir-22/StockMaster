// FILE: backend/src/services/transfer.service.js
const mongoose = require('mongoose');
const Transfer = require('../models/transfer.model');
const stockService = require('./stock.service');
const ledgerService = require('./ledger.service');

const executeTransfer = async (transferId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transfer = await Transfer.findById(transferId).session(session);

    if (!transfer) {
      throw new Error('Transfer order not found');
    }

    if (transfer.status !== 'draft') {
      throw new Error('Transfer is already processed');
    }

    for (const item of transfer.items) {
      // 1. Decrement from Source
      const sourceStock = await stockService.decrementStock(
        item.product,
        transfer.sourceWarehouse,
        item.quantity,
        session
      );

      // 2. Increment at Destination
      const destStock = await stockService.incrementStock(
        item.product,
        transfer.destinationWarehouse,
        item.quantity,
        session
      );

      // 3. Create Ledger Entry (Represents the movement)
      // Note: We create one ledger entry describing the transfer, 
      // or two if we want to track specific warehouse histories strictly. 
      // Based on requirements "referencing both warehouses", one entry is often cleaner for the transfer record,
      // but for strict per-warehouse auditing, two entries (Out from A, In to B) are often better.
      // For this specific requirement, I will generate a single "Transfer" ledger entry that links both.
      
      await ledgerService.createEntry({
        type: 'transfer',
        referenceId: transfer._id,
        referenceModel: 'Transfer',
        product: item.product,
        fromWarehouse: transfer.sourceWarehouse,
        toWarehouse: transfer.destinationWarehouse,
        qtyDelta: item.quantity, // Standard convention: Transfer amount
        reason: `Transfer #${transfer.transferNumber}`,
        // balanceAfter is ambiguous in a single transfer row, usually skipped or we record the Dest balance
        balanceAfter: destStock.quantity 
      }, session);
    }

    transfer.status = 'validated';
    await transfer.save({ session });

    await session.commitTransaction();
    return transfer;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  executeTransfer,
};