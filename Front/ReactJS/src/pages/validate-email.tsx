import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';
import axios from 'axios';

const ValidateEmailPage = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { token } = router.query;

  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      const validate = async () => {
        try {
          await axios.post(`/api/UserEmails/confirm?token=${token}`);
          setValidated(true);
        } catch {
          setValidated(false);
        } finally {
          setLoading(false);
        }
      };
      validate();
    }
  }, [token]);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center bg-background">
      {loading ? (
        <>
          <CircularProgress />
          <Typography className="mt-4 text-gray-700">
            {t('emailValidation.redirect')}
          </Typography>
        </>
      ) : validated ? (
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'green' }} />
          <Typography variant="h5" className="mt-6 font-semibold text-primary-dark">
            {t('emailValidation.success')}
          </Typography>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              color="primary"
              className="mt-6"
            >
              {t('auth.login')}
            </Button>
          </Link>
        </>
      ) : (
        <>
          <ErrorOutlineIcon sx={{ fontSize: 72, color: 'red' }} />
          <Typography variant="h5" className="mt-6 font-semibold text-red-600">
            {t('emailValidation.error')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ValidateEmailPage;