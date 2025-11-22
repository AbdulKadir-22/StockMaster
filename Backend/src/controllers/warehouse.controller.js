// FILE: backend/src/controllers/warehouse.controller.js
const Warehouse = require('../models/warehouse.model');
const { successResponse } = require('../utils/response');

exports.createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    successResponse(res, warehouse, 'Warehouse created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getWarehouses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Warehouse.countDocuments();
    const warehouses = await Warehouse.find().skip(skip).limit(limit);

    successResponse(res, {
      items: warehouses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, warehouse);
  } catch (error) {
    next(error);
  }
};

exports.updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, warehouse, 'Warehouse updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, {}, 'Warehouse deleted');
  } catch (error) {
    next(error);
  }
};