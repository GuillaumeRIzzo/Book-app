import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getCategories = (languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Categories?languageUuid=${languageUuid}`);

export const getCategory = (categoryUuid: string, languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Categories/${categoryUuid}?languageUuid=${languageUuid}`);

export const addCategory = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Categories', payload);

export const updateCategory = (categoryId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Categories/${categoryId}`, payload);