import axios from 'axios';

// 1. Detect base URL automatically (localhost when dev, Render when live)
const rawBase = import.meta.env.VITE_API_URL || 'https://yasir-tech-lab-api.onrender.com';

// Ensure the baseURL ends with /api/v1 cleanly without duplicates
const cleanBase = rawBase.replace(/\/api\/v1\/?$/, '');
const baseURL = `${cleanBase}/api/v1`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach the bearer token to EVERY outgoing request
api.interceptors.request.use(
  (config) => {
    // Read from any possible storage key
    const token =
      localStorage.getItem('ytl_admin_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('jwt');

    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Catch 401 and redirect to login if session expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] 401 Unauthorized encountered. Token may be missing or expired.');
    }
    return Promise.reject(error);
  }
);

export default api;