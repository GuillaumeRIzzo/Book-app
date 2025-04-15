import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { AppDispatch, RootState } from '@redux/store';
import { Book } from '@/models/book/Book';
import Loading from '@/components/common/Loading';
import { fetchBooksAsync } from './bookSlice';
import { fetchAuthorsAsync } from '../authors/AuthorSlice';
import { fetchPublishersAsync } from '../publishers/PublisherSlice';
import { fetchBookCategoriesAsync } from '../bookCategory/BookCategorySlice';
import { fetchUsersAsync } from '../users/UserSlice';
import { decryptPayload } from '@/utils/encryptUtils';

const BookList: React.FC = () => {
  const books = useSelector((state: RootState) => state.books.books);
  const status = useSelector((state: RootState) => state.books.status);
  const error = useSelector((state: RootState) => state.books.error);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { right } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        const { right: decryptedRight } = decryptPayload(encryptedData, iv);
        return { right: decryptedRight as string };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '', sessionId: '' };
  }, [session]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooksAsync());
      dispatch(fetchAuthorsAsync());
      dispatch(fetchPublishersAsync());
      dispatch(fetchBookCategoriesAsync());
      dispatch(fetchUsersAsync());
    }
  }, [status]);

  if (status === 'loading' || !books) {
    return <Loading />;
  }

  if (status === 'failed') {
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
        {books.map((book: Book) => (
          <Link key={book.bookId} href={`book/${book.bookId}`}>
            <img
              loading='lazy'
              className='h-56 hover:transition-transform 0.2s hover:scale-125 cursor-pointer'
              key={book.bookId}
              src={book.bookImageLink}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default BookList;
