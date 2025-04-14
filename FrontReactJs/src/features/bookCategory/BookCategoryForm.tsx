import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';

import { AppDispatch, RootState } from '@/redux/store';
import { BookCategory } from '@/models/book-category/BookCategory';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { createBookCategory, updateBookCategoryAsync } from './BookCategorySlice';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface BookCategoryProps {
  title: string;
}

const BookCategoryForm: React.FC<BookCategoryProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const bookCatego = useSelector((state: RootState) =>
    state.bookCategories.bookCategories.find((b: BookCategory) => b.bookCategoId === Number(id)),
  );

  const [formData, setFormData] = useState({
    BookCategoId: bookCatego?.bookCategoId || 0,
    BookCategoName: bookCatego?.bookCategoName || '',
    BookCategoDescription: bookCatego?.bookCategoDescription || '',
  });

  const [touched, setTouched] = useState({
    bookCategoName: false,
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
        dispatch(createBookCategory(encryptedPayload)).unwrap();
        router.push('/bookCategos');
      } else {
        dispatch(updateBookCategoryAsync({
          bookCategoId: formData.BookCategoId,
          payload: encryptedPayload,
        })).unwrap();

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
              error={touched.bookCategoName && !formData.BookCategoName}
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

export default BookCategoryForm;
