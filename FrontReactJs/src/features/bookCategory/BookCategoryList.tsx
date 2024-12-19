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
import { fetchBookCategoriesAsync } from './BookCategorySlice';
import { Dialog } from '@/components/common/dialog';
import { decryptPayload } from '@/utils/encryptUtils';
import { BookCategory } from '@/models/book-category/BookCategory';

const BookCategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const bookCategories = useSelector((state: RootState) => state.bookCategories.bookCategories);
  const status = useSelector((state: RootState) => state.bookCategories.status);
  const error = useSelector((state: RootState) => state.bookCategories.error);

  const router = useRouter();

  const { data: session } = useSession();
  let token: string = '';
  let right: string = '';

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookCategory, setSelectedBookCategory] = useState<BookCategory | null>(null);
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
    setDialogContent(`Are you sure you want to delete categorie: ${categorie.bookCategoName}?`);
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
      store.dispatch(fetchBookCategoriesAsync());
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
    ...(right !== null && (right === "Admin" || right === "Super Admin")
    ? [{ field: 'bookCategoId', headerName: 'ID' }]
    : []),
    { field: 'bookCategoName', headerName: 'Nom'},
    { field: 'bookCategoDescription', headerName: 'Decription', width:500},
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
            aria-label="edit category"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="delete category"
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
