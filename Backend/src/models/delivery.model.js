// FILE: backend/src/models/delivery.model.js
const mongoose = require('mongoose');

const deliveryItemSchema = new mongoose.Schema({
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

const deliverySchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: String, // Can be ref to Customer model in future
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
  items: [deliveryItemSchema],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);