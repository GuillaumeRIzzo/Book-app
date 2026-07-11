import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';
import { confirmEmail } from '@/features/users/emailSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

const ValidateEmailPage = () => {
  const { t } = useTranslation(['auth', 'errors']);
  const router = useRouter();
  const { token } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const headerHeight = useHeaderHeight();

  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      const validate = () => {
        try {
          dispatch(confirmEmail(token.toString()));
          setValidated(true);
        } catch {
          setValidated(false);
        } finally {
          setLoading(false);
        }
      };
      validate();
    }
  }, [token, dispatch]);

  return (
    <Box
      className='flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center bg-background'
      style={{
        minHeight: `calc(100vh - ${headerHeight}px - 24px)`,
      }}
    >
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant='body1' component='p' className='mt-4 text-red-500'>
            {t('errors:invalid_link')}
          </Typography>
        </>
      ) : validated ? (
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'green' }} />
          <Typography
            variant='h5'
            component='h1'
            className='mt-6 font-semibold text-primary-dark'
          >
            {t('emailValidation.success')}
          </Typography>
          <Link href='/login' passHref>
            <Button variant='contained' color='primary' className='mt-6'>
              {t('login')}
            </Button>
          </Link>
        </>
      ) : (
        <>
          <ErrorOutlineIcon sx={{ fontSize: 72, color: 'red' }} />
          <Typography variant='h5' component='h1' className='mt-6 font-semibold text-red-600'>
            {t('emailValidation.error')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ValidateEmailPage;
