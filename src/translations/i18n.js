import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import es from './es';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next; 