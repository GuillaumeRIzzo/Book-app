import { Provider } from 'react-redux';
import { AppProps } from 'next/app';

import store from '@redux/store';

import { ThemeProvider } from '@components/context/ThemeContext';
import '@styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default MyApp;
