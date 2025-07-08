import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import store from '@redux/store';

import { ThemeProvider } from '@components/context/ThemeContext';
import { ColorProvider } from '@/components/context/ColorContext';
import '@styles/globals.css';
import { Navbar } from '@/components/layout';
import ClientOnly from '@/components/common/ClientOnly'; // 👈 Ajoute ce wrapper
import '@/i18n/i18n';
import LanguageProvider from '@/providers/LanguageProvider';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider>
          <ColorProvider>
            <ClientOnly> {/* ✅ Ici tu forces le rendu client uniquement */}
              <LanguageProvider />
              <Navbar />
              <Component {...pageProps} />
            </ClientOnly>
          </ColorProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};

export default MyApp;
