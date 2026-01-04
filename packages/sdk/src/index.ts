import { clearError, normalizeError, translateError, TranslatedError, TranslationOptions, NormalizedError } from '@ahmedsherwani/clearerrors-core';

export interface SDKOptions {
  apiKey?: string; // Optional - no API key needed!
  apiUrl?: string;
  locale?: string;
  tone?: 'friendly' | 'professional' | 'casual';
  useAI?: boolean;
}

// Get API URL from environment (works in Node.js) or use default
// In browser environments, bundlers like webpack/Next.js will replace process.env at build time
const DEFAULT_API_URL = (typeof process !== 'undefined' && process.env?.CLEARERRORS_API_URL) 
  ? process.env.CLEARERRORS_API_URL 
  : 'http://localhost:3001';

/**
 * Main SDK function to translate API errors
 * No API key required - completely free!
 */
export async function translateApiError(
  error: any,
  options: SDKOptions = {}
): Promise<TranslatedError> {
  const {
    apiKey,
    apiUrl = DEFAULT_API_URL,
    locale = 'en',
    tone = 'friendly',
    useAI = false,
  } = options;

  // Try API first (no auth required)
  if (apiUrl) {
    try {
      const normalized = normalizeError(error);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Only add auth header if API key is provided (for backwards compatibility)
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${apiUrl}/translate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          error: normalized,
          locale,
          tone,
          useAI,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }

      // If API call fails, fall back to local translation
      console.warn('ClearErrors API call failed, using local translation');
    } catch (apiError) {
      console.warn('ClearErrors API error, using local translation:', apiError);
    }
  }

  // Local translation (no API or API failed)
  return clearError(error, {
    locale,
    tone,
    useAI,
    aiApiKey: useAI ? apiKey : undefined,
  });
}

/**
 * Normalize an error (exposed for convenience)
 */
export { normalizeError };

/**
 * Translate a normalized error (exposed for convenience)
 */
export async function translateNormalizedError(
  error: NormalizedError,
  options: TranslationOptions = {}
): Promise<TranslatedError> {
  return translateError(error, options);
}

// Re-export types
export type { TranslatedError, NormalizedError, TranslationOptions };

/**
 * Axios interceptor helper (optional)
 * No API key required!
 */
export function createAxiosInterceptor(options: SDKOptions = {}) {
  return async (error: any) => {
    const translated = await translateApiError(error, options);
    
    // Attach translated error to the original error
    error.translated = translated;
    
    // You can also throw a custom error with the translated message
    const customError = new Error(translated.message);
    (customError as any).translated = translated;
    (customError as any).original = error;
    
    return Promise.reject(customError);
  };
}

