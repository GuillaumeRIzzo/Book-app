import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { ResetPasswordRequest, SendResetPasswordPayload } from '@/features/users/passwordSlice';
import { EncryptedPayload } from '@/utils/encryptUtils';
import { User } from '@/models/user/user';

export const updateUserPassword = (userUuid: string, payload: EncryptedPayload): AxiosPromise<User> => apiClient.put<User>(`Users/${userUuid}/password`, payload);

export const forgotPassword = (payload: SendResetPasswordPayload): AxiosPromise => apiClient.post(`UserPasswords/forgot-password`, payload);

export const resetPasswordApi = (payload: ResetPasswordRequest): AxiosPromise => apiClient.post(`UserPasswords/reset-password`, payload);