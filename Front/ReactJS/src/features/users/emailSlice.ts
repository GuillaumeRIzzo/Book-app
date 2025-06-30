import { confirmEmailApi } from '@/api/emailApi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const confirmEmail = createAsyncThunk(
  'users/confirmEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await confirmEmailApi(token);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.message || 'Confirmation failed');
      }
      return rejectWithValue('Erreur inconnue');
    }
  }
);

interface EmailState {
  confirmationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmailState = {
  confirmationStatus: 'idle',
  error: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(confirmEmail.pending, state => {
        state.confirmationStatus = 'loading';
      })
      .addCase(confirmEmail.fulfilled, state => {
        state.confirmationStatus = 'succeeded';
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.confirmationStatus = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default emailSlice.reducer;
