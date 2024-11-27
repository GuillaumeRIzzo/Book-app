import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { User } from '@/models/user/user';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getUsers = (): AxiosPromise<User[]> => apiClient.get<User[]>('Users');

export const getUser = (userId: number): AxiosPromise<User> => apiClient.get<User>(`Users/${userId}`);

export const addUser = (payload: EncryptedPayload) => apiClient.post<User>('Users', payload );

export const updateUserInfos = (userId: number, payload: EncryptedPayload): AxiosPromise<User> => 
  apiClient.put<User>(`Users/${userId}/infos`, payload);

export const updateUserPassword = (userId: number, payload: EncryptedPayload): AxiosPromise<User> => 
  apiClient.put<User>(`Users/${userId}/password`, payload);
