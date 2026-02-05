// English
import enCommon from './en/common.json';
import enTranslation from './en/translation.json';

// Hindi
import hiCommon from './hi/common.json';
import hiTranslation from './hi/translation.json';

export type Language = 'en' | 'hi';

export const locales = {
  en: {
    common: enCommon,
    translation: enTranslation,
  },
  hi: {
    common: hiCommon,
    translation: hiTranslation,
  },
};

// Type for the translation keys
export type CommonTranslations = typeof enCommon;
export type ScreenTranslations = typeof enTranslation;
