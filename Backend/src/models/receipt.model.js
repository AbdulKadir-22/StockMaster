// FILE: backend/src/models/receipt.model.js

const mongoose = require('mongoose');

/**
 * Each item in a receipt represents a single product and quantity
 * being received into a warehouse.
 */
const receiptItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

/**
 * Helper to generate a reasonably unique human-readable receipt number.
 * Example: RCPT-20241122-173045-482
 */
const generateReceiptNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  return `RCPT-${y}${m}${d}-${h}${min}${s}-${rand}`;
};

const receiptSchema = new mongoose.Schema(
  {
    /**
     * Business identifier for the receipt.
     * Frontend does NOT need to send this – it is auto-generated here.
     */
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      default: generateReceiptNumber, // <-- key fix
    },

    // Supplier name (could be changed to a Supplier ref in future)
    supplier: {
      type: String,
      required: true,
    },

    // Warehouse that will receive this stock
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },

    // Workflow status for the receipt
    status: {
      type: String,
      enum: ['draft', 'validated', 'cancelled'],
      default: 'draft',
    },

    // Line items for this receipt
    items: [receiptItemSchema],

    // Optional free-text notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Receipt', receiptSchema);
