import en from './en.json';
import fr from './fr.json';
import es from './es.json';
import pl from './pl.json';
import type { Resource } from 'i18next';

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  pl: { translation: pl },
} satisfies Resource;
