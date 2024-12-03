import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import store, { RootState } from '@redux/store';
import { Book } from '@/models/book/Book';
import { fetchBooksAsync } from '@/features/books/BookSlice';
import { fetchAuthorsAsync } from '../authors/AuthorSlice';
import { fetchPublishersAsync } from '../publishers/PublisherSlice';
import { fetchBookCategoriesAsync } from '../bookCategory/BookCategorySlice';
import { fetchUsersAsync } from '../users/UserSlice';
import Loading from '@/components/common/Loading';

const BookList: React.FC = () => {
  const books = useSelector((state: RootState) => state.books.books);
  const status = useSelector((state: RootState) => state.books.status);
  const error = useSelector((state: RootState) => state.books.error);

useEffect(() => {
  if (status === 'idle') {
    store.dispatch(fetchBooksAsync());
    store.dispatch(fetchAuthorsAsync());
    store.dispatch(fetchPublishersAsync());
    store.dispatch(fetchBookCategoriesAsync());
    store.dispatch(fetchUsersAsync());
  }
}, [status]);

  if (status === 'loading') {
    return (
      <Loading />
    );
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-around my-20 flex-wrap">
      {books.map((book: Book) => (
        <Link key={book.bookId} href={`book/${book.bookId}`}>
          <img
            className="h-56 hover:transition-transform 0.2s hover:scale-125 cursor-pointer"
            key={book.bookId}
            src={book.bookImageLink}
          />
        </Link>
      ))}
    </div>
  );
};

export default BookList;
