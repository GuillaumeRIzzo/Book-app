import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Loading from './Loading';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) router.push('/'); // Redirect if not authenticated
  }, [session, status, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
