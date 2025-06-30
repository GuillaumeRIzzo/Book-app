import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { Box, Fab, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppDispatch } from '@/redux/store';
import { Category } from '@/models/category/Category';
import Loading from '@/components/common/Loading';
import { Dialog } from '@/components/common/dialog';
import { fetchCategoriesAsync } from './categorySlice';
import { decryptPayload } from '@/utils/encryptUtils';
import Link from 'next/link';
import {
  selectAllCategories,
  selectCategoriesError,
  selectCategoriesStatus,
} from './categoriesSelector';

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Categories = useSelector(selectAllCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);
  const router = useRouter();
  const { data: session } = useSession();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  // Check if the session is available and contains the encrypted session
  const { right } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        // Explicitly cast the decrypted data to the expected type
        const decryptedData = decryptPayload<{ right: string }>(
          encryptedData,
          iv,
        );
        return { right: decryptedData.right };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '' };
  }, [session]);

  const handleEdit = (categorie: Category) => {
    setSelectedCategory(categorie);
    setDialogTitle('Edit Category');
    setDialogContent(`Edit categorie: ${categorie.categoryName}`);
    setDialogAction(() => () => {
      router.push(`/categorie/${categorie.categoryId}`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (categorie: Category) => {
    setSelectedCategory(categorie);
    setDialogTitle('Delete Category');
    setDialogContent(
      `Are you sure you want to delete categorie: ${categorie.categoryName}?`,
    );
    setDialogAction(() => () => {
      // dispatch(deleteCategory(categorie.categoryId));
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategoriesAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = Categories.map(categos => ({
    ...categos,
    id: categos.categoryId,
  }));

  const columns: GridColDef[] = [
    ...(right !== null && (right === 'Admin' || right === 'Super Admin')
      ? [{ field: 'categoryId', headerName: 'ID' }]
      : []),
    {
      field: 'categoryName',
      headerName: 'Nom',
      renderCell: (params: GridRenderCellParams<Category>) => (
        <Link
          href={`/category/${params.row.categoryId}`}
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
    {
      field: 'categoryDescription',
      headerName: 'Description',
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
            renderCell: (params: GridRenderCellParams<Category>) => (
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
            onClick={() => router.push(`/category/add`)}
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

      {selectedCategory && (
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

export default CategoryList;
