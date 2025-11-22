// FILE: stockmaster-frontend/src/services/delivery.service.js
import api from '../lib/api';

const getAll = async () => {
  return await api.get('/deliveries');
};

const create = async (data) => {
  // POST /deliveries
  return await api.post('/deliveries', data);
};

const validate = async (id) => {
  // POST /deliveries/:id/validate
  return await api.post(`/deliveries/${id}/validate`);
};

const deliveryService = {
  getAll,
  create,
  validate,
};

export default deliveryService;