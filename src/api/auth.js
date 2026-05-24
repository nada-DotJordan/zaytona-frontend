import api from './api';

// Register
export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  localStorage.setItem('token', res.data.token);
  return res.data.user;   // ← بدل ما يرجع { message }
};

// Login
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
};