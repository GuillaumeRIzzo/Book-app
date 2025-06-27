import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getUserRight, getUserRights, addUserRight } from '@/api/userRightApi';
import { UserRight } from '@/models/userRight/userRight';
import { UserRightState } from '@/models/userRight/UserRightState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';

export const fetchUserRightsAsync = createAsyncThunk('userRights/getUserRights', async () => {
  try {
    const response = await getUserRights();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let userRights: UserRight[];
    try {
      userRights = camelCaseKeys(decryptedData, { deep: true }) as unknown as UserRight[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return userRights;
  } catch (error) {
    console.error('Failed to fetch userRights:', error);
    throw error;
  }
});

export const fetchUserRightById = createAsyncThunk(
  'userRights/getUserRight',
  async (userRightUuid: string) => {
    try {
      const response = await getUserRight(userRightUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload(encryptedData, iv);

      // Parse decrypted data as a UserRight object
      const userRight = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        userRightId: (decryptedData as any).id, // manually set the bookUuid
      } as UserRight;

      return userRight;
    } catch (error) {
      console.error('Failed to fetch userRight by ID:', error);
      throw error;
    }
  }
);

export const createUserRight = createAsyncThunk(
  'publishers/createUserRight',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addUserRight(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state setup
const initialState: UserRightState = {
  userRights: [],
  status: 'idle',
  error: null,
};

const userRightsSlice = createSlice({
  name: 'userRight',
  initialState,
  reducers: {
    addUserRightLocal: (state, action: PayloadAction<UserRight>) => {
      state.userRights.push(action.payload);
    },
    setUserRights: (state, action: PayloadAction<UserRight[]>) => {
      state.userRights = action.payload;
    },
    setStatus: (state, action: PayloadAction<UserRightState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserRightInState: (state, action: PayloadAction<UserRight>) => {
      const index = state.userRights.findIndex(u => u.userRightId === action.payload.userRightId);
      if (index !== -1) {
        state.userRights[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserRightsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserRightsAsync.fulfilled, (state, action: PayloadAction<UserRight[]>) => {
        state.status = 'succeeded';
        state.userRights = action.payload;
      })
      .addCase(fetchUserRightsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUserRightById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserRightById.fulfilled, (state, action: PayloadAction<UserRight>) => {
        state.status = 'succeeded';
        state.userRights.push(action.payload);
      })
      .addCase(fetchUserRightById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addUserRightLocal, setUserRights, updateUserRightInState, setStatus, setError } = userRightsSlice.actions;

export default userRightsSlice.reducer;
