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
      const requestUrl = error.config?.url || '';
      if (!requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
