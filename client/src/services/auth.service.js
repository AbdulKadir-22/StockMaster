// FILE: stockmaster-frontend/src/services/auth.service.js
import api from '../lib/api';

const login = async (email, password) => {
  // POST /auth/login
  // Expected return (from api.js unwrap): { token: "...", user: { ... } }
  return await api.post('/auth/login', { email, password });
};

const register = async (userData) => {
  // POST /auth/register
  return await api.post('/auth/register', userData);
};

const getMe = async () => {
  // GET /users/me
  // Expected return: { id: "...", email: "...", role: "..." }
  return await api.get('/auth/me');
};

const authService = {
  login,
  register,
  getMe,
};

export default authService;