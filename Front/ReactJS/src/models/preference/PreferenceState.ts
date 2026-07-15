import { Preference } from './preference';

export interface PreferenceState {
  preference: Preference | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
