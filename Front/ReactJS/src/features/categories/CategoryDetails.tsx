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
import { Category } from '@/models/category/Category';

import { Dialog } from '@/components/common/dialog';
import Loading from '@/components/common/Loading';
import { fetchCategoryById } from '@/features/categories/categorySlice';
import { decryptPayload } from '@/utils/encryptUtils';

const CategoryDetailsWrapper = styled.div`
  ${tw`w-full md:w-2/3`}
  ${tw`space-y-4`}
  ${tw `mt-8`}
`;

const CategoryDetails: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const category = useSelector((state: RootState) =>
    state.categories.categories.find(
      (a: Category) => a.categoryId === Number(id),
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
    if (id && !category) {
      dispatch(fetchCategoryById(Number(id)));
    }
  }, [id, category, dispatch]);

  if (!category) {
    return <Loading />;
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogTitle('Edit category');
    setDialogContent(`Edit category: ${category.categoryName}`);
    setDialogAction(() => () => {
      router.push(`/bookcategory/${category.categoryId}/edit`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDialogTitle('Delete Category');
    setDialogContent(
      `Are you sure you want to delete category: ${category.categoryName}?`,
    );
    setDialogAction(() => async () => {
      try {
        // dispatch(deleteCategoryAsync(category.categoryId)).unwrap(); // unwrap to catch errors if needed
        router.push('/');
      } catch (error) {
        console.error('Failed to delete category:', error);
        // Optionally show error feedback to the user
      } finally {
        handleCloseDialog();
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
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
            onClick={() => handleEdit(category)}
          >
            <EditIcon />
          </Fab>
          <Fab
            color='warning'
            aria-label='del book category'
            onClick={() => handleDelete(category)}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      )}

      {selectedCategory && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
      <CategoryDetailsWrapper>
        <Typography variant='subtitle1' component='p'>
          <strong>Catégorie:</strong> {category.categoryName}
        </Typography>
        <Typography variant='body1' component='p'>
          {category.categoryDescription}
        </Typography>
      </CategoryDetailsWrapper>
    </Container>
  );
};

export default CategoryDetails;
