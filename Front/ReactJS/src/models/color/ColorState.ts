import { Color } from './color';

export interface ColorState {
  colors: Color[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
