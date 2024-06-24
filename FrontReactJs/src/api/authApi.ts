import axios from 'axios';
import { getSession } from 'next-auth/react';

import { environment } from '@/environments/environment';

export const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

export const login = (identifier: string, password: string): Promise<any> => apiClient.post('Identity/login', {identifier, password});