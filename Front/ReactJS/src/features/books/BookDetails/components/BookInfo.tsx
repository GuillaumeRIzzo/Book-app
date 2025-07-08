import { Fragment } from 'react';
import { Box, Typography, Link, Chip } from '@mui/material';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useTranslation } from 'react-i18next';

import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/author';
import { Publisher } from '@/models/publisher/publisher';
import { Category } from '@/models/category/Category';
import { Tag } from '@/models/tag/tag';
import i18n from '@/i18n/i18n';

const BookInfoWrapper = styled.div`
  ${tw`w-full md:w-2/3 space-y-4`}
`;

type BookInfoProps = {
  book: Book;
  authors: Author[];
  publishers: Publisher[];
  categories: Category[];
  tags: Tag[];
};

const BookInfo: React.FC<BookInfoProps> = ({ book, authors, publishers, categories, tags }) => {
  const { t } = useTranslation("book");

  return (
    <BookInfoWrapper>
      <Typography variant='h4' component='h1' className='text-primary'>
        {book.bookTitle}
      </Typography>

      {book.bookSubtitle && (
        <Typography variant='subtitle1' className='text-primary'>
          {book.bookSubtitle}
        </Typography>
      )}

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('authors')} :</strong>{' '}
        {authors.map((author, index) => (
          <Fragment key={author.authorId}>
            {index > 0 && ', '}
            <Link href={`/author/${author.authorId}`}>{author.authorFullName}</Link>
          </Fragment>
        ))}
      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('publishers')} :</strong>{' '}
        {publishers.map((pub, index) => (
          <Fragment key={pub.publisherId}>
            {index > 0 && ', '}
            <Link href={`/publisher/${pub.publisherId}`}>{pub.publisherName}</Link>
          </Fragment>
        ))}
      </Typography>

      {book.bookSeriesUuid && (
        <Typography variant='subtitle1' className='text-primary-light'>
          <strong>{t('series')} :</strong>{' '}
          <Link href={`/bookseries/${book.bookSeriesUuid}`}>Voir la série</Link>
        </Typography>
      )}

      <Typography variant='body1' className='text-primary-light'>
        {book.bookDescription}
      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('categories')} :</strong>{' '}
        {categories.map((cat, index) => (
          <Fragment key={cat.categoryId}>
            {index > 0 && ', '}
            <Link href={`/bookcategory/${cat.categoryId}`}>{cat.categoryName}</Link>
          </Fragment>
        ))}
      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('isbn')} :</strong> {book.bookIsbn}
      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('price')} : </strong> 
        {new Intl.NumberFormat(i18n.language, {
          style: 'currency',
          currency: 'EUR',
        }).format(book.bookPrice)}

      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('pages', { count: book.bookPageCount })}</strong>
      </Typography>

      <Typography variant='subtitle1' className='text-primary-light'>
        <strong>{t('publishedOn')} :</strong>{' '}
        {new Intl.DateTimeFormat(i18n.language, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(new Date(book.bookPublishDate))}
      </Typography>

      {tags.length > 0 && (
        <Box>
          <Typography variant='subtitle1' className='text-primary-light' sx={{ mb: 1 }}>
            <strong>{t('tags')} :</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Chip
                key={tag.tagId}
                label={tag.tagLabel}
                component='a'
                href={`/booktag/${tag.tagId}`}
                clickable
                sx={{
                  backgroundColor: 'var(--background-light)',
                  color: 'var(--color-primary-main)',
                  border: '1px solid var(--border)',
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </BookInfoWrapper>
  );
};

export default BookInfo;
