import { Book } from '@/models/book/Book';
import { apiClient } from './authApi';
import { AxiosPromise } from 'axios';

export const getBooks = (): AxiosPromise<Book[]> => apiClient.get<Book[]>('Books');

export const getBook = (bookId: number): AxiosPromise<Book> => apiClient.get<Book>(`Books/${bookId}`);