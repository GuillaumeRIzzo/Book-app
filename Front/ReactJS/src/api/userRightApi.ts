import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { UserRight } from '@/models/userRight/userRight';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getUserRights = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('UserRights');

export const getUserRight = (userRightUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`UserRights/${userRightUuid}`);

export const addUserRight = (payload: EncryptedPayload) => apiClient.post<UserRight>('UserRights', payload );

export const updateUserRight = (userRightUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`UserRights/${userRightUuid}`, payload);