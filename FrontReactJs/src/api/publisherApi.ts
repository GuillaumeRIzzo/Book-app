import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getPublishers = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Publishers');

export const getPublisher = (publisherId: Number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Publishers/${publisherId}`);