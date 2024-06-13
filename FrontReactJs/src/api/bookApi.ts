import { Book } from '@/models/book/Book';
import { apiClient } from './authApi';

export const getBooks = () => apiClient.get<Book[]>('books');