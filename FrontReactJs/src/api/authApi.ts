import axios, { AxiosPromise } from 'axios';

import { environment } from 'environments/environment';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const login = (payload: EncryptedPayload): AxiosPromise<EncryptedPayload> => apiClient.post('Identity/login', payload);