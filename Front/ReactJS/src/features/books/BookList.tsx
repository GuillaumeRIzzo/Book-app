import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { AppDispatch } from '@redux/store';
import { BookModelView } from '@/models/bookViews/BookModelView';
import Loading from '@/components/common/Loading';
import { fetchBooksAsync } from './bookSlice';
import { fetchAuthorsAsync } from '../authors/AuthorSlice';
import { fetchPublishersAsync } from '../publishers/PublisherSlice';
import { fetchCategoriesAsync } from '../categories/categorySlice';
import { fetchUsersAsync } from '../users/UserSlice';
import { fetchImagesAsync } from '../images/imageSlice';
import { decryptPayload } from '@/utils/encryptUtils';
import { selectAllBooks, selectBookError, selectBookStatus } from './bookSelectors';
import { selectBookModelViews } from '../bookViews/bookViewSelectors';
import { selectAuthorStatus } from '../authors/authorSelector';
import { selectCategoriesStatus } from '../categories/categoriesSelector';
import { selectPublisherStatus } from '../publishers/publisherSelector';
import { selectImageStatus } from '../images/imageSelectors';
import { setBookViews } from '../bookViews/bookViewSlice';
import { fetchLanguagesAsync } from '../languages/LanguageSlice';
import { fetchThemesAsync } from '../themes/ThemeSlice';
import { fetchColorsAsync } from '../colors/ColorSlice';
import { fetchUserRightsAsync } from '../userRights/UserRightSlice';
import { selectUserStatus } from '../users/userSelector';
import { selectUserRightStatus } from '../userRights/userRightSelector';
import { selectColorStatus } from '../colors/colorSelector';
import { selectThemeStatus } from '../themes/themeSelector';
import { selectLanguageStatus } from '../languages/languageSelector';
import { selectPreferenceStatus } from '../preferences/preferenceSelector';
import { fetchPreferencesAsync } from '../preferences/PreferenceSlice';

const BookList: React.FC = () => {
  const books = useSelector(selectAllBooks);
  const bookStatus = useSelector(selectBookStatus);
  const error = useSelector(selectBookError);
  const authorStatus = useSelector(selectAuthorStatus);
  const categoryStatus = useSelector(selectCategoriesStatus);
  const publisherStatus = useSelector(selectPublisherStatus);
  const imageStatus = useSelector(selectImageStatus);
  const userStatus = useSelector(selectUserStatus);
  const userRightStatus = useSelector(selectUserRightStatus);
  const languageStatus = useSelector(selectLanguageStatus);
  const themesStatus = useSelector(selectThemeStatus);
  const colorStatus = useSelector(selectColorStatus);
  const preprefrenceStatus = useSelector(selectPreferenceStatus);

  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { right } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        // Explicitly cast the decrypted data to the expected type
        const decryptedData = decryptPayload<{ right: string }>(encryptedData, iv);
        return { right: decryptedData.right };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: ''};
  }, [session]);
  

  useEffect(() => {
    if (bookStatus === 'idle') {
      dispatch(fetchBooksAsync());
      dispatch(fetchImagesAsync());
      dispatch(fetchAuthorsAsync());
      dispatch(fetchPublishersAsync());
      dispatch(fetchCategoriesAsync());
    }
  }, [bookStatus]);

  const modelViews = useSelector(selectBookModelViews);

  useEffect(() => {
  const allSucceeded = [
    bookStatus,
    authorStatus,
    categoryStatus,
    publisherStatus,
    imageStatus,
  ].every(status => status === 'succeeded');

  if (allSucceeded && modelViews.length > 0) {
    dispatch(setBookViews(modelViews));
  }
}, [
  bookStatus,
  authorStatus,
  categoryStatus,
  publisherStatus,
  imageStatus,
  modelViews,
]);

  useEffect(() => {
    if (session) {
      const allSucceeded = [
        userStatus,
        userRightStatus,
        languageStatus,
        themesStatus,
        colorStatus,
        preprefrenceStatus
      ].every(status => status === 'idle');
      
      if (allSucceeded) {
        dispatch(fetchUsersAsync());
        dispatch(fetchUserRightsAsync());
        dispatch(fetchLanguagesAsync());
        dispatch(fetchThemesAsync());
        dispatch(fetchColorsAsync());
        dispatch(fetchPreferencesAsync());
      }
    }
  }, [session, userStatus, userRightStatus, languageStatus, themesStatus, colorStatus]);

  if (bookStatus === 'loading' || !books) {
    return <Loading />;
  }

  if (bookStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {right && (right === 'Admin' || right === 'Super Admin') && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Fab
            color='primary'
            aria-label='add'
            onClick={() => router.push(`/book/add`)}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}
      <div className='flex justify-around my-20 flex-wrap'>
        {modelViews.map((book: BookModelView) => (
          <Link key={book.book.bookId} href={`book/${book.book.bookUuid}`}>
            <img
              loading='lazy'
              className='h-56 hover:transition-transform 0.2s hover:scale-125 cursor-pointer'
              key={book.book.bookUuid}
              src={book.images[0]?.imageUrl}
              alt={book.book.bookTitle}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default BookList;
