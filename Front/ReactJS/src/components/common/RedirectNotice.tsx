import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';

interface RedirectNoticeProps {
  delay?: number; // en ms
  target: string;
  message?: string;
}

const RedirectNotice: React.FC<RedirectNoticeProps> = ({ delay = 4000, target, message }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(target);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay, router]);

  return (
    <Typography className="mt-4 text-center text-sm text-gray-600">
      {message}
    </Typography>
  );
};

export default RedirectNotice;