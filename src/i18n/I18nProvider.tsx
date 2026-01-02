import React, { createContext, useMemo, type ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import { en, type Translations } from './translations/en';
import { es } from './translations/es';

export type Language = 'en' | 'es';

interface I18nContextValue {
  language: Language;
  t: Translations;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * Detects the device language and returns 'es' for Spanish, 'en' for everything else.
 */
function getDeviceLanguage(): Language {
  try {
    const locales = getLocales();
    if (locales.length > 0) {
      const primaryLocale = locales[0];
      // Check if language code starts with 'es' (covers es, es-MX, es-AR, etc.)
      if (primaryLocale.languageCode?.startsWith('es')) {
        return 'es';
      }
    }
  } catch (error) {
    console.warn('Failed to detect device language:', error);
  }
  return 'en';
}

const translations: Record<Language, Translations> = {
  en,
  es,
};

export function I18nProvider({ children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const language = getDeviceLanguage();
    return {
      language,
      t: translations[language],
    };
  }, []);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
