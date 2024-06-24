import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Book } from '@/models/book/Book';
import { BookState } from '@/models/book/BookState';
import { getBook, getBooks } from '@/api/bookApi';

export const fetchBooksAsync = createAsyncThunk('books/getBooks', async () => {
  const response = await getBooks();
  return response.data;
});

export const fetchBookById = createAsyncThunk(
  'books/getBook',
  async (bookId: number) => {
    const response = await getBook(bookId);
    return response.data;
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
