import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/features/books/bookSlice';
import imagesReducer from '@/features/images/imageSlice';
import userReducer from '@/features/users/UserSlice';
import authorReducer from '@/features/authors/AuthorSlice';
import publisherReducer from '@/features/publishers/PublisherSlice';
import categoryReducer from '@/features/categories/categorySlice';
import BookModelView  from '@/features/bookViews/bookViewSlice';
import UserRightsReducer  from '@/features/userRights/UserRightSlice';
import LanguageReducer  from '@/features/languages/LanguageSlice';
import UserModelView from '@features/userViews/userViewSlice';
import PreferenceReducer  from '@/features/preferences/PreferenceSlice';
import ThemeReducer  from '@/features/themes/ThemeSlice';
import ColorReducer from '@/features/colors/ColorSlice';

const rootReducer = combineReducers({
  books: bookReducer,
  images: imagesReducer,
  users: userReducer,
  authors: authorReducer,
  publishers: publisherReducer,
  categories: categoryReducer,
  bookView: BookModelView,
  userRights: UserRightsReducer,
  languages: LanguageReducer,
  userView: UserModelView,
  preferences: PreferenceReducer,
  themes: ThemeReducer,
  colors: ColorReducer,
});

export default rootReducer;
