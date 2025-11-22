// FILE: stockmaster-frontend/src/services/ledger.service.js
import api from '../lib/api';

const getAll = async (params = {}) => {
  // GET /ledger?page=1&limit=10&type=RECEIPT
  // Expected return: { items: [], total: 100, page: 1, totalPages: 10 }
  const queryString = new URLSearchParams(params).toString();
  return await api.get(`/ledger?${queryString}`);
};

const ledgerService = {
  getAll,
};

export default ledgerService;