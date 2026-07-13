import { Tag } from './tag';

export interface TagState {
  tags: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
