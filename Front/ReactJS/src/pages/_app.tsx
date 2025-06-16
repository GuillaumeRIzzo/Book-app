import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import store from '@redux/store';

import { ThemeProvider } from '@components/context/ThemeContext';
import '@styles/globals.css';
import { Navbar } from '@/components/layout';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider>
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};


export default MyApp;
