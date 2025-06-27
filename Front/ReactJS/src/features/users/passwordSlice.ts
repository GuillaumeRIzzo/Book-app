import { forgotPassword, resetPasswordApi } from '@/api/passwordApi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const sendResetPasswordEmail = createAsyncThunk(
  'users/sendResetPasswordEmail',
  async (email: any, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Email send failed');
    }
  }
);

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const resetPassword = createAsyncThunk(
  'users/resetPassword',
  async (payload: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(payload); // this refers to the API method

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Reset failed');
    }
  }
);

interface PasswordState {
  confirmationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PasswordState = {
  confirmationStatus: 'idle',
  error: null,
};

const passwordSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendResetPasswordEmail.pending, state => {
        state.confirmationStatus = 'loading';
      })
      .addCase(sendResetPasswordEmail.fulfilled, state => {
        state.confirmationStatus = 'succeeded';
      })
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.confirmationStatus = 'failed';
        state.error = action.error.message || null;
      })

      .addCase(resetPassword.pending, state => {
        state.confirmationStatus = 'loading';
      })
      .addCase(resetPassword.fulfilled, state => {
        state.confirmationStatus = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.confirmationStatus = 'failed';
        state.error = action.error.message || null;
      })
  },
});

export default passwordSlice.reducer;
