import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { User } from '@/models/user/user';
import { UserState } from '@/models/user/UserState';
import { getUser, getUsers } from '@/api/userApi';
import { decryptPayload } from '@/utils/encryptUtils';

export const fetchUsersAsync = createAsyncThunk('users/getUsers', async () => {
  try {
    const response = await getUsers();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let users: User[];
    try {
      users = camelCaseKeys(decryptedData, { deep: true }) as unknown as User[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    return users;

  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
});

export const fetchUserById = createAsyncThunk(
  'users/getUser',
  async (userId: number) => {
    try {
      // Call API to fetch encrypted user data
      const response = await getUser(userId);

      // Ensure data types for encrypted payload
      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt the data
      const decryptedData = decryptPayload(encryptedData, iv);

      // Parse decrypted data as an array of User objects
      const user = JSON.parse(decryptedData as unknown as string) as User;
      return user;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setStatus: (state, action: PayloadAction<UserState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserInState: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.userId === action.payload.userId);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addUser, setUsers, updateUserInState, setStatus, setError } = usersSlice.actions;

export default usersSlice.reducer;
