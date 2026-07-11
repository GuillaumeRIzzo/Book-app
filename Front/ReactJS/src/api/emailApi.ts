import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

export const confirmEmailApi = (token: string): AxiosPromise => apiClient.post(`UserEmails/confirm?token=${token}`);

export const resendValidationEmail = (email: string): AxiosPromise => apiClient.post(`UserEmails/${email}/resend-validation`);