export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  assets: '/api/assets',
  alerts: '/api/alerts',
  monitoring: '/api/monitoring'
};
