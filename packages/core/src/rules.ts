import { ErrorRule, NormalizedError, TranslatedError } from './types';

/**
 * Built-in default rules for common error scenarios
 */
export const DEFAULT_RULES: ErrorRule[] = [
  // Authentication errors
  {
    match: { status: 401 },
    output: {
      message: 'Please sign in to continue',
      severity: 'error',
      uiHint: 'modal',
      action: 'LOGIN',
    },
    priority: 100,
  },
  {
    match: { code: 'UNAUTHORIZED' },
    output: {
      message: 'You don\'t have permission to do this',
      severity: 'error',
      uiHint: 'toast',
    },
    priority: 90,
  },
  {
    match: { code: 'AUTH_REQUIRED' },
    output: {
      message: 'Please sign in to continue',
      severity: 'error',
      uiHint: 'modal',
      action: 'LOGIN',
    },
    priority: 90,
  },

  // Not found errors
  {
    match: { status: 404 },
    output: {
      message: 'This page or resource could not be found',
      severity: 'error',
      uiHint: 'toast',
    },
    priority: 100,
  },
  {
    match: { code: 'NOT_FOUND' },
    output: {
      message: 'The item you\'re looking for doesn\'t exist',
      severity: 'error',
      uiHint: 'toast',
    },
    priority: 90,
  },

  // Validation errors
  {
    match: { code: 'VALIDATION_ERROR' },
    output: {
      message: 'Please check your input and try again',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 80,
  },
  {
    match: { code: 'INVALID_INPUT' },
    output: {
      message: 'Some information is missing or incorrect',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 80,
  },

  // Field-specific validation
  {
    match: { code: 'REQUIRED', field: 'email' },
    output: {
      message: 'Email is required',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 95,
  },
  {
    match: { code: 'REQUIRED', field: 'password' },
    output: {
      message: 'Password is required',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 95,
  },
  {
    match: { code: 'INVALID_EMAIL' },
    output: {
      message: 'Please enter a valid email address',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },
  {
    match: { code: 'WEAK_PASSWORD' },
    output: {
      message: 'Password must be at least 8 characters with letters and numbers',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },

  // Server errors
  {
    match: { status: 500 },
    output: {
      message: 'Something went wrong on our end. Please try again',
      severity: 'error',
      uiHint: 'toast',
      action: 'RETRY',
    },
    priority: 100,
  },
  {
    match: { status: 503 },
    output: {
      message: 'Service temporarily unavailable. Please try again in a moment',
      severity: 'warning',
      uiHint: 'toast',
      action: 'RETRY',
    },
    priority: 100,
  },

  // Rate limiting
  {
    match: { status: 429 },
    output: {
      message: 'Too many requests. Please wait a moment and try again',
      severity: 'warning',
      uiHint: 'toast',
      action: 'RETRY',
    },
    priority: 100,
  },
  {
    match: { code: 'RATE_LIMIT_EXCEEDED' },
    output: {
      message: 'You\'re doing that too quickly. Please slow down',
      severity: 'warning',
      uiHint: 'toast',
    },
    priority: 90,
  },

  // Network errors
  {
    match: { code: 'NETWORK_ERROR' },
    output: {
      message: 'Connection problem. Please check your internet',
      severity: 'error',
      uiHint: 'toast',
      action: 'RETRY',
    },
    priority: 90,
  },
  {
    match: { code: 'TIMEOUT' },
    output: {
      message: 'Request took too long. Please try again',
      severity: 'error',
      uiHint: 'toast',
      action: 'RETRY',
    },
    priority: 90,
  },

  // Business logic errors
  {
    match: { code: 'DUPLICATE_EMAIL' },
    output: {
      message: 'An account with this email already exists',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },
  {
    match: { code: 'INVALID_CREDENTIALS' },
    output: {
      message: 'Email or password is incorrect',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },
  {
    match: { code: 'ACCOUNT_LOCKED' },
    output: {
      message: 'Your account has been temporarily locked. Please contact support',
      severity: 'error',
      uiHint: 'modal',
      action: 'CONTACT_SUPPORT',
    },
    priority: 90,
  },

  // Payment errors
  {
    match: { code: 'PAYMENT_FAILED' },
    output: {
      message: 'Payment could not be processed. Please check your payment method',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },
  {
    match: { code: 'INSUFFICIENT_FUNDS' },
    output: {
      message: 'Insufficient funds. Please use a different payment method',
      severity: 'error',
      uiHint: 'inline',
    },
    priority: 90,
  },
];

/**
 * Matches a normalized error against a rule
 */
export function matchRule(error: NormalizedError, rule: ErrorRule): boolean {
  const { match } = rule;

  // Check code match
  if (match.code !== undefined && error.code !== match.code) {
    return false;
  }

  // Check field match
  if (match.field !== undefined && error.field !== match.field) {
    return false;
  }

  // Check status match
  if (match.status !== undefined && error.status !== match.status) {
    return false;
  }

  return true;
}

/**
 * Finds the best matching rule for an error
 * Returns rules sorted by priority (highest first)
 */
export function findMatchingRule(
  error: NormalizedError,
  rules: ErrorRule[] = DEFAULT_RULES
): ErrorRule | null {
  // Sort rules by priority (higher first), then by specificity
  const sortedRules = [...rules].sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // More specific rules (more match criteria) come first
    const specificityA = Object.keys(a.match).length;
    const specificityB = Object.keys(b.match).length;
    return specificityB - specificityA;
  });

  // Find first matching rule
  for (const rule of sortedRules) {
    if (matchRule(error, rule)) {
      return rule;
    }
  }

  return null;
}

