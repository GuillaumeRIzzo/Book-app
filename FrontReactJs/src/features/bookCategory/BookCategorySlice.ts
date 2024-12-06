import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { BookCategory } from '@/models/book-category/BookCategory';
import { BookCategoryState } from '@/models/book-category/BookCategoryState';
import { getBookCategories } from '@/api/bookcategoryApi';
import { decryptPayload } from '@/utils/encryptUtils';

export const fetchBookCategoriesAsync = createAsyncThunk('bookCategories/getBooks', async () => {
  try {
    const response = await getBookCategories();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let categos: BookCategory[];
    try {
      categos = camelCaseKeys(decryptedData, {deep: true}) as unknown as BookCategory[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    return categos;

  } catch (error) {
    console.error('Failed to fetch BookCategories:', error);
    throw error;
  }
});

const initialState: BookCategoryState = {
  bookCategories: [],
  status: 'idle',
  error: null,
};

const bookCategorySlice = createSlice({
  name: 'bookCategories',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<BookCategory>) => {
      state.bookCategories.push(action.payload);
    },
    setBooks: (state, action: PayloadAction<BookCategory[]>) => {
      state.bookCategories = action.payload;
    },
    setStatus: (state, action: PayloadAction<BookCategoryState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookCategoriesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBookCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookCategories = action.payload;
      })
      .addCase(fetchBookCategoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBook, setBooks, setStatus, setError } = bookCategorySlice.actions;

export default bookCategorySlice.reducer;
