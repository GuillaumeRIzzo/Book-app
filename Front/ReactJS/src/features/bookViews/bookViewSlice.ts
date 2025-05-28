import { createSlice } from '@reduxjs/toolkit';

import { bookModelViewState } from '@/models/bookViews/BookModelViewState';

const initialState: bookModelViewState = {
  bookViews: [],
  status: 'idle',
  error: null,
};

const bookViewSlice = createSlice({
  name: 'bookViews',
  initialState,
  reducers: {
    setBookViews(state, action) {
      state.bookViews = action.payload;
    },
  },
});

export const { setBookViews } = bookViewSlice.actions;

export default bookViewSlice.reducer;
