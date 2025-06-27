import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { User } from '@/models/user/user';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getUsers = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Users');

export const getUser = (userUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Users/${userUuid}`);

export const addUser = (payload: EncryptedPayload) => apiClient.post<User>('Users', payload );

export const updateUserInfos = (userUuid: string, payload: EncryptedPayload): AxiosPromise<User> => 
  apiClient.put<User>(`Users/${userUuid}/infos`, payload);