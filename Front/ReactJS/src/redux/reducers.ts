import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/features/books/bookSlice';
import imagesReducer from '@/features/images/imageSlice';
import userReducer from '@/features/users/UserSlice';
import authorReducer from '@/features/authors/AuthorSlice';
import publisherReducer from '@/features/publishers/PublisherSlice';
import categoryReducer from '@/features/categories/categorySlice';
import BookModelView  from '@/features/bookViews/bookViewSlice';

const rootReducer = combineReducers({
  books: bookReducer,
  images: imagesReducer,
  users: userReducer,
  authors: authorReducer,
  publishers: publisherReducer,
  categories: categoryReducer,
  bookView: BookModelView
});

export default rootReducer;
