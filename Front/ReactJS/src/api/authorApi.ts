import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getAuthors = (languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Authors?languageUuid=${languageUuid}`);

export const getAuthor = (authorUuid: string, languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Authors/${authorUuid}?languageUuid=${languageUuid}`);

export const addAuthor = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Authors', payload);

export const updateAuthor = (authorUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Authors/${authorUuid}`, payload);