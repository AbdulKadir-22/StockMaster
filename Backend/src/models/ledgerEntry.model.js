// FILE: backend/src/models/ledgerEntry.model.js
const mongoose = require('mongoose');

const ledgerEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'referenceModel' // Dynamic reference based on doc type if needed, usually handled by logic
  },
  referenceModel: {
    type: String,
    enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment'],
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    default: null // Null for Receipts
  },
  toWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    default: null // Null for Deliveries
  },
  qtyDelta: {
    type: Number,
    required: true // Positive adds stock, negative removes stock
  },
  reason: {
    type: String
  },
  balanceAfter: {
    type: Number // Snapshot of stock at that specific location after this move
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LedgerEntry', ledgerEntrySchema);