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
import { Publisher } from '@/models/publisher/publisher';

import { Dialog } from '@/components/common/dialog';
import Loading from '@/components/common/Loading';
import { fetchPublisherById } from '@/features/publishers/PublisherSlice';
import { decryptPayload } from '@/utils/encryptUtils';

const PublisherDetailsWrapper = styled.div`
  ${tw`mt-20 flex flex-col md:flex-row`}
  gap: 2rem;
`;

const PublisherDetails: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});
  
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const publisher = useSelector((state: RootState) =>
    state.publishers.publishers.find((a: Publisher) => a.publisherId === Number(id)),
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
    if (id && !publisher) {
      dispatch(fetchPublisherById(Number(id)));
    }
  }, [id, publisher, dispatch]);
  
  if (!publisher) {
    return <Loading />;
  }

 const handleEdit = (publisher: Publisher) => {
  setSelectedPublisher(publisher);
    setDialogTitle('Edit Publisher');
    setDialogContent(`Edit publisher: ${publisher.publisherName}`);
    setDialogAction(() => () => {
      router.push(`/publisher/${publisher.publisherId}/edit`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setDialogTitle('Delete Publisher');
    setDialogContent(
      `Are you sure you want to delete publisher: ${publisher.publisherName}?`,
    );
    setDialogAction(() => async () => {
      try {
        // dispatch(deletePublisherAsync(publisher.publisherId)).unwrap(); // unwrap to catch errors if needed
        router.push('/');
      } catch (error) {
        console.error('Failed to delete publisher:', error);
        // Optionally show error feedback to the user
      } finally {
        handleCloseDialog();
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPublisher(null);
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
            aria-label='edit publisher'
            onClick={() => handleEdit(publisher)}
          >
            <EditIcon />
          </Fab>
          <Fab
            color='warning'
            aria-label='del publisher'
            onClick={() => handleDelete(publisher)}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      )}
      
      {selectedPublisher && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
      <PublisherDetailsWrapper>
        <Typography variant='subtitle1' component='p'>
          <strong>Auteur:</strong> {publisher.publisherName}
        </Typography>
      </PublisherDetailsWrapper>
    </Container>
  );
};

export default PublisherDetails;
