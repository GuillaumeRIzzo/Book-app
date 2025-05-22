import { Book } from './Book';

export interface BookState {
  books: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
