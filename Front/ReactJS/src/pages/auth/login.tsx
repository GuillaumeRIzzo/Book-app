import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

import { saveSessionLocally } from '@api/auth/session';

import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { encryptPayload } from '@/utils/encryptUtils';

import styled from 'twin.macro';
import Link from 'next/link';
import { Alert, AlertColor, Box, Fade, Snackbar, Typography } from '@mui/material';
import { withNoSSR } from '@/components/common/withNoSSR';

const FormWrapper = styled.div`
  p-6 
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const router = useRouter();
  const { error } = router.query;

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (error) {
      setAlertMessage('Invalid credentials. Please try again.');
    }
  }, [error]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setAlertMessage(null);
    setLoading(true);
  
    try {
      const encrypted = encryptPayload({
        Identifier: formData.identifier,
        Password: formData.password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
      });
      
      if (result?.ok) {
        const session = await getSession();
        if (session) {
          saveSessionLocally(session);
          setAlertMessage('Connexion réussi. Vous allez être redirigé.')
          router.push('/');
        }
      }
      console.log(result);
      
      if (result?.error === 'Invalid credentials') {
        setAlertMessage('Login incorrect.');
      } else if (result?.error === 'UserNotFound') {
        setAlertMessage('Utilisateur non trouvé.');
      }
      setAlertSeverity('error');
    } catch (error) {
      console.error('Error during login:', error);
      setAlertMessage('An unexpected error occurred. Please try again later.');
      setAlertSeverity("error"); // ou "error"
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormWrapper>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={8000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
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
          <Typography
            variant='h4'
            component='h1'
            className='mt-10 text-center font-bold leading-9 tracking-tight text-primary-dark'
          >
            Connexion
          </Typography>
        </Box>

        <Box className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSignIn}>
            <Box>
              <Box className='mt-2'>
                <Input
                  label='Login ou E-mail :'
                  type='text'
                  name='identifier'
                  value={formData.identifier}
                  onChange={handleChange}
                  autoFocus={true}
                  required
                />
              </Box>
            </Box>

            <Box>
              <Box className='mt-2'>
                <Input
                  label='Mot de passe'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSignIn(e);
                    }
                  }}
                />
              </Box>
              <Box className='flex items-center justify-between'>
                <Box className='text-sm'>
                  <Link
                    href='/forgot-password'
                    className='font-semibold text-primary hover:text-primary-light'
                  >
                    Mot de pass oublié ?
                  </Link>
                </Box>
              </Box>
            </Box>

            <Box className='mt-4'>
              <CustomButton
                text={loading ? 'Connexion...' : 'Login'}
                type='submit'                
                disabled={loading}
                className='bg-secondary hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </Box>
          </form>
        </Box>
      </Box>
    </FormWrapper>
  );
};

export default withNoSSR(Login);
