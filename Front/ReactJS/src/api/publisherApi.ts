import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getPublishers = (languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Publishers?languageUuid=${languageUuid}`);

export const getPublisher = (publisherUuid: string, languageUuid?: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Publishers/${publisherUuid}?languageUuid=${languageUuid}`);

export const addPublisher = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Publishers', payload);

export const updatePublisher = (publisherId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Publishers/${publisherId}`, payload);