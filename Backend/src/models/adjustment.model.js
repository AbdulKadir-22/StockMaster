// FILE: backend/src/models/adjustment.model.js
const mongoose = require('mongoose');

const adjustmentItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  systemQuantity: {
    type: Number,
    required: true
  },
  countedQuantity: {
    type: Number,
    required: true
  },
  // The difference (counted - system) is calculated at validation
  difference: {
    type: Number
  }
}, { _id: false });

const adjustmentSchema = new mongoose.Schema({
  adjustmentNumber: {
    type: String,
    required: true,
    unique: true
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
  reason: {
    type: String,
    default: 'Stock Count'
  },
  items: [adjustmentItemSchema],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Adjustment', adjustmentSchema);