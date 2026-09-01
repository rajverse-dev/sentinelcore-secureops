import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, endpoints } from '../config/api';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (payload: Record<string, string>) => api.post(endpoints.login, payload),
  register: (payload: Record<string, string>) => api.post(endpoints.register, payload)
};

export const assetApi = {
  getAssets: () => api.get(endpoints.assets)
};

export const alertApi = {
  getAlerts: () => api.get(endpoints.alerts)
};

export const monitoringApi = {
  getOverview: () => api.get(endpoints.monitoring)
};

export default api;
