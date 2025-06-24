import { Theme } from './theme';

export interface ThemeState {
  themes: Theme[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
