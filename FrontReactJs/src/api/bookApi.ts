import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { Book } from '@/models/book/Book';
import { EncryptedPayload } from '@/utils/encryptUtils';

export const getBooks = (): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>('Books');

export const getBook = (bookId: number): AxiosPromise<EncryptedPayload> => apiClient.get<EncryptedPayload>(`Books/${bookId}`);