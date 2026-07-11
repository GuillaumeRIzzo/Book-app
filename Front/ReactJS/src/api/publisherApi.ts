import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getPublishers = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Publishers');

export const getPublisher = (publisherId: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Publishers/${publisherId}`);

export const addPublisher = (payload: EncryptedPayload): AxiosPromise => apiClient.post('Publishers', payload);

export const updatePublisher = (publisherId: number, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Publishers/${publisherId}`, payload);