import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getBookCategories = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('BookCategory');

export const getBookCategory = (bookCategoryId: number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`BookCategory/${bookCategoryId}`);

export const addBookCategory = (payload: EncryptedPayload): AxiosPromise => apiClient.post('BookCategory', payload);

export const updateBookCategory = (bookCategoryId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`BookCategory/${bookCategoryId}`, payload);