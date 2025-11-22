// FILE: backend/src/models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  uom: {
    type: String, // Unit of Measure (e.g., kg, pcs, boxes)
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  costPrice: {
    type: Number,
    default: 0
  },
  salesPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);