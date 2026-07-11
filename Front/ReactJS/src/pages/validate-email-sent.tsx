import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { resendValidationEmail } from '@/api/emailApi';

import EmailResent from '@/assets/email-sent.svg';
import { Box, Typography } from '@mui/material';
import CustomButton from '@/components/common/Button';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import Input from '@/components/common/Input';
import useEmailValidator from '@/hooks/useEmailValidator';

export default function ValidateEmailSentPage() {
  const { t } = useTranslation(['auth', 'notification', 'errors']);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const emailError = useEmailValidator(email);
  const [loading, setLoading] = useState(false);

  const headerHeight = useHeaderHeight();

  const [touched, setTouched] = useState({
    email: false,
  });

  console.log('email', email);
  console.log('emailError', emailError);

  const [apiErrors, setApiErrors] = useState({
    Email: '',
  });

  useEffect(() => {
    setApiErrors({ Email: '' });
  }, [email]);

  console.log('apiErrors', apiErrors);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleResend = async () => {
    setLoading(true);

    try {
      await resendValidationEmail(email);
      setStatus('success');
      setMessage(t('notification:email_resent'));
      localStorage.removeItem('pendingEmailUuid');
    } catch (err: unknown) {
      console.error(err);
      setStatus('error');
      setMessage(t('errors:resend_failed'));
    }
  };

  return (
    <>
      <Head>
        <title>{t('auth:validate_email_title')}</title>
      </Head>
      <Box
        className='flex items-center justify-center px-4 bg-gray-100'
        style={{
          minHeight: `calc(100vh - ${headerHeight}px - 24px)`,
        }}
      >
        <Box
          className='max-w-md w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center space-y-6'
          style={{
            minHeight: `calc(70vh - ${headerHeight}px - 24px)`,
          }}
        >
          <EmailResent
            aria-label='Email Sent'
            style={{ color: 'var(--color-primary-main)' }}
          />
          <Typography
            variant='h5'
            component='h1'
            className='text-2xl font-semibold text-primary-dark'
          >
            {t('auth:check_your_email')}
          </Typography>
          <Typography
            variant='subtitle1'
            component='p'
            className='text-primary text-sm'
          >
            {t('auth:email_validation_message')}
          </Typography>

          <Box component='form' onSubmit={handleResend} className='space-y-4'>
            <Typography className='text-gray-600'>
              {t('errors:notReceived')}
            </Typography>
            <Input
              label={t('form:email')}
              type='email'
              name='email'
              value={email}
              onChange={handleChangeInput}
              onBlur={handleBlur}
              error={touched.email && (emailError || apiErrors.Email) ? true : undefined}
              helperText={touched.email ? emailError || apiErrors.Email : ''}
              required
            />
            <CustomButton
              type='submit'
              text={loading ? t('auth:sending') : t('auth:resend_email')}
              variant='contained'
              color='primary'
              disabled={loading || !!emailError}
            />
          </Box>
          {status !== 'idle' && (
            <Typography
              variant='subtitle1'
              component='p'
              className={`text-sm mt-2 ${
                status === 'success' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message}
            </Typography>
          )}

          <Box className='mt-6 text-xs text-primary-dark'>
            {t('auth:wrong_email')}{' '}
            <CustomButton
              className='underline text-primary'
              text={t('auth:go_back')}
              onClick={() => router.push('/signin')}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
