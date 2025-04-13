import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    if (error) {
      console.error("Erreur dans l'intercepteur de requête:", error);
    } else {
      console.error("Une erreur inconnue est survenue dans l'intercepteur de requête.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;