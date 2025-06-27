import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getBooks = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Books');

export const getBook = (bookUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Books/${bookUuid}`);

export const addBook = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Books', payload);

export const updateBook = (bookUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Books/${bookUuid}`, payload);

export const delBook = (bookUuid: string): AxiosPromise => apiClient.delete(`Books/${bookUuid}`);