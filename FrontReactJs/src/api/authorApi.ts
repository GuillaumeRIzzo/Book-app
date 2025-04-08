import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getAuthors = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Authors');

export const getAuthor = (authorId: number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Authors/${authorId}`);

export const addAuthor = (payload: EncryptedPayload): AxiosPromise<EncryptedPayload> => apiClient.post<EncryptedPayload>('Authors', payload);

export const updateAuthor = (payload: EncryptedPayload): AxiosPromise<EncryptedPayload> => apiClient.put<EncryptedPayload>('Authors', payload);