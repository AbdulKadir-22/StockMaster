// FILE: backend/src/models/receipt.model.js
const mongoose = require('mongoose');

const receiptItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    type: String, // Can be ref to a Supplier model in future
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'validated', 'cancelled'],
    default: 'draft'
  },
  items: [receiptItemSchema],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Receipt', receiptSchema);