// src/providers/LanguageProvider.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@/i18n/i18n';
import { selectPreference } from '@/features/preferences/preferenceSelector';
import { selectAllLanguages } from '@/features/languages/languageSelector';

const LanguageProvider: React.FC = () => {
  const languageUuid = useSelector(selectPreference)?.languageUuid;
  const languages = useSelector(selectAllLanguages);

  useEffect(() => {
    const langCode = languages.find(l => l.languageUuid == languageUuid)?.isoCode;
    i18n.changeLanguage(langCode);
  }, [languageUuid, languages]);

  return null; // Ce composant ne rend rien à l’écran
};

export default LanguageProvider;
