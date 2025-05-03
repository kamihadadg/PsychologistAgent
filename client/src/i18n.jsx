import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './translations/en.json';
// import faTranslation from './translations/fa.json';
// import arTranslation from './translations/ar.json';
// import svTranslation from './translations/sv.json';
// import fiTranslation from './translations/fi.json';
// import trTranslation from './translations/tr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      // fa: { translation: faTranslation },
      // ar: { translation: arTranslation },
      // sv: { translation: svTranslation }, 
      // fi: { translation: fiTranslation },
      // tr: { translation: trTranslation }
    },
    // lng: 'en', // For
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 