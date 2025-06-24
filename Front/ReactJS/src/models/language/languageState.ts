import { Language } from './language';

export interface LanguageState {
  languages: Language[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
