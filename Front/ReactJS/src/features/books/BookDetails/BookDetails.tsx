import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Box, Container, Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppDispatch, RootState } from '@/redux/store';
import { Book } from '@/models/book/Book';
import { Author } from '@/models/author/author';
import { Publisher } from '@/models/publisher/publisher';

import { Dialog } from '@/components/common/dialog';
import BookImage from './components/BookImage';
import BookInfo from './components/BookInfo';
import Loading from '@/components/common/Loading';
import { deleteBookAsync, fetchBookById } from '@/features/books/bookSlice';
import { fetchAuthorById } from '@/features/authors/AuthorSlice';
import { fetchPublisherById } from '@/features/publishers/PublisherSlice';
import { decryptPayload } from '@/utils/encryptUtils';

const BookDetailsWrapper = styled.div`
  ${tw`mt-20 flex flex-col md:flex-row`}
  gap: 2rem;
`;

const BookDetails: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});
  
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const book = useSelector((state: RootState) =>
    state.books.books.find((b: Book) => b.bookId === Number(id)),
  );

  const author = useSelector((state: RootState) =>
    state.authors.authors.find((a: Author) => a.authorId === book?.authorId),
  );

  const publisher = useSelector((state: RootState) =>
    state.publishers.publishers.find(
      (p: Publisher) => p.publisherId === book?.publisherId,
    ),
  );

  const { data: session } = useSession();

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
    return { right: '', sessionId: '' };
  }, [session]);

  useEffect(() => {
    if (id && !book) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [id, book, dispatch]);
  
  useEffect(() => {
    if (book && !author) {
      dispatch(fetchAuthorById(book.authorId));
    }
  }, [book, author, dispatch]);
  
  useEffect(() => {
    if (book && !publisher) {
      dispatch(fetchPublisherById(book.publisherId));
    }
  }, [book, publisher, dispatch]);
  

  if (!book || !author || !publisher) {
    return <Loading />;
  }

 const handleEdit = (book: Book) => {
  setSelectedBook(book);
    setDialogTitle('Edit Book');
    setDialogContent(`Edit book: ${book.bookId}`);
    setDialogAction(() => () => {
      router.push(`/book/${book.bookId}/edit`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setDialogTitle('Delete Book');
    setDialogContent(
      `Are you sure you want to delete book: ${book.bookTitle}?`,
    );
    setDialogAction(() => async () => {
      try {
        dispatch(deleteBookAsync(book.bookId)).unwrap(); // unwrap to catch errors if needed
        router.push('/');
      } catch (error) {
        console.error('Failed to delete book:', error);
        // Optionally show error feedback to the user
      } finally {
        handleCloseDialog();
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };
  return (
    <Container maxWidth='xl'>
      {right && (right === 'Admin' || right === 'Super Admin') && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Fab
            color='primary'
            aria-label='edit book'
            onClick={() => handleEdit(book)}
          >
            <EditIcon />
          </Fab>
          <Fab
            color='warning'
            aria-label='del book'
            onClick={() => handleDelete(book)}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      )}
      
      {selectedBook && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
      <BookDetailsWrapper>
        <BookImage src={book.bookImageLink} alt={book.bookTitle} />
        <BookInfo book={book} author={author} publisher={publisher} />
      </BookDetailsWrapper>
    </Container>
  );
};

export default BookDetails;
