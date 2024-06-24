import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { User } from '@/models/user/User';

export const getUsers = (): AxiosPromise<User[]> => apiClient.get<User[]>('Users');

export const getUser = (userId: number): AxiosPromise<User> => apiClient.get<User>(`Users/${userId}`);

export const addUser = (user: User) => apiClient.post<User>('Users', user, );
