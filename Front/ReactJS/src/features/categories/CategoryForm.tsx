import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';

import { AppDispatch, RootState } from '@/redux/store';
import { Category } from '@/models/category/Category';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { createCategory, updateCategoryAsync } from './categorySlice';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface CategoryProps {
  title: string;
}

const CategoryForm: React.FC<CategoryProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const category = useSelector((state: RootState) =>
    state.categories.categories.find((b: Category) => b.categoryId === Number(id)),
  );

  const [formData, setFormData] = useState({
    BookCategoId: category?.categoryId || 0,
    BookCategoName: category?.categoryName || '',
    BookCategoDescription: category?.categoryDescription || '',
  });

  const [touched, setTouched] = useState({
    categoryName: false,
    BookCategoDescription: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload
    event.preventDefault(); 
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.BookCategoId === 0) {
        dispatch(createCategory(encryptedPayload)).unwrap();
        router.push('/Categories');
      } else {
        dispatch(updateCategoryAsync({
          categoryId: formData.BookCategoId,
          payload: encryptedPayload,
        })).unwrap();
        router.push(`/bookcategory/${formData.BookCategoId}`);
      }
    } catch (error: any) {}
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '4rem',
      }}
    >
      <Box
        component='form'
        margin={1}
        display={'flex'}
        flexDirection={'column'}
        onSubmit={handleSubmit}
      >
        <h1 className='text-2xl mb-6 text-center font-semibold'>{title}</h1>
        <Box>
          <Box>
            <Input 
              required 
              label='Nom' 
              name='BookCategoName' 
              value={formData.BookCategoName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.categoryName && !formData.BookCategoName}
              />
            </Box>
          <Box>
            <Input 
              required
              multiline
              rows={8}
              label='Description' 
              name='BookCategoDescription' 
              value={formData.BookCategoDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.BookCategoDescription && !formData.BookCategoDescription}
              />
            </Box>
        </Box>
        <CustomButton
          text='Valider'
          type='submit'
          color='primary'
        ></CustomButton>
      </Box>
    </Box>
  );
};

export default CategoryForm;
