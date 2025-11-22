// FILE: backend/src/models/stockItem.model.js
const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  reserved: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure a product only appears once per warehouse
stockItemSchema.index({ product: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('StockItem', stockItemSchema);