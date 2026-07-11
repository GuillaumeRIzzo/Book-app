import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import store from '@redux/store';

import { ThemeProvider } from '@components/context/ThemeContext';
import { ColorProvider } from '@/components/context/ColorContext';
import '@styles/globals.css';
import { Navbar } from '@/components/layout';
<<<<<<< HEAD
import ClientOnly from '@/components/common/ClientOnly'; // 👈 Ajoute ce wrapper
=======
import ClientOnly from '@/components/common/ClientOnly';
import '@/i18n/i18n';
import LanguageProvider from '@/providers/LanguageProvider';
>>>>>>> f571f8d (chore: save current work before project cleanup)

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider>
          <ColorProvider>
<<<<<<< HEAD
            <Navbar />
            <ClientOnly> {/* ✅ Ici tu forces le rendu client uniquement */}
=======
            <ClientOnly> {/*force le rendu client uniquement */}
              <LanguageProvider />
              <Navbar />
>>>>>>> f571f8d (chore: save current work before project cleanup)
              <Component {...pageProps} />
            </ClientOnly>
          </ColorProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};

export default MyApp;
