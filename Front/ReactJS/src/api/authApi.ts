import axios, { AxiosPromise, InternalAxiosRequestConfig, AxiosError } from 'axios';

import { EncryptedPayload } from '@/utils/encryptUtils';

const PRIMARY_API = process.env.NEXT_PUBLIC_API_BASE_URL;
const BACKUP_API_1 = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const BACKUP_API_2 = process.env.NEXT_PUBLIC_MONGO_API_URL;

export const apiClient = axios.create({
  baseURL: PRIMARY_API,
});

// Interceptor to add Authorization header
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
  
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Interceptor to handle errors and switch to backups
apiClient.interceptors.response.use(
  response => response, // Return normally if OK
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _triedBackup1?: boolean; _triedBackup2?: boolean };

    // Avoid infinite loop
    if (!originalRequest) return Promise.reject(error);

    if (!originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[Failover] Primary API failed. Trying Backup API 1 (Strapi)');
      originalRequest.baseURL = BACKUP_API_1;
      return apiClient(originalRequest);
    }

    if (!originalRequest._triedBackup1) {
      originalRequest._triedBackup1 = true;
      console.warn('[Failover] Backup API 1 failed. Trying Backup API 2 (Mongo)');
      originalRequest.baseURL = BACKUP_API_2;
      return apiClient(originalRequest);
    }

    console.error('[Failover] All backups failed.');
    return Promise.reject(error);
  }
);


export const login = (payload: EncryptedPayload): AxiosPromise<EncryptedPayload> => apiClient.post('Identity/login', payload);