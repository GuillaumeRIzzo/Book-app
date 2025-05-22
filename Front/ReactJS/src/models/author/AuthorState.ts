import { Author } from './Author';

export interface AuthorState {
  authors: Author[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
