import { AxiosPromise } from 'axios';
import { apiClient } from './authApi';

import { Theme } from '@/models/theme/theme';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getThemes = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Themes');

export const getTheme = (themeUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Themes/${themeUuid}`);

export const addTheme = (payload: EncryptedPayload) => apiClient.post<Theme>('Themes', payload );

export const updateTheme = (themeUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`Themes/${themeUuid}`, payload);