import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';

import { AppDispatch, RootState } from '@/redux/store';
import { Author } from '@/models/author/author';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { createAuthor, updateAuthorAsync } from './AuthorSlice';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface AuthorProps {
  title: string;
}

const AuthorForm: React.FC<AuthorProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const author = useSelector((state: RootState) =>
    state.authors.authors.find((b: Author) => b.authorUuid === id),
  );

  const [formData, setFormData] = useState({
    AuthorId: author?.authorId || 0,
    AuthorUuid: author?.authorUuid || '',
    AuthorName: author?.authorFullName || '',
  });

  const [touched, setTouched] = useState({
    authorFullName: false,
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
    event.preventDefault(); // Prevent page reload
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.AuthorUuid === '') {
        dispatch(createAuthor(encryptedPayload)).unwrap();
        router.push('/authors');
      } else {
        dispatch(updateAuthorAsync({
          authorUuid: formData.AuthorUuid,
          payload: encryptedPayload,
        })).unwrap();
        router.push(`/author/${formData.AuthorId}`);
      }
    } catch (error: unknown) {}
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
        <Input
          required
          label='Nom'
          name='AuthorName'
          value={formData.AuthorName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.authorFullName && !formData.AuthorName}
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
