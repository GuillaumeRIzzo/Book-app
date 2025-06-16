import { Fragment } from 'react';
import { Box, Typography, Link } from '@mui/material';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/author';
import { Publisher } from '@/models/publisher/publisher';
import { Category } from '@/models/category/Category';

const BookInfoWrapper = styled.div`
  ${tw`w-full md:w-2/3`}
  ${tw`space-y-4`}
`;

type BookInfoProps = {
  book: Book;
  authors: Author;
  publishers: Publisher;
  categories: Category[]
};

const BookInfo: React.FC<BookInfoProps> = ({ book, authors, publishers, categories }) => {
  return (
    <BookInfoWrapper>
      <Typography variant='h4' component='h1' className='text-primary'>
        {book.bookTitle}
      </Typography>
      <Typography variant='subtitle1' component='p' className='text-primary-light'>
        <strong>Auteur:</strong> {authors.authorFullName}
      </Typography>
      <Typography variant='subtitle1' component='p' className='text-primary-light'>
        <strong>Éditeur:</strong> {publishers.publisherName}
      </Typography>
      <Typography variant='body1' component='p' className='text-primary-light'>
        {book.bookDescription}
      </Typography>
      <Box>
        <Typography variant='subtitle1' component='p' className='text-primary-light'>
          <strong>Catégories:</strong>{' '}
          {categories.map((category, index) => (
            <Fragment key={category.categoryId}>
              {index > 0 && ', '}
              <Link href={`/bookcategory/${category.categoryId}`}>
                {category.categoryName}
              </Link>
            </Fragment>
          ))}
        </Typography>
      </Box>
      <Typography variant='subtitle1' component='p' className='text-primary-light'>
        <strong>{book.bookPageCount} pages</strong>
      </Typography>
      <Typography variant='subtitle1' component='p' className='text-primary-light'>
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
