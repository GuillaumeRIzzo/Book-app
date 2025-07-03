import { withNoSSR } from '@/components/common/withNoSSR';
import { decryptPayload } from '@/utils/encryptUtils';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  // CardMedia,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ProfileSvg from '@/assets/account/profile.svg';
import PreferencesSvg from '@/assets/account/preferences.svg';
import OrderSvg from '@/assets/account/order.svg';
import AddressSvg from '@/assets/account/address.svg';

const Account: React.FC = () => {
  const { data: session } = useSession();
  const [headerHeight, setHeaderHeight] = useState(0);
  const router = useRouter();
  
  const { t } = useTranslation();

  useEffect(() => {
    const header = document.getElementById('app-header');
    if (!header) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  const { uuid } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        // Explicitly cast the decrypted data to the expected type
        const decryptedData = decryptPayload<{ uuid: string }>(
          encryptedData,
          iv,
        );
        return { uuid: decryptedData.uuid };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { uuid: '' };
  }, [session]);

    useEffect(() => {
      if (!uuid) {
        if (typeof window !== 'undefined') {
            router.replace('/');
          }
      }
    }, [uuid, router]);
    
  const cards = [
  {
    title: t('account.profile.title'),
    description: t('account.profile.description'),
    link: `/user/${uuid}`,
    image: ProfileSvg
  },
  {
    title: t('account.preferences.title'),
    description: t('account.preferences.description'),
    link: `/user/preferences`,
    image: PreferencesSvg
  },
  {
    title: t('account.order.title'),
    description: t('account.order.description'),
    link: `/user/orders`,
    image: OrderSvg
  },
  {
    title: t('account.address.title'),
    description: t('account.address.description'),
    link: `/user/address`,
    image: AddressSvg
  },
];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginX: '18rem',
        padding: '2rem',
      }}
      height={`calc(100vh - ${headerHeight}px - 24px)`}
    >
      <Typography variant='h1' fontSize={24} component='h1' className='text-primary-dark self-center'>
        {t('account.title')}
      </Typography>
      <Box
        sx={{
          paddingY: '2rem',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {cards.map((card, index) => {
        const SvgIcon = card.image;
        return (
          <Card
            key={index}
            sx={{
              width: {
                xs: '100%',
                sm: '48%',
                md: '30%',
              },
              minWidth: '280px',
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderWidth: '1px',
            }}
          >
            <CardActionArea sx={{ height: '100%' }}>
              <Link 
                href={card.link}>
                <CardContent sx={{ display: 'flex', height: '200px' }}>
                  <SvgIcon style={{ height: 150, width: 150, fill: 'var(-color-primary-main)' }} aria-label={card.title} />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '2rem',
                    }}
                  >
                    <Typography variant='h5' component='h2' className='text-primary'>
                      {card.title}
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        lineBreak: 'auto',
                      }}
                      className='text-primary-light'
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
          )
        })}
      </Box>
    </Box>
  );
};

export default withNoSSR(Account);
