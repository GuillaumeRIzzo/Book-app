import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Tag } from '@/models/tag/tag';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getTags = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Tags');

export const getTag = (tagUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Tags/${tagUuid}`);

export const addTag = (payload: EncryptedPayload) => apiClient.post<Tag>('Tags', payload );

export const updateTag = (tagUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Tags/${tagUuid}`, payload);