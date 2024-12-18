import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { Author } from '@/models/author/Author';
import { AuthorState } from '@/models/author/AuthorState';
import { getAuthor, getAuthors } from '@/api/authorApi';
import { decryptPayload } from '@/utils/encryptUtils';

export const fetchAuthorsAsync = createAsyncThunk('authors/getAuthors', async () => {
  try {
    const response = await getAuthors();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let authors: Author[];
    try {
      authors = camelCaseKeys(decryptedData, {deep: true}) as unknown as Author[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    return authors;

  } catch (error) {
    console.error('Failed to fetch books:', error);
    throw error;
  }
});

export const fetchAuthorById = createAsyncThunk(
  'authors/fetchById',
  async (authorId: number) => {
    try {
      // Call API to fetch encrypted book data
      const response = await getAuthor(authorId);

       // Ensure data types for encrypted payload
       const encryptedData = response.data.encryptedData as string;
       const iv = response.data.iv as string;

       // Decrypt the data
       const decryptedData = decryptPayload(encryptedData, iv);
 
      const author = camelCaseKeys(decryptedData, {deep: true}) as unknown as Author;
      return author;
    } catch (error) {
      console.error('Failed to fetch author:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

const initialState: AuthorState = {
  authors: [],
  status: 'idle',
  error: null,
};

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    addAuthor: (state, action: PayloadAction<Author>) => {
      state.authors.push(action.payload);
    },
    setAuthors: (state, action: PayloadAction<Author[]>) => {
      state.authors = action.payload;
    },
    setStatus: (state, action: PayloadAction<AuthorState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuthorsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAuthorsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authors = action.payload;
      })
      .addCase(fetchAuthorsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchAuthorById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authors.push(action.payload);
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addAuthor, setAuthors, setStatus, setError } = authorsSlice.actions;

export default authorsSlice.reducer;
