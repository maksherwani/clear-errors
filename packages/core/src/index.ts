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

export async function clearError(
  error: any,
  options: TranslationOptions = {}
): Promise<TranslatedError> {
  const normalized = normalizeError(error);
  return translateError(normalized, options);
}

// Re-export for convenience
export { normalizeError, translateError };
export type { NormalizedError, TranslatedError, TranslationOptions, ErrorRule };

