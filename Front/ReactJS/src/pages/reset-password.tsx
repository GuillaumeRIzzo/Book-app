import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import { withNoSSR } from '@/components/common/withNoSSR';
import { resetPassword } from '@/features/users/passwordSlice';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import { AppDispatch, RootState } from '@/redux/store';
import { Alert, AlertColor, Box, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'twin.macro';

const FormWrapper = styled.div`
  p-6 
`;

const ResetPasswordPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.passwords.confirmationStatus,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const passwordErrors = usePasswordValidator(formData.newPassword);
  const confirmPasswordError = useConfirmPasswordValidator(
    formData.newPassword,
    formData.confirmPassword,
  );

  const formValidator: boolean =
    Object.values(passwordErrors).length < 1 && !confirmPasswordError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async () => {
    if (!token || !formData.newPassword) return;

    try {
      await dispatch(
        resetPassword({
          token,
          newPassword: formData.newPassword,
        }),
      ).unwrap();
      setAlertMessage('Mot de passe réinitialisé avec succès');
      setAlertSeverity('success'); // ou "error"
    } catch (err) {
      setAlertMessage('La réinitialisation du mot de passe a échoué. Veuillez réessayer.');
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
          <Typography
            variant='h1'
            className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary-dark'
          >
            Réinitialiser votre mot de passe
          </Typography>
        </Box>
        <Box className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit}>
            <Box>
              <Box className='mt-2'>
                <Input
                  label='Mot de passe :'
                  type='password'
                  name='newPassword'
                  value={formData.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <div className='text-base space-y-1'>
                  <p
                    className={
                      passwordErrors['missingUppercase']
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    Majuscule requise
                  </p>
                  <p
                    className={
                      passwordErrors['missingLowercase']
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    Minuscule requise
                  </p>
                  <p
                    className={
                      passwordErrors['missingNumber']
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    Nombre requis
                  </p>
                  <p
                    className={
                      passwordErrors['missingSpecialChar']
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    Caractère spécial requis
                  </p>
                  <p
                    className={
                      passwordErrors['minLength']
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    Au moins 8 caractères
                  </p>
                </div>
                <Input
                  label='Confirmation mot de passe :'
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword &&
                    confirmPasswordError &&
                    formData.confirmPassword.length > 0
                      ? true
                      : undefined
                  }
                  infoText={
                    touched.confirmPassword &&
                    confirmPasswordError &&
                    formData.confirmPassword.length > 0
                      ? confirmPasswordError
                      : ''
                  }
                  required
                />
                <CustomButton
                  type='submit'
                  className='bg-green-500 text-white px-4 py-2 rounded'
                  disabled={status === 'loading' || !formValidator}
                  text={
                    status === 'loading' ? 'Resetting...' : 'Reset Password'
                  }
                />
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </FormWrapper>
  );
};

export default withNoSSR(ResetPasswordPage);
