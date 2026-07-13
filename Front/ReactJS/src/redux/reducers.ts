import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '@/features/books/bookSlice';
import bookImagesReducer from '@/features/bookImages/bookImageSlice';
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
import EmailReducer from '@/features/users/emailSlice';
import PasswordReducer from '@/features/users/passwordSlice';
import TagsReducer from '@/features/tags/TagSlice';
import GenderReducer from '@/features/genders/GenderSlice';

const rootReducer = combineReducers({
  books: bookReducer,
  bookImages: bookImagesReducer,
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
  emails: EmailReducer,
  passwords: PasswordReducer,
  tags: TagsReducer,
  genders: GenderReducer,
});

export default rootReducer;
