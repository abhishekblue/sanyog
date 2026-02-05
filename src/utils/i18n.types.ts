/**
 * Translator object with common and screen translation functions
 */
export interface ITranslator {
  /** Translate from common.json */
  common: (key: string, params?: Record<string, string | number>) => string;
  /** Translate from translation.json (screen-specific) */
  t: (key: string, params?: Record<string, string | number>) => string;
}
