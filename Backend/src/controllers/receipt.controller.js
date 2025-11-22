// FILE: backend/src/controllers/receipt.controller.js
const Receipt = require('../models/receipt.model');
const receiptService = require('../services/receipt.service');
const { successResponse } = require('../utils/response');

exports.createReceipt = async (req, res, next) => {
  try {
    // Ensure status is draft initially
    const receiptData = { ...req.body, status: 'draft' };
    const receipt = await Receipt.create(receiptData);
    successResponse(res, receipt, 'Receipt draft created', 201);
  } catch (error) {
    next(error);
  }
};

exports.getReceipts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const total = await Receipt.countDocuments(query);
    const receipts = await Receipt.find(query)
      .populate('warehouse', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      items: receipts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('warehouse', 'name')
      .populate('items.product', 'name sku');
      
    if (!receipt) {
      const error = new Error('Receipt not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, receipt);
  } catch (error) {
    next(error);
  }
};

exports.validateReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptService.validateReceipt(req.params.id, req.user.id);
    successResponse(res, receipt, 'Receipt validated and stock updated');
  } catch (error) {
    next(error);
  }
};