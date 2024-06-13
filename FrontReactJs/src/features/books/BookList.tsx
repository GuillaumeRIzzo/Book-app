import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '@redux/store';
import { Book } from '@/models/book/Book';
import { fetchBooksAsync } from '@/features/books/bookSlice';
import Link from 'next/link';

const BookList: React.FC = () => {
  const dispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.books);
  const status = useSelector((state: RootState) => state.books.status);
  const error = useSelector((state: RootState) => state.books.error);

  useEffect(() => {
    store.dispatch(fetchBooksAsync());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-around my-20">
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
