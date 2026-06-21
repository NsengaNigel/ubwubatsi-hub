import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ubwubatsi-hub.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ubwubatsi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ubwubatsi_token');
      localStorage.removeItem('ubwubatsi_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
