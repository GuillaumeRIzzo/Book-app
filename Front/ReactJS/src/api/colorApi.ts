import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Color } from '@/models/color/color';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getColors = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Colors');

export const getColor = (colorUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Colors/${colorUuid}`);

export const addColor = (payload: EncryptedPayload) => apiClient.post<Color>('Colors', payload );

export const updateColor = (colorUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Colors/${colorUuid}`, payload);