// FILE: stockmaster-frontend/src/services/warehouse.service.js
import api from '../lib/api';

const getAll = async () => {
  // GET /warehouses
  return await api.get('/warehouses');
};

const warehouseService = {
  getAll,
};

export default warehouseService;