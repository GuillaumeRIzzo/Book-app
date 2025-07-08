import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { resources, supportedLngs, fallbackLng } from './resources.generated';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    supportedLngs,
    detection: {
      order: ['navigator', 'htmlTag', 'localStorage'],
      caches: ['localStorage'],
    },
    ns: ['common', 'navbar', 'search', 'book', 'account', 'preferences', 'auth', 'form', 'errors'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
