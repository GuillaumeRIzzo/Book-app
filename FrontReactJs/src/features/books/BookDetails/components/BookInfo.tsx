import { Fragment } from 'react';
import { Box, Typography, Link } from '@mui/material';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/Author';
import { Publisher } from '@/models/publisher/Publisher';

const BookInfoWrapper = styled.div`
  ${tw`w-full md:w-2/3`}
  ${tw`space-y-4`}
`;

type BookInfoProps = {
  book: Book;
  author: Author;
  publisher: Publisher;
  formattedDate: string;
};

const BookInfo: React.FC<BookInfoProps> = ({ book, author, publisher, formattedDate }) => {
  return (
    <BookInfoWrapper>
      <Typography variant='h4' component='h1'>
        {book.bookTitle}
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Auteur:</strong> {author.authorName}
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Éditeur:</strong> {publisher.publisherName}
      </Typography>
        <Typography variant='body1' component='p'>
          {book.bookDescription}
        </Typography>
      <Box>
        <Typography variant='subtitle1' component='p'>
          <strong>Catégories:</strong>{' '}
          {book.categories.map((category, index) => (
            <Fragment key={category.bookCategoId}>
              {index > 0 && ', '}
              <Link href={`/category/${category.bookCategoId}`}>
                {category.bookCategoName}
              </Link>
            </Fragment>
          ))}
        </Typography>
      </Box>
      <Typography variant='subtitle1' component='p'>
        <strong>{book.bookPageCount} pages</strong>
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Publié le:</strong> {formattedDate}
      </Typography>
    </BookInfoWrapper>
  );
};

export default BookInfo;
