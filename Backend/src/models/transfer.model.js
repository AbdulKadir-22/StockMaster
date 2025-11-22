// FILE: backend/src/models/transfer.model.js
const mongoose = require('mongoose');

const transferItemSchema = new mongoose.Schema({
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

const transferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    required: true,
    unique: true
  },
  sourceWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  destinationWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'validated', 'cancelled'],
    default: 'draft'
  },
  items: [transferItemSchema],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transfer', transferSchema);