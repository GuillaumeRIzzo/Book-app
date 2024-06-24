import { User } from './User';

export interface UserState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
