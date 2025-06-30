import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getUser, getUsers, addUser } from '@/api/userApi';
import { User } from '@/models/user/user';
import { UserState } from '@/models/user/UserState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';
// import { mapStrapiUserToUserModel } from '@/utils/mapStrapiUserToUserModel';

export const fetchUsersAsync = createAsyncThunk('users/getUsers', async () => {
  try {
    const response = await getUsers();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let users: User[];
    try {
      users = camelCaseKeys(decryptedData, { deep: true }) as unknown as User[];

      // Use the mapStrapiUserToUserModel to transform each Strapi user
      // users = users.map(user => mapStrapiUserToUserModel(user));
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

interface DecrypteduserData {
  userId: string;
  userUuid: string;
  [key: string]: unknown;
}

export const fetchUserById = createAsyncThunk(
  'users/getUser',
  async (userUuid: string) => {
    try {
      const response = await getUser(userUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecrypteduserData>(encryptedData, iv);

      // Parse decrypted data as a User object
      const user = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        userId: decryptedData.id, // manually set the bookUuid
      } as User;

      // Use the mapStrapiUserToUserModel to map the Strapi user to the local model
      // const mappedUser = mapStrapiUserToUserModel(user);

      return user;
    } catch (error) {
      console.error('Failed to fetch user by ID:', error);
      throw error;
    }
  }
);

export const createUser = createAsyncThunk(
  'publishers/createUser',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addUser(payload);
      return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          return rejectWithValue(axiosError.response.data);
        }
        return rejectWithValue('Erreur inconnue');
      }
  }
);

// Initial state setup
const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserLocal: (state, action: PayloadAction<User>) => {
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

export const { addUserLocal, setUsers, updateUserInState, setStatus, setError } = usersSlice.actions;

export default usersSlice.reducer;
