import { Language, locales } from '../locales';

import { ITranslator } from './i18n.types';

/**
 * Get nested value from object using dot notation
 * @param obj - The object to traverse
 * @param path - Dot-separated path (e.g., "buttons.save")
 * @returns The value at path, or the path itself if not found
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if not found
    }
  }

  return typeof result === 'string' ? result : path;
}

// Replace template variables like {{name}} with values
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;

  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() ?? `{{${key}}}`;
  });
}

/**
 * Create translation function for a specific language
 * @param language - The language code ('en' or 'hi')
 * @returns Translator object with common and t functions
 */
export function createTranslator(language: Language): ITranslator {
  const locale = locales[language];

  return {
    common: (key: string, params?: Record<string, string | number>): string => {
      const text = getNestedValue(locale.common, key);
      return interpolate(text, params);
    },

    t: (key: string, params?: Record<string, string | number>): string => {
      const text = getNestedValue(locale.translation, key);
      return interpolate(text, params);
    },
  };
}

// Default English translator (will be replaced by context)
export const defaultTranslator = createTranslator('en');
