import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { User } from '@/models/user/User';
import { UserState } from '@/models/user/UserState';
import { getUser, getUsers } from '@/api/userApi';

export const fetchUsersAsync = createAsyncThunk('users/getUsers', async () => {
  const response = await getUsers();
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  'users/getUser',
  async (userId: number) => {
    const response = await getUser(userId);
    return response.data;
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
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
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
      .addCase(fetchUserById.fulfilled, (state, action) => {
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
