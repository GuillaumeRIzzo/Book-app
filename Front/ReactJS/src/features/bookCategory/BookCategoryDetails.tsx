import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Box, Container, Fab, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppDispatch, RootState } from '@/redux/store';
import { BookCategory } from '@/models/book-category/BookCategory';

import { Dialog } from '@/components/common/dialog';
import Loading from '@/components/common/Loading';
import { fetchBookCategoryById } from '@/features/bookCategory/BookCategorySlice';
import { decryptPayload } from '@/utils/encryptUtils';

const BookCategoryDetailsWrapper = styled.div`
  ${tw`w-full md:w-2/3`}
  ${tw`space-y-4`}
  ${tw `mt-8`}
`;

const BookCategoryDetails: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookCategory, setSelectedBookCategory] =
    useState<BookCategory | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const bookCategory = useSelector((state: RootState) =>
    state.bookCategories.bookCategories.find(
      (a: BookCategory) => a.bookCategoId === Number(id),
    ),
  );

  const { data: session } = useSession();

  const right = useMemo(() => {
    if (!session?.user?.encryptedSession) return '';

    const { encryptedData, iv } = session.user.encryptedSession;
    try {
      const { right: decryptedRight } = decryptPayload(encryptedData, iv);
      return decryptedRight as string;
    } catch (error) {
      console.error('Failed to decrypt session data:', error);
      return '';
    }
  }, [session]);

  useEffect(() => {
    if (id && !bookCategory) {
      dispatch(fetchBookCategoryById(Number(id)));
    }
  }, [id, bookCategory, dispatch]);

  if (!bookCategory) {
    return <Loading />;
  }

  const handleEdit = (bookCatego: BookCategory) => {
    setSelectedBookCategory(bookCatego);
    setDialogTitle('Edit category');
    setDialogContent(`Edit bookCatego: ${bookCatego.bookCategoName}`);
    setDialogAction(() => () => {
      router.push(`/bookcategory/${bookCatego.bookCategoId}/edit`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (bookCatego: BookCategory) => {
    setSelectedBookCategory(bookCatego);
    setDialogTitle('Delete BookCategory');
    setDialogContent(
      `Are you sure you want to delete bookCatego: ${bookCatego.bookCategoName}?`,
    );
    setDialogAction(() => async () => {
      try {
        // dispatch(deleteBookCategoryAsync(bookCatego.bookCategoId)).unwrap(); // unwrap to catch errors if needed
        router.push('/');
      } catch (error) {
        console.error('Failed to delete bookCatego:', error);
        // Optionally show error feedback to the user
      } finally {
        handleCloseDialog();
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBookCategory(null);
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
            aria-label='edit book category'
            onClick={() => handleEdit(bookCategory)}
          >
            <EditIcon />
          </Fab>
          <Fab
            color='warning'
            aria-label='del book category'
            onClick={() => handleDelete(bookCategory)}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      )}

      {selectedBookCategory && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
      <BookCategoryDetailsWrapper>
        <Typography variant='subtitle1' component='p'>
          <strong>Catégorie:</strong> {bookCategory.bookCategoName}
        </Typography>
        <Typography variant='body1' component='p'>
          {bookCategory.bookCategoDescription}
        </Typography>
      </BookCategoryDetailsWrapper>
    </Container>
  );
};

export default BookCategoryDetails;
