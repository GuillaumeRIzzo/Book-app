import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getAuthors = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Authors');

export const getAuthor = (authorId: number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Authors/${authorId}`);

export const addAuthor = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Authors', payload);

export const updateAuthor = (authorId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Authors/${authorId}`, payload);