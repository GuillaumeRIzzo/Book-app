import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getCategories = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Categories');

export const getCategory = (categoryUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Categories/${categoryUuid}`);

export const addCategory = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Categories', payload);

export const updateCategory = (categoryId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Categories/${categoryId}`, payload);