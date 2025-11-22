// FILE: backend/src/services/delivery.service.js
const mongoose = require('mongoose');
const Delivery = require('../models/delivery.model');
const stockService = require('./stock.service');
const ledgerService = require('./ledger.service');

const validateDelivery = async (deliveryId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const delivery = await Delivery.findById(deliveryId).session(session);

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (delivery.status !== 'draft') {
      throw new Error('Delivery is already processed');
    }

    // Process each item
    for (const item of delivery.items) {
      // 1. Decrement stock (Checks availability internally)
      const updatedStock = await stockService.decrementStock(
        item.product,
        delivery.warehouse,
        item.quantity,
        session
      );

      // 2. Create Ledger Entry
      await ledgerService.createEntry({
        type: 'delivery',
        referenceId: delivery._id,
        referenceModel: 'Delivery',
        product: item.product,
        fromWarehouse: delivery.warehouse,
        qtyDelta: -item.quantity, // Negative for delivery
        balanceAfter: updatedStock.quantity,
        reason: `Delivery #${delivery.deliveryNumber}`
      }, session);
    }

    // 3. Update Delivery Status
    delivery.status = 'validated';
    await delivery.save({ session });

    await session.commitTransaction();
    return delivery;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  validateDelivery,
};