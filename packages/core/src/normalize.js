"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeError = normalizeError;
/**
 * Normalizes various error formats into the standard NormalizedError shape
 */
function normalizeError(error) {
    // If already normalized, return as-is
    if (isNormalizedError(error)) {
        return error;
    }
    // Handle Axios errors
    if (error?.response) {
        return {
            code: error.response.data?.code || error.response.data?.error || 'UNKNOWN_ERROR',
            field: error.response.data?.field,
            message: error.response.data?.message,
            status: error.response.status,
            meta: {
                ...error.response.data,
                url: error.config?.url,
                method: error.config?.method,
            },
        };
    }
    // Handle Fetch API errors
    if (error?.status) {
        return {
            code: error.code || error.error || 'HTTP_ERROR',
            message: error.message,
            status: error.status,
            meta: error,
        };
    }
    // Handle standard Error objects
    if (error instanceof Error) {
        return {
            code: error.code || 'ERROR',
            message: error.message,
            meta: {
                name: error.name,
                stack: error.stack,
            },
        };
    }
    // Handle string errors
    if (typeof error === 'string') {
        return {
            code: 'STRING_ERROR',
            message: error,
        };
    }
    // Handle objects with common error patterns
    if (typeof error === 'object' && error !== null) {
        return {
            code: error.code || error.error || error.errorCode || 'UNKNOWN_ERROR',
            field: error.field || error.path,
            message: error.message || error.msg || error.errorMessage,
            status: error.status || error.statusCode,
            meta: error,
        };
    }
    // Fallback
    return {
        code: 'UNKNOWN_ERROR',
        message: String(error),
        meta: { original: error },
    };
}
/**
 * Type guard to check if error is already normalized
 */
function isNormalizedError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        typeof error.code === 'string' &&
        (error.field === undefined || typeof error.field === 'string') &&
        (error.message === undefined || typeof error.message === 'string') &&
        (error.status === undefined || typeof error.status === 'number'));
}
