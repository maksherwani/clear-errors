import { NormalizedError, TranslatedError, TranslationOptions, ErrorRule } from './types';
import { findMatchingRule, DEFAULT_RULES } from './rules';

/**
 * AI fallback prompt template
 */
const AI_PROMPT_TEMPLATE = `You are a frontend UX assistant.

Convert this API error into a user-facing message.

Rules:
- No technical words
- Be polite and clear
- Short sentence
- Suggest an action if relevant

Error:
{{ERROR_JSON}}

Respond ONLY in JSON matching:
{
  "message": string,
  "severity": "error" | "warning" | "info",
  "uiHint": "inline" | "toast" | "modal",
  "action": string (optional)
}`;

/**
 * Translates a normalized error into a user-friendly message
 * Priority: User rules > Built-in rules > AI fallback
 */
export async function translateError(
  error: NormalizedError,
  options: TranslationOptions = {}
): Promise<TranslatedError> {
  const {
    customRules = [],
    useAI = false,
    aiApiKey,
    locale = 'en',
    tone = 'friendly',
  } = options;

  // Combine custom rules with default rules (custom rules have higher priority)
  const allRules = [...customRules, ...DEFAULT_RULES];

  // Try to find a matching rule
  const matchingRule = findMatchingRule(error, allRules);

  if (matchingRule) {
    let output = { ...matchingRule.output };

    // Apply tone adjustments if needed
    if (tone !== 'friendly' && output.message) {
      output.message = adjustTone(output.message, tone);
    }

    return output;
  }

  // AI fallback
  if (useAI && aiApiKey) {
    try {
      const aiResult = await translateWithAI(error, aiApiKey, locale, tone);
      return aiResult;
    } catch (aiError) {
      console.warn('AI translation failed, using fallback:', aiError);
    }
  }

  // Final fallback - generate a basic user-friendly message
  return generateFallbackMessage(error, tone);
}

/**
 * Translates error using AI (OpenAI-compatible API)
 */
async function translateWithAI(
  error: NormalizedError,
  apiKey: string,
  locale: string,
  tone: string
): Promise<TranslatedError> {
  const errorJson = JSON.stringify(error, null, 2);
  const prompt = AI_PROMPT_TEMPLATE.replace('{{ERROR_JSON}}', errorJson);

  // Use OpenAI API (or compatible)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a frontend UX assistant. Generate user-friendly error messages in ${locale} with a ${tone} tone.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);

  return {
    message: content.message,
    severity: content.severity || 'error',
    uiHint: content.uiHint || 'toast',
    action: content.action,
  };
}

/**
 * Adjusts message tone
 */
function adjustTone(message: string, tone: string): string {
  if (tone === 'professional') {
    // Make it more formal
    return message.replace(/don't/g, 'do not').replace(/can't/g, 'cannot');
  } else if (tone === 'casual') {
    // Make it more casual (already friendly by default)
    return message;
  }
  return message;
}

/**
 * Generates a fallback message when no rules match
 */
function generateFallbackMessage(
  error: NormalizedError,
  tone: string
): TranslatedError {
  // Use the error message if available and looks user-friendly
  if (error.message && !isTechnicalMessage(error.message)) {
    return {
      message: error.message,
      severity: getSeverityFromStatus(error.status),
      uiHint: 'toast',
    };
  }

  // Generate based on status code
  if (error.status) {
    const statusMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input',
      401: 'Please sign in to continue',
      403: 'You don\'t have permission to do this',
      404: 'This page could not be found',
      409: 'This action conflicts with existing data',
      422: 'Please check your input and try again',
      429: 'Too many requests. Please wait a moment',
      500: 'Something went wrong. Please try again',
      502: 'Service temporarily unavailable',
      503: 'Service temporarily unavailable',
      504: 'Request took too long. Please try again',
    };

    const message = statusMessages[error.status] || 'An error occurred. Please try again';

    return {
      message,
      severity: getSeverityFromStatus(error.status),
      uiHint: error.status >= 500 ? 'toast' : 'inline',
      action: error.status >= 500 ? 'RETRY' : undefined,
    };
  }

  // Final fallback
  return {
    message: 'Something went wrong. Please try again',
    severity: 'error',
    uiHint: 'toast',
    action: 'RETRY',
  };
}

/**
 * Checks if a message looks technical (should be translated)
 */
function isTechnicalMessage(message: string): boolean {
  const technicalPatterns = [
    /^[A-Z_]+$/,
    /error code/i,
    /exception/i,
    /stack trace/i,
    /undefined/i,
    /null/i,
    /\[object/i,
  ];

  return technicalPatterns.some(pattern => pattern.test(message));
}

/**
 * Gets severity from HTTP status code
 */
function getSeverityFromStatus(status?: number): 'error' | 'warning' | 'info' {
  if (!status) return 'error';

  if (status >= 500) return 'error';
  if (status === 429) return 'warning';
  if (status >= 400) return 'error';
  return 'info';
}

