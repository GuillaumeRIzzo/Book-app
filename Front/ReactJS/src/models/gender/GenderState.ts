import { Gender } from './gender';

export interface GenderState {
  genders: Gender[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
