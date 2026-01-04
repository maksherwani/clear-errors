import { NormalizedError, TranslatedError, TranslationOptions } from './types';
/**
 * Translates a normalized error into a user-friendly message
 * Priority: User rules > Built-in rules > AI fallback
 */
export declare function translateError(error: NormalizedError, options?: TranslationOptions): Promise<TranslatedError>;
