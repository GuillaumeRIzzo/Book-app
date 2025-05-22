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
import { BookCategory } from '@/models/book-category/BookCategory';
import Loading from '@/components/common/Loading';
import { Dialog } from '@/components/common/dialog';
import { fetchBookCategoriesAsync } from './BookCategorySlice';
import { decryptPayload } from '@/utils/encryptUtils';
import Link from 'next/link';

const BookCategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookCategories = useSelector(
    (state: RootState) => state.bookCategories.bookCategories,
  );
  const status = useSelector((state: RootState) => state.bookCategories.status);
  const error = useSelector((state: RootState) => state.bookCategories.error);
  const router = useRouter();
  const { data: session } = useSession();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookCategory, setSelectedBookCategory] =
    useState<BookCategory | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  // Check if the session is available and contains the encrypted session
  const { right, token } = useMemo(() => {
      if (session?.user?.encryptedSession) {
        const { encryptedData, iv } = session.user.encryptedSession;
        try {
          const { right: decryptedRight, token: decryptToken } = decryptPayload(encryptedData, iv);
          return { right: decryptedRight as string, token: decryptToken as string };
        } catch (error) {
          console.error('Failed to decrypt session data:', error);
        }
      }
      return { right: '', sessionId: '' };
    }, [session]);

  const handleEdit = (categorie: BookCategory) => {
    setSelectedBookCategory(categorie);
    setDialogTitle('Edit BookCategory');
    setDialogContent(`Edit categorie: ${categorie.bookCategoName}`);
    setDialogAction(() => () => {
      router.push(`/categorie/${categorie.bookCategoId}`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (categorie: BookCategory) => {
    setSelectedBookCategory(categorie);
    setDialogTitle('Delete BookCategory');
    setDialogContent(
      `Are you sure you want to delete categorie: ${categorie.bookCategoName}?`,
    );
    setDialogAction(() => () => {
      // dispatch(deleteBookCategory(categorie.bookCategoId));
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBookCategory(null);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookCategoriesAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = bookCategories.map(categos => ({
    ...categos,
    id: categos.bookCategoId,
  }));

  const columns: GridColDef[] = [
    ...(right !== null && (right === 'Admin' || right === 'Super Admin')
      ? [{ field: 'bookCategoId', headerName: 'ID' }]
      : []),
    { field: 'bookCategoName', headerName: 'Nom',
          renderCell: (params: any) => (
            <Link
              href={`/bookcategory/${params.row.bookCategoId}`}
              style={{
                color: '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {params.value}
            </Link>
          ), },
    {
      field: 'bookCategoDescription',
      headerName: 'Decription',
      minWidth: 800,
      maxWidth: 1000,
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
                  aria-label='edit category'
                  onClick={() => handleEdit(params.row)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color='secondary'
                  aria-label='delete category'
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
            onClick={() => router.push(`/bookcategory/add`)}
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

      {selectedBookCategory && (
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

export default BookCategoryList;
