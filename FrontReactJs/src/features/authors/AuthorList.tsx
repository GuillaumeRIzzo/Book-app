import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Loading from '@/components/common/Loading';
import store, { RootState } from '@/redux/store';
import { fetchAuthorsAsync } from './AuthorSlice';
import { Dialog } from '@/components/common/dialog';
import { decryptPayload } from '@/utils/encryptUtils';
import { Author } from '@/models/author/Author';

const AuthorList: React.FC = () => {
  const dispatch = useDispatch();
  const authors = useSelector((state: RootState) => state.authors.authors);
  const status = useSelector((state: RootState) => state.authors.status);
  const error = useSelector((state: RootState) => state.authors.error);
  const router = useRouter();

  const { data: session } = useSession();
  let token: string = '';
  let right: string = '';

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
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

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setDialogTitle('Edit Author');
    setDialogContent(`Edit author: ${author.authorName}`);
    setDialogAction(() => () => {
      router.push(`/author/${author.authorId}`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (author: Author) => {
    setSelectedAuthor(author);
    setDialogTitle('Delete Author');
    setDialogContent(`Are you sure you want to delete author: ${author.authorName}?`);
    setDialogAction(() => () => {
      // dispatch(deleteAuthor(author.authorId));
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAuthor(null);
  };

  useEffect(() => {
    if (status === 'idle') {
      store.dispatch(fetchAuthorsAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = authors.map(author => ({
    ...author,
    id: author.authorId,
  }));

  const columns: GridColDef[] = [
    ...(right !== null && (right === "Admin" || right === "Super Admin")
    ? [{ field: 'authorId', headerName: 'ID' }]
    : []),
    { field: 'authorName', headerName: 'Nom', width: 150},
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
            aria-label="edit author"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="delete author"
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
      <DataGrid 
        rows={rows}
        columns={columns}
        // checkboxSelection
        autoHeight
        autosizeOnMount
        density='comfortable'
        hideFooterPagination
      />
      {selectedAuthor && (
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

export default AuthorList;
