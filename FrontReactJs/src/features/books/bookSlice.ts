import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { Book } from '@/models/book/Book';
import { BookState } from '@/models/book/BookState';
import { getBook, getBooks } from '@/api/bookApi';
import { decryptPayload } from '@/utils/encryptUtils';

export const fetchBooksAsync = createAsyncThunk('books/getBooks', async () => {
  try {
    const response = await getBooks();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let books: Book[];
    try {
      books = camelCaseKeys(decryptedData, {deep: true}) as unknown as Book[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    // console.log('Parsed Books:', books);
    return books;

  } catch (error) {
    console.error('Failed to fetch books:', error);
    throw error;
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
 
      // Parse decrypted data as an array of Book objects
      const book = JSON.parse(decryptedData as unknown as string) as Book;
      return book;
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error; // Throw error to handle it in UI
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
    addBook: (state, action: PayloadAction<Book>) => {
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
      .addCase(fetchBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books.push(action.payload);
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBook, setBooks, setStatus, setError } = booksSlice.actions;

export default booksSlice.reducer;
