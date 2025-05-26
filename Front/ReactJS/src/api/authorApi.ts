import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getAuthors = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Authors');

export const getAuthor = (authorUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Authors/${authorUuid}`);

export const addAuthor = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Authors', payload);

export const updateAuthor = (authorUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Authors/${authorUuid}`, payload);