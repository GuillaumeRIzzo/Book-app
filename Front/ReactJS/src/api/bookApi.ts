import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getBooks = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Books');

export const getBook = (bookId: number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Books/${bookId}`);

export const addBook = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Books', payload);

export const updateBook = (bookId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Books/${bookId}`, payload);

export const delBook = (bookId: number): AxiosPromise => apiClient.delete(`Books/${bookId}`);