import { Fragment } from 'react';
import { Box, Typography, Link } from '@mui/material';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/author';
import { Publisher } from '@/models/publisher/publisher';

const BookInfoWrapper = styled.div`
  ${tw`w-full md:w-2/3`}
  ${tw`space-y-4`}
`;

type BookInfoProps = {
  book: Book;
  author: Author;
  publisher: Publisher;
};

const BookInfo: React.FC<BookInfoProps> = ({ book, author, publisher }) => {
  return (
    <BookInfoWrapper>
      <Typography variant='h4' component='h1'>
        {book.bookTitle}
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Auteur:</strong> {author.authorFullName}
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Éditeur:</strong> {publisher.publisherName}
      </Typography>
      <Typography variant='body1' component='p'>
        {book.bookDescription}
      </Typography>
      {/* <Box>
        <Typography variant='subtitle1' component='p'>
          <strong>Catégories:</strong>{' '}
          {book.categories.map((category, index) => (
            <Fragment key={category.categoryId}>
              {index > 0 && ', '}
              <Link href={`/bookcategory/${category.categoryId}`}>
                {category.categoryName}
              </Link>
            </Fragment>
          ))}
        </Typography>
      </Box> */}
      <Typography variant='subtitle1' component='p'>
        <strong>{book.bookPageCount} pages</strong>
      </Typography>
      <Typography variant='subtitle1' component='p'>
        <strong>Publié le:</strong>{' '}
        {new Date(book.bookPublishDate).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
    </BookInfoWrapper>
  );
};

export default BookInfo;
