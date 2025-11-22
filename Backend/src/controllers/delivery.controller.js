// FILE: backend/src/controllers/delivery.controller.js
const Delivery = require('../models/delivery.model');
const deliveryService = require('../services/delivery.service');
const { successResponse } = require('../utils/response');

exports.createDelivery = async (req, res, next) => {
  try {
    const deliveryData = { ...req.body, status: 'draft' };
    const delivery = await Delivery.create(deliveryData);
    successResponse(res, delivery, 'Delivery draft created', 201);
  } catch (error) {
    next(error);
  }
};

exports.getDeliveries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;

    const total = await Delivery.countDocuments(query);
    const deliveries = await Delivery.find(query)
      .populate('warehouse', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      items: deliveries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('warehouse', 'name')
      .populate('items.product', 'name sku');

    if (!delivery) {
      const error = new Error('Delivery not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, delivery);
  } catch (error) {
    next(error);
  }
};

exports.validateDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.validateDelivery(req.params.id, req.user.id);
    successResponse(res, delivery, 'Delivery validated and stock updated');
  } catch (error) {
    next(error);
  }
};