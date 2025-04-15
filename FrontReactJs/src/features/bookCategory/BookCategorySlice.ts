import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { addBookCategory, getBookCategories, getBookCategory, updateBookCategory } from '@/api/bookcategoryApi';
import { BookCategory } from '@/models/book-category/BookCategory';
import { BookCategoryState } from '@/models/book-category/BookCategoryState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';

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

export const fetchBookCategoryById = createAsyncThunk(
  'bookCategory/fetchById',
  async (bookCategoId: number) => {
    try {
      // Call API to fetch encrypted author data
      const response = await getBookCategory(bookCategoId);

       // Ensure data types for encrypted payload
       const encryptedData = response.data.encryptedData as string;
       const iv = response.data.iv as string;

       // Decrypt the data
       const decryptedData = decryptPayload(encryptedData, iv);
 
      const author = camelCaseKeys(decryptedData, {deep: true}) as unknown as BookCategory;
      return author;
    } catch (error) {
      console.error('Failed to fetch author:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

export const createBookCategory = createAsyncThunk(
  'bookCategory/createBookCategory',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addBookCategory(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

type UpdateBookCategoryParams = {
  bookCategoId: number;
  payload: EncryptedPayload;
};

export const updateBookCategoryAsync = createAsyncThunk(
  'bookCategory/updateBookCategory',
  async ({ bookCategoId, payload }: UpdateBookCategoryParams) => {
    try {
      await updateBookCategory(bookCategoId, payload);
      
      return { bookCategoId, decrypted: decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error: any) {
      console.error('Failed to update book category:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

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
      // Fetch all
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
      })

      // Fetch one
      .addCase(fetchBookCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookCategories.push(action.payload);
      })
      .addCase(fetchBookCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      
      // Create
      .addCase(createBookCategory.pending, state => {
        state.status = 'loading';
      })
      .addCase(createBookCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookCategories.push(action.payload);
      })
      .addCase(createBookCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      
      // Update
      .addCase(updateBookCategoryAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateBookCategoryAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { bookCategoId, decrypted } = action.payload;
        const index = state.bookCategories.findIndex(bookCategory => bookCategory.bookCategoId === bookCategoId);
        if (index !== -1) {
          state.bookCategories[index] = {
            ...state.bookCategories[index],
            ...decrypted
          };
        }
      })
      .addCase(updateBookCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBook, setBooks, setStatus, setError } = bookCategorySlice.actions;

export default bookCategorySlice.reducer;
