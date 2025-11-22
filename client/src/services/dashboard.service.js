// FILE: stockmaster-frontend/src/services/dashboard.service.js
import api from '../lib/api';

const getSummary = async () => {
  // GET /dashboard/summary
  // Expected return: 
  // { 
  //   totalProducts: 1482, 
  //   lowStockCount: 15, 
  //   pendingReceipts: 8,
  //   pendingDeliveries: 12,
  //   recentActivity: [ ... ] 
  // }
  return await api.get('/dashboard/summary');
};

const getLowStock = async () => {
  // GET /dashboard/low-stock
  return await api.get('/dashboard/low-stock');
};

const dashboardService = {
  getSummary,
  getLowStock,
};

export default dashboardService;