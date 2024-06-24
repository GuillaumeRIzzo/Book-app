import { Author } from '@/models/author/Author';
import { apiClient } from './authApi';
import { AxiosPromise } from 'axios';

export const getAuthors = (): AxiosPromise<Author[]> => apiClient.get<Author[]>('Authors');

export const getAuthor = (authorId: number): AxiosPromise<Author> => apiClient.get<Author>(`Authors/${authorId}`);