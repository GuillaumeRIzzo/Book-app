import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { Box, Fab, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Loading from '@/components/common/Loading';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPublishersAsync } from './PublisherSlice';
import { Dialog } from '@/components/common/dialog';
import { decryptPayload } from '@/utils/encryptUtils';
import { Publisher } from '@/models/publisher/publisher';
import Link from 'next/link';

const PublisherList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const publishers = useSelector((state: RootState) => state.publishers.publishers);
  const status = useSelector((state: RootState) => state.publishers.status);
  const error = useSelector((state: RootState) => state.publishers.error);
  const router = useRouter();

  const { data: session } = useSession();
  let token: string = '';
  let right: string = '';

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  // Check if the session is available and contains the encrypted session
  if (session && session.user && session.user.encryptedSession) {
    const encryptedSession = session.user.encryptedSession; // Retrieve encrypted session data

    // Extract encrypted data and IV (if needed)
    const { encryptedData, iv } = encryptedSession;

    // Decrypt the session data
    try {
      const decryptedSessionData = decryptPayload(encryptedData, iv);

      // Cast the decrypted session data to the expected structure
      const {
        token: decryptedToken,
        right: decryptedRight,
      } = decryptedSessionData as {
        token: string;
        right: string;
      };

      token = decryptedToken;
      right = decryptedRight;
    } catch (error) {
      console.error('Failed to decrypt session data:', error);
    }
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
    setDialogContent(`Are you sure you want to delete publisher: ${publisher.publisherName}?`);
    setDialogAction(() => () => {
      // dispatch(deletePublisher(publisher.publisherId));
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPublisher(null);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublishersAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = publishers.map(publisher => ({
    ...publisher,
    id: publisher.publisherId,
  }));

  const columns: GridColDef[] = [
    ...(right !== null && (right === "Admin" || right === "Super Admin")
    ? [{ field: 'publisherId', headerName: 'ID' }]
    : []),
    { field: 'publisherName', headerName: 'Nom', width: 150,
      renderCell: (params: any) => (
        <Link
          href={`/publisher/${params.row.publisherId}`}
          style={{
            color: '#1976d2',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {params.value}
        </Link>
      ),},
    ...(right !== null && (right === "Admin" || right === "Super Admin")
    ? [{
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton
            color="primary"
            aria-label="edit publisher"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="delete publisher"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )
    }] : [])
  ];

  
  return (
    <Box>
      {right && (right === 'Admin' || right === 'Super Admin') && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Fab
            color='primary'
            aria-label='add'
            onClick={() => router.push(`/publisher/add`)}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        // checkboxSelection
        autoHeight
        autosizeOnMount
        density='comfortable'
        hideFooterPagination
        hideFooter
        disableRowSelectionOnClick
      />
      {selectedPublisher && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
    </Box>
  );
};

export default PublisherList;
