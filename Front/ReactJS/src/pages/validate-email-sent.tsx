import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const ValidateEmailSent = () => {
  const { t } = useTranslation('auth');

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-background text-center">
      <MailOutlineIcon sx={{ fontSize: 72, color: 'var(--tw-text-primary)' }} />
      
      <Typography variant="h5" className="mt-6 font-semibold text-primary-dark">
        {t('emailValidation.title')}
      </Typography>

      <Typography variant="body1" className="mt-3 text-primary max-w-md">
        {t('emailValidation.sent')}
      </Typography>

      <Link href="/login" passHref>
        <Button
          variant="contained"
          color="primary"
          className="mt-6"
        >
          {t('login')}
        </Button>
      </Link>
    </Box>
  );
};

export default ValidateEmailSent;
