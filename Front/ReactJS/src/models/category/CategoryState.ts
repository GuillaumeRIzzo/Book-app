import { Category } from './Category';

export interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
