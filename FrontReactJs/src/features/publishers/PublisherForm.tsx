import { useState } from 'react';
import { Box } from '@mui/material';

import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Publisher } from '@/models/publisher/publisher';
import { addPublisher, updatePublisher } from '@/api/publisherApi';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

interface PublisherProps {
  title: string;
  publisher?: Publisher | undefined;
}

const PublisherForm: React.FC<PublisherProps> = ({ title, publisher }) => {
  const [formData, setFormData] = useState({
    PublisherId: publisher?.publisherId || 0,
    PublisherName: publisher?.publisherName || '',
  });

  const [touched, setTouched] = useState({
    publisherName: false,
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

      if (formData.PublisherId === 0) {
        const result = await addPublisher(encryptedPayload);
      } else {
        const result = await updatePublisher(encryptedPayload);
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
