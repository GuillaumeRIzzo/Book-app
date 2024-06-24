import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AuthState } from '@/models/auth/AuthState';

const initialState: AuthState = {
  userLog: {
    token: '',
    right: '',
    id: 0,
    login: '',
    email: ''
  },
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserLog: (state, action: PayloadAction<AuthState['userLog']>) => {
      state.userLog = action.payload;
    },
    setStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    removeUserLog: (state) => {
      state.userLog = initialState.userLog;
    }
  }
});

export const { setUserLog, setStatus, setError, removeUserLog } = authSlice.actions;

export default authSlice.reducer;