import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Preference } from '@/models/preference/preference';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getPreference = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Preferences`);

export const addPreference = (payload: EncryptedPayload) => apiClient.post<Preference>('Preferences', payload );

export const updatePreference = (preferenceUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Preferences/${preferenceUuid}`, payload);