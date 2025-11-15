import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getGoogleLoginUrl: () => api.get('/auth/google/url'),
  googleCallback: (code) => api.post('/auth/google/callback', { code }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Session API
export const sessionAPI = {
  create: (data) => api.post('/sessions', data),
  list: (status) => api.get('/sessions', { params: { status } }),
  get: (id) => api.get(`/sessions/${id}`),
  update: (id, data) => api.patch(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  start: (id) => api.post(`/sessions/${id}/start`),
  pause: (id) => api.post(`/sessions/${id}/pause`),
  getEvents: (id) => api.get(`/sessions/${id}/events`),
};

// Position API
export const positionAPI = {
  listBySession: (sessionId) => api.get(`/positions/session/${sessionId}`),
  get: (id) => api.get(`/positions/${id}`),
};

export default api;
