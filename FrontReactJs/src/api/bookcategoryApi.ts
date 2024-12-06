import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getBookCategories = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('BookCategory');

export const getBookCategory = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('BookCategory');