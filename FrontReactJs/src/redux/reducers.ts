import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice';

const rootReducer = combineReducers({
  books: bookReducer,
});

export default rootReducer;
