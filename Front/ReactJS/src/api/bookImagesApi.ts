import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getImages = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('BookImages');

export const getImage = (imageUuid: string): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`BookImages/${imageUuid}`);

export const addImage = (payload: EncryptedPayload): AxiosPromise => apiClient.post('BookImages', payload);

export const updateImage = (imageUuid: string, payload: EncryptedPayload): AxiosPromise => apiClient.put(`BookImages/${imageUuid}`, payload);

export const delImage = (bookId: number): AxiosPromise => apiClient.delete(`BookImages/${bookId}`);