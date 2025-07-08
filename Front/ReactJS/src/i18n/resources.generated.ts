import ar_ar_AE from './ar/ar-AE.json';
import ar_ar_DZ from './ar/ar-DZ.json';
import ar_ar_EG from './ar/ar-EG.json';
import ar_ar_MA from './ar/ar-MA.json';
import ar_ar_TN from './ar/ar-TN.json';
import ar_index from './ar/index.json';
import fr_account from './fr/account.json';
import fr_auth from './fr/auth.json';
import fr_book from './fr/book.json';
import fr_common from './fr/common.json';
import fr_errors from './fr/errors.json';
import fr_form from './fr/form.json';
import fr_fr_CA from './fr/fr-CA.json';
import fr_index from './fr/index.json';
import fr_navbar from './fr/navbar.json';
import fr_preferences from './fr/preferences.json';
import fr_serach from './fr/serach.json';
import pt_index from './pt/index.json';
import pt_pt_BR from './pt/pt-BR.json';
import pt_pt_PT from './pt/pt-PT.json';

import type { Resource } from 'i18next';

export const resources = {
  "ar": {
    "ar-AE": ar_ar_AE,
    "ar-DZ": ar_ar_DZ,
    "ar-EG": ar_ar_EG,
    "ar-MA": ar_ar_MA,
    "ar-TN": ar_ar_TN,
    "index": ar_index
  },
  "fr": {
    "account": fr_account,
    "auth": fr_auth,
    "book": fr_book,
    "common": fr_common,
    "errors": fr_errors,
    "form": fr_form,
    "fr-CA": fr_fr_CA,
    "index": fr_index,
    "navbar": fr_navbar,
    "preferences": fr_preferences,
    "serach": fr_serach
  },
  "pt": {
    "index": pt_index,
    "pt-BR": pt_pt_BR,
    "pt-PT": pt_pt_PT
  }
} satisfies Resource;

export const supportedLngs = Object.keys(resources);
export const fallbackLng = 'en';
