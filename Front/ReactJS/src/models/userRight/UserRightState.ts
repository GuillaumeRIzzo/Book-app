import { UserRight } from './userRight';

export interface UserRightState {
  userRights: UserRight[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
