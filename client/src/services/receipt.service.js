// FILE: stockmaster-frontend/src/services/receipt.service.js
import api from '../lib/api';

const getAll = async () => {
  return await api.get('/receipts');
};

const create = async (data) => {
  // POST /receipts
  return await api.post('/receipts', data);
};

const validate = async (id) => {
  // POST /receipts/:id/validate
  return await api.post(`/receipts/${id}/validate`);
};

const receiptService = {
  getAll,
  create,
  validate,
};

export default receiptService;