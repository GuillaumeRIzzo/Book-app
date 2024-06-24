export interface AuthState {
  userLog: {
    token: string,
    right: string,
    id: number,
    login: string,
    email: string
  };
  status: 'idle' | 'succeeded' | 'failed';
  error: string | null;
}
