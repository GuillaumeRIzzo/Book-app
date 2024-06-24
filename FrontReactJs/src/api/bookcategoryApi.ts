import { AxiosPromise } from 'axios';

import { apiClient } from './authApi';
import { BookCategory } from '@/models/book-category/BookCategory';

export const getBookCategories = (): AxiosPromise<BookCategory[]> => apiClient.get<BookCategory[]>('BookCategory');

export const getBookCategory = (): AxiosPromise<BookCategory> => apiClient.get<BookCategory>('BookCategory');