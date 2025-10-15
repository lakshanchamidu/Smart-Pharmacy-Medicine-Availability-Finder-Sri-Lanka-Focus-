import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (e) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me')
};

export const pharmacyService = {
  list: (params) => api.get('/pharmacies', { params }),
  get: (id) => api.get(`/pharmacies/${id}`),
  create: (data) => api.post('/pharmacies', data),
  update: (id, data) => api.patch(`/pharmacies/${id}`, data)
};

export const medicineService = {
  search: (params) => api.get('/medicines', { params }),
  get: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data)
};

export const inventoryService = {
  get: (params) => api.get('/inventory', { params }),
  upsert: (data) => api.put('/inventory', data)
};

export const searchService = {
  availability: (params) => api.get('/search', { params })
};

export const reservationService = {
  create: (data) => api.post('/reservations', data),
  mine: () => api.get('/reservations?mine=true'),
  get: (id) => api.get(`/reservations/${id}`),
  confirm: (id) => api.post(`/reservations/${id}/confirm`),
  cancel: (id) => api.post(`/reservations/${id}/cancel`)
};

export const prescriptionService = {
  create: (formData) => api.post('/prescriptions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  mine: () => api.get('/prescriptions?mine=true'),
  get: (id) => api.get(`/prescriptions/${id}`),
  review: (id) => api.post(`/prescriptions/${id}/review`),
  decision: (id, data) => api.post(`/prescriptions/${id}/decision`, data),
  cancel: (id) => api.post(`/prescriptions/${id}/cancel`),
  confirm: (id) => api.post(`/prescriptions/${id}/confirm`)
};

export default api;
