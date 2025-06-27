import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

export const confirmEmailApi = (token: string): AxiosPromise => apiClient.post(`UserEmails/confirm-email?token=${token}`);