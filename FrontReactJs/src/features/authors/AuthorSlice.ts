import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Author } from '@/models/author/Author';
import { AuthorState } from '@/models/author/AuthorState';
import { getAuthor, getAuthors } from '@/api/authorApi';

export const fetchAuthorsAsync = createAsyncThunk('authors/getAuthors', async () => {
  const response = await getAuthors();
  return response.data;
});

export const fetchAuthorById = createAsyncThunk(
  'authors/fetchById',
  async (authorId: number) => {
    const response = await getAuthor(authorId);
    return response.data;
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
