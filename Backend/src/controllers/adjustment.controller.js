// FILE: backend/src/controllers/adjustment.controller.js
const Adjustment = require('../models/adjustment.model');
const adjustmentService = require('../services/adjustment.service');
const { successResponse } = require('../utils/response');

exports.createAdjustment = async (req, res, next) => {
  try {
    // Service handles full logic including immediate validation and stock update
    const adjustment = await adjustmentService.createAdjustment(req.body, req.user.id);
    successResponse(res, adjustment, 'Stock adjustment processed', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAdjustments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Adjustment.countDocuments();
    const adjustments = await Adjustment.find()
      .populate('warehouse', 'name')
      .populate('items.product', 'name sku')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      items: adjustments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id)
      .populate('warehouse', 'name')
      .populate('items.product', 'name sku');

    if (!adjustment) {
      const error = new Error('Adjustment not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, adjustment);
  } catch (error) {
    next(error);
  }
};