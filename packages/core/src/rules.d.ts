import { ErrorRule, NormalizedError } from './types';
/**
 * Built-in default rules for common error scenarios
 */
export declare const DEFAULT_RULES: ErrorRule[];
/**
 * Matches a normalized error against a rule
 */
export declare function matchRule(error: NormalizedError, rule: ErrorRule): boolean;
/**
 * Finds the best matching rule for an error
 * Returns rules sorted by priority (highest first)
 */
export declare function findMatchingRule(error: NormalizedError, rules?: ErrorRule[]): ErrorRule | null;
