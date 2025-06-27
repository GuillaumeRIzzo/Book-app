import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { sendResetPasswordEmail } from '@/features/users/passwordSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Alert, AlertColor, Box, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'twin.macro';

const FormWrapper = styled.div`
  p-6 
`;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.passwords.confirmationStatus);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    try {
      await dispatch(sendResetPasswordEmail({email: email})).unwrap();
      setAlertMessage('Check your email for the reset link.');
      setAlertSeverity('success');
    } catch (err) {
      setAlertMessage('Failed to send reset link. Try again later.');
      setAlertSeverity('error');
    }
  };

  return (
    <FormWrapper>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={5000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Box className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <Box className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Typography variant='h4' component='h1' className='mt-10 text-center font-bold text-primary-dark'>
            Mot de passe oublié
          </Typography>
        </Box>
        <Box className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit}>
              <Box className='mt-2'>
                <Input
                  label='E-mail'
                  type="email"
                  name='email'
                  placeholder="Votre adress e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  />
                <CustomButton
                  type='submit'
                  className="bg-secondary hover:bg-secondary-light text-primary-contrast px-4 py-2 rounded"
                  disabled={status === 'loading'}
                  text={status === 'loading' ? 'Envoi...' : 'Envoyer lien de réinitialisation'}
                  />
              </Box>
          </form>
        </Box>
      </Box>
    </FormWrapper>
  );
};

export default ForgotPasswordPage;
