export * from './types';
export * from './normalize';
export * from './rules';
export * from './translate';
/**
 * Main translation function that handles the full pipeline:
 * Raw Error → Normalized Error → Translated Error
 */
import { normalizeError } from './normalize';
import { translateError } from './translate';
import { NormalizedError, TranslatedError, TranslationOptions, ErrorRule } from './types';
export declare function clearError(error: any, options?: TranslationOptions): Promise<TranslatedError>;
export { normalizeError, translateError };
export type { NormalizedError, TranslatedError, TranslationOptions, ErrorRule };
