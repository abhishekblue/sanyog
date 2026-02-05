import { locales, Language } from '../locales';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
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

// Create translation function for a specific language
export function createTranslator(language: Language) {
  const locale = locales[language];

  return {
    // Translate from common.json
    common: (key: string, params?: Record<string, string | number>): string => {
      const text = getNestedValue(locale.common, key);
      return interpolate(text, params);
    },

    // Translate from translation.json
    t: (key: string, params?: Record<string, string | number>): string => {
      const text = getNestedValue(locale.translation, key);
      return interpolate(text, params);
    },
  };
}

// Default English translator (will be replaced by context)
export const defaultTranslator = createTranslator('en');
