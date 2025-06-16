import { Preference } from './preference';

export interface PreferenceState {
  preferences: Preference[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
