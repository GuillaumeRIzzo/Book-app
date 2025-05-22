import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/features/books/bookSlice';
import userReducer from '@/features/users/UserSlice';
import authorReducer from '@/features/authors/AuthorSlice';
import publisherReducer from '@/features/publishers/PublisherSlice';
import bookCategoryReducer from '@/features/bookCategory/BookCategorySlice';

const rootReducer = combineReducers({
  books: bookReducer,
  users: userReducer,
  authors: authorReducer,
  publishers: publisherReducer,
  bookCategories: bookCategoryReducer
});

export default rootReducer;
