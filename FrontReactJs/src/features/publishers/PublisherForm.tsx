import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';

import { AppDispatch, RootState } from '@/redux/store';
import { Publisher } from '@/models/publisher/publisher';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { createPublisher, updatePublisherAsync } from './PublisherSlice';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface PublisherProps {
  title: string;
}

const PublisherForm: React.FC<PublisherProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const publisher = useSelector((state: RootState) =>
    state.publishers.publishers.find((b: Publisher) => b.publisherId === Number(id)),
  );

  const [formData, setFormData] = useState({
    PublisherId: publisher?.publisherId || 0,
    PublisherName: publisher?.publisherName || '',
  });

  const [touched, setTouched] = useState({
    publisherName: false,
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

      if (formData.PublisherId === 0) {
        dispatch(createPublisher(encryptedPayload)).unwrap();
        router.push('/publishers');
      } else {
        // const result = await updatePublisher(encryptedPayload);
        dispatch(updatePublisherAsync({
          publisherId: formData.PublisherId,
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
        <Input
          required
          label='Nom'
          name='PublisherName'
          value={formData.PublisherName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.publisherName && !formData.PublisherName}
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

export default PublisherForm;
