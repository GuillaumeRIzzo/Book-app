import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { Book } from '@/models/book/Book';
import { BookState } from '@/models/book/BookState';
import { getBook, getBooks, addBook, updateBook, delBook } from '@/api/bookApi';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';

export const fetchBooksAsync = createAsyncThunk('books/getBooks', async () => {
  try {
    const response = await getBooks();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let books: Book[];
    try {
      books = camelCaseKeys(decryptedData, { deep: true }) as unknown as Book[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    return books;

  } catch (error) {
    console.error('Failed to fetch books:', error);
    throw error; // Throw error to handle it in UI
  }
});

export const fetchBookById = createAsyncThunk(
  'books/getBook',
  async (bookId: number) => {
    try {
      // Call API to fetch encrypted book data
      const response = await getBook(bookId);

      // Ensure data types for encrypted payload
      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt the data
      const decryptedData = decryptPayload(encryptedData, iv);

      const book = camelCaseKeys(decryptedData, { deep: true }) as unknown as Book;

      return book;
    } catch (error) {
      console.error('Failed to fetch book:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addBook(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

type UpdateBookParams = {
  bookId: number;
  payload: EncryptedPayload;
};

export const updateBookAsync = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, payload }: UpdateBookParams) => {
    try {
      const response = await updateBook(bookId, payload);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete book:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

export const deleteBookAsync = createAsyncThunk(
  'books/deleteBook',
  async (bookId: number) => {
    try {
      await delBook(bookId);
      return bookId;
    } catch (error) {
      console.error('Failed to delete book:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

const initialState: BookState = {
  books: [],
  status: 'idle',
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBookLocal: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    setStatus: (state, action: PayloadAction<BookState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all
      .addCase(fetchBooksAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBooksAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooksAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch one
      .addCase(fetchBookById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books.push(action.payload);
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Create
      .addCase(createBook.pending, state => {
        state.status = 'loading';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Update
      .addCase(updateBookAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateBookAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.books.findIndex(book => book.bookId === action.payload.bookId);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Delete
      .addCase(deleteBookAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteBookAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = state.books.filter(book => book.bookId !== action.payload);
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBookLocal, setBooks, setStatus, setError } = booksSlice.actions;

export default booksSlice.reducer;
