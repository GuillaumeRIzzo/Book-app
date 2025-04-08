import { useState } from 'react';
import { Box } from '@mui/material';

import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Author } from '@/models/author/author';
import { addAuthor, updateAuthor } from '@/api/authorApi';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface AuthorProps {
  title: string;
  author?: Author | undefined;
}

const AuthorForm: React.FC<AuthorProps> = ({ title, author }) => {
  const [formData, setFormData] = useState({
    AuthorId: author?.authorId || 0,
    AuthorName: author?.authorName || '',
  });

  const [touched, setTouched] = useState({
    authorName: false,
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

      if (formData.AuthorId === 0) {
        const result = await addAuthor(encryptedPayload);
      } else {
        const result = await updateAuthor(encryptedPayload);
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
          width: '25ch',
          display: 'flex',
          flexDirection: 'column',
        }}
        onSubmit={handleSubmit}
      >
        <h1 className='text-2xl mb-6 text-center font-semibold'>{title}</h1>
        <Input 
          required 
          label='Nom' 
          name='AuthorName' 
          value={formData.AuthorName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.authorName && !formData.AuthorName}
          />
        <CustomButton
          text='Valider'
          type='submit'
          color='primary'
        ></CustomButton>
      </Box>
    </Box>
  );
};

export default AuthorForm;
