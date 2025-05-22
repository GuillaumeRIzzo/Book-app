import { BookCategory } from './BookCategory';

export interface BookCategoryState {
  bookCategories: BookCategory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
