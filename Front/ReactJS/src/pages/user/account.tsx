import { decryptPayload } from '@/utils/encryptUtils';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const Account: React.FC = () => {
  const { data: session } = useSession();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById('app-header');
    if (!header) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
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
  const cards = [
    {
      title: 'Votre profile',
      description:
        "Modifier l'adresse e-mail, le nom et le numéro de téléphone mobile",
      link: `/user/${uuid}`,
    },
    {
      title: 'Préférences',
      description: 'Modifier vos préférences',
      link: `/user/preferences`,
    },
    {
      title: 'Vos commandes',
      description: 'Historique de vos commandes',
      link: `/user/orders`,
    },
    {
      title: 'Adresses',
      description:
        'Modifier les adresses et les préférences de livraison des commandes',
      link: `/user/address`,
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
      <Typography variant='h1' fontSize={24} component='h1' className='text-primary-dark'>
        Votre compte
      </Typography>
      <Box
        sx={{
          paddingY: '2rem',
          display: 'flex',
          gap: 4,
          alignSelf: 'center',
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            sx={{
              width: '33%',
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderWidth: '1px'
            }}
          >
            <CardActionArea sx={{ height: '100%' }}>
              <Link 
                href={card.link}>
                <CardContent sx={{ display: 'flex', height: '140px' }}>
                  <CardMedia
                    component='img'
                    image='https://m.media-amazon.com/images/G/08/x-locale/cs/help/images/gateway/self-service/order._CB659956101_.png'
                    alt='test order'
                    sx={{
                      height: '50px',
                      width: '50px',
                    }}
                  ></CardMedia>
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
                      variant='body2'
                      sx={{
                        lineBreak: 'auto',
                      }}
                      className='text-secondary'
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Link>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Account;
