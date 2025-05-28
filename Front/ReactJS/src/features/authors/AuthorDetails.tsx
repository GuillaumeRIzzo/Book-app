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
import { Author } from '@/models/author/author';

import { Dialog } from '@/components/common/dialog';
import Loading from '@/components/common/Loading';
import { fetchAuthorById } from '@/features/authors/AuthorSlice';
import { decryptPayload } from '@/utils/encryptUtils';

const AuthorDetailsWrapper = styled.div`
  ${tw`mt-20 flex flex-col md:flex-row`}
  gap: 2rem;
`;

const AuthorDetails: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});
  
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const author = useSelector((state: RootState) =>
    state.authors.authors.find((a: Author) => a.authorUuid === id),
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
    if (id && !author) {
      dispatch(fetchAuthorById(id.toString()));
    }
  }, [id, author, dispatch]);
  
  if (!author) {
    return <Loading />;
  }

 const handleEdit = (author: Author) => {
  setSelectedAuthor(author);
    setDialogTitle('Edit Author');
    setDialogContent(`Edit author: ${author.authorFullName}`);
    setDialogAction(() => () => {
      router.push(`/author/${author.authorId}/edit`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (author: Author) => {
    setSelectedAuthor(author);
    setDialogTitle('Delete Author');
    setDialogContent(
      `Are you sure you want to delete author: ${author.authorFullName}?`,
    );
    setDialogAction(() => async () => {
      try {
        // dispatch(deleteAuthorAsync(author.authorId)).unwrap(); // unwrap to catch errors if needed
        router.push('/');
      } catch (error) {
        console.error('Failed to delete author:', error);
        // Optionally show error feedback to the user
      } finally {
        handleCloseDialog();
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAuthor(null);
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
            aria-label='edit author'
            onClick={() => handleEdit(author)}
          >
            <EditIcon />
          </Fab>
          <Fab
            color='warning'
            aria-label='del author'
            onClick={() => handleDelete(author)}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      )}
      
      {selectedAuthor && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
      <AuthorDetailsWrapper>
        <Typography variant='subtitle1' component='p'>
          <strong>Auteur:</strong> {author.authorFullName}
        </Typography>
      </AuthorDetailsWrapper>
    </Container>
  );
};

export default AuthorDetails;
