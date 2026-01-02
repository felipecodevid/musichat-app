import { useContext } from 'react';
import { I18nContext } from './I18nProvider';

/**
 * Hook to access translations in components.
 * Returns the translations object (t) and current language.
 */
export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  return context;
}
