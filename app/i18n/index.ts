import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hy from './locales/hy.json';
import ru from './locales/ru.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

export const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  hy: {
    translation: hy,
  },
} as const;

const initializeI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initialLanguage = savedLanguage || 'en';

    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
    });
  }
};

initializeI18n();

export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export const getCurrentLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'en';
  }
};

export default i18n;
