import { useState } from 'react';
import { Box } from '@mui/material';

import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { BookCategory } from '@/models/book-category/BookCategory';
import { addBookCategory, updateBookCategory } from '@/api/bookcategoryApi';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface BookCategoryProps {
  title: string;
  bookCatego?: BookCategory | undefined;
}

const BookCategoryForm: React.FC<BookCategoryProps> = ({ title, bookCatego }) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
     try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.BookCategoId === 0) {
        const result = await addBookCategory(encryptedPayload);
      } else {
        const result = await updateBookCategory(encryptedPayload);
      }
     }
     catch (error: any) {

     }
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
        sx={{
          m: 1,
        }}
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
