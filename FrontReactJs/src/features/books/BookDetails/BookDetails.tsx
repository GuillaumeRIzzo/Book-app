import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Container } from '@mui/material';
import store, { RootState } from '@/redux/store';
import { Book } from '@/models/book/Book';
import BookImage from './components/BookImage';
import BookInfo from './components/BookInfo';
import Loading from '@/components/common/Loading';
import { Author } from '@/models/author/Author';
import { Publisher } from '@/models/publisher/Publisher';
import { fetchBookById } from '../BookSlice';
import { fetchAuthorById } from '@/features/authors/AuthorSlice';
import { fetchPublisherById } from '@/features/publishers/PublisherSlice';

const BookDetailsWrapper = styled.div`
  ${tw`mt-20 flex flex-col md:flex-row`}
  gap: 2rem;
`;

const BookDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const book = useSelector((state: RootState) =>
    state.books.books.find((b: Book) => b.bookId === Number(id))
  );

  const author = useSelector((state: RootState) =>
    state.authors.authors.find((a: Author) => a.authorId === book?.authorId)
  );

  const publisher = useSelector((state: RootState) =>
    state.publishers.publishers.find((p: Publisher) => p.publisherId === book?.publisherId)
  );

  useEffect(() => {
    if (!book && id) {
      store.dispatch(fetchBookById(Number(id)));
    } else {
      if (book && !author) {
        store.dispatch(fetchAuthorById(book.authorId));
      }
      if (book && !publisher) {
        store.dispatch(fetchPublisherById(book.publisherId));
      }
    }
  }, [dispatch, id, book, author, publisher]);

  if (!book || !author || !publisher) {
    return <Loading />;
  }

  const publishDate = typeof book.bookPublishDate === 'string'
    ? new Date(book.bookPublishDate)
    : book.bookPublishDate;

  const formattedDate = isNaN(publishDate.getTime())
    ? 'Invalid Date'
    : publishDate.toDateString();

  return (
    <Container maxWidth="xl">
      <BookDetailsWrapper>
        <BookImage src={book.bookImageLink} alt={book.bookTitle} />
        <BookInfo book={book} author={author} publisher={publisher} formattedDate={formattedDate} />
      </BookDetailsWrapper>
    </Container>
  );
};

export default BookDetails;
