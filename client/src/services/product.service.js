// FILE: stockmaster-frontend/src/services/product.service.js
import api from '../lib/api';

const getAll = async (params = {}) => {
  // GET /products?page=1&limit=10&search=...
  // Expected return: { items: [], total: 100, page: 1, totalPages: 10 }
  const queryString = new URLSearchParams(params).toString();
  return await api.get(`/products?${queryString}`);
};

const getById = async (id) => {
  // GET /products/:id
  return await api.get(`/products/${id}`);
};

const create = async (data) => {
  // POST /products
  return await api.post('/products', data);
};

const update = async (id, data) => {
  // PUT /products/:id
  return await api.put(`/products/${id}`, data);
};

const remove = async (id) => {
  // DELETE /products/:id
  return await api.delete(`/products/${id}`);
};

const productService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default productService;