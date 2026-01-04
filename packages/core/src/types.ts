/**
 * Normalized Error Shape
 * All backend errors must convert to this shape first.
 */
export type NormalizedError = {
  code: string;
  field?: string;
  message?: string;
  status?: number;
  meta?: Record<string, any>;
};

/**
 * Translation Output
 */
export type TranslatedError = {
  message: string;
  severity: 'error' | 'warning' | 'info';
  uiHint: 'inline' | 'toast' | 'modal';
  action?: 'LOGIN' | 'RETRY' | 'CONTACT_SUPPORT';
};

/**
 * Error Rule Format
 */
export type ErrorRule = {
  id?: string;
  match: {
    code?: string;
    field?: string;
    status?: number;
  };
  output: TranslatedError;
  priority?: number; // Higher priority rules are checked first
};

/**
 * Translation Options
 */
export type TranslationOptions = {
  locale?: string;
  tone?: 'friendly' | 'professional' | 'casual';
  customRules?: ErrorRule[];
  useAI?: boolean;
  aiApiKey?: string;
};

