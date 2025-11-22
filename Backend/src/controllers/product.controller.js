// FILE: backend/src/controllers/product.controller.js
const Product = require('../models/product.model');
const { successResponse } = require('../utils/response');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    successResponse(res, {
      items: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    successResponse(res, {}, 'Product deleted');
  } catch (error) {
    next(error);
  }
};