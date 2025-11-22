// FILE: backend/src/controllers/transfer.controller.js
const Transfer = require('../models/transfer.model');
const transferService = require('../services/transfer.service');
const { successResponse } = require('../utils/response');

exports.createTransfer = async (req, res, next) => {
  try {
    const transferData = { ...req.body, status: 'draft' };
    const transfer = await Transfer.create(transferData);
    successResponse(res, transfer, 'Transfer draft created', 201);
  } catch (error) {
    next(error);
  }
};

exports.getTransfers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;

    const total = await Transfer.countDocuments(query);
    const transfers = await Transfer.find(query)
      .populate('sourceWarehouse', 'name')
      .populate('destinationWarehouse', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      items: transfers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('sourceWarehouse', 'name')
      .populate('destinationWarehouse', 'name')
      .populate('items.product', 'name sku');

    if (!transfer) {
      const error = new Error('Transfer not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, transfer);
  } catch (error) {
    next(error);
  }
};

exports.executeTransfer = async (req, res, next) => {
  try {
    const transfer = await transferService.executeTransfer(req.params.id, req.user.id);
    successResponse(res, transfer, 'Transfer executed successfully');
  } catch (error) {
    next(error);
  }
};