import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { Box, Fab, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppDispatch, RootState } from '@/redux/store';
import { Author } from '@/models/author/author';
import Loading from '@/components/common/Loading';
import { Dialog } from '@/components/common/dialog';
import { fetchAuthorsAsync } from './AuthorSlice';
import { decryptPayload } from '@/utils/encryptUtils';
import Link from 'next/link';

const AuthorList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authors = useSelector((state: RootState) => state.authors.authors);
  const status = useSelector((state: RootState) => state.authors.status);
  const error = useSelector((state: RootState) => state.authors.error);
  const router = useRouter();

  const { data: session } = useSession();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  // Check if the session is available and contains the encrypted session
  const { right, token } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        const { right: decryptedRight, token: decryptToken } = decryptPayload(
          encryptedData,
          iv,
        );
        return {
          right: decryptedRight as string,
          token: decryptToken as string,
        };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '', sessionId: '' };
  }, [session]);

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
      dispatch(fetchAuthorsAsync());
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
    ...(right !== null && (right === 'Admin' || right === 'Super Admin')
      ? [{ field: 'authorId', headerName: 'ID' }]
      : []),
    {
      field: 'authorFullName',
      headerName: 'Nom',
      width: 150,
      minWidth: 150,
      renderCell: (params: any) => (
        <Link
          href={`/author/${params.row.authorId}`}
          style={{
            color: '#1976d2',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {params.value}
        </Link>
      ),
    },
    ...(right !== null && (right === 'Admin' || right === 'Super Admin')
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: any) => (
              <>
                <IconButton
                  color='primary'
                  aria-label='edit author'
                  onClick={() => handleEdit(params.row)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color='secondary'
                  aria-label='delete author'
                  onClick={() => handleDelete(params.row)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]
      : []),
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
            onClick={() => router.push(`/author/add`)}
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
        hideFooter
        hideFooterPagination
        disableRowSelectionOnClick
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
