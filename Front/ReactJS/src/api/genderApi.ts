import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Gender } from '@/models/gender/gender';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getGenders = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Genders');

export const getGender = (genderUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Genders/${genderUuid}`);

export const addGender = (payload: EncryptedPayload) => apiClient.post<Gender>('Genders', payload );

export const updateGender = (genderUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Genders/${genderUuid}`, payload);