import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { Publisher } from '@/models/publisher/Publisher';

export const getPublishers = (): AxiosPromise<Publisher[]> => apiClient.get<Publisher[]>('Publishers');

export const getPublisher = (publisherId: Number): AxiosPromise<Publisher> => apiClient.get<Publisher>(`Publishers/${publisherId}`);