import { Publisher } from './Publisher';

export interface PublisherState {
  publishers: Publisher[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
