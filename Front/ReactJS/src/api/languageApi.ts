import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Language } from '@/models/language/language';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getLanguages = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Languages');

export const getLanguage = (languageUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Languages/${languageUuid}`);

export const addLanguage = (payload: EncryptedPayload) => apiClient.post<Language>('Languages', payload );

export const updateLanguage = (languageUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Languages/${languageUuid}`, payload);