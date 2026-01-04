/**
 * Example test file - demonstrates core functionality
 * Run with: pnpm test (once test framework is set up)
 */

import { clearError, normalizeError } from '../index';

// Example test cases
const testCases = [
  {
    name: 'Axios 401 Error',
    input: {
      response: {
        status: 401,
        data: { error: 'UNAUTHORIZED' },
      },
    },
  },
  {
    name: 'Validation Error',
    input: {
      error: 'VALIDATION_ERROR',
      field: 'email',
      message: 'Invalid email format',
    },
  },
  {
    name: 'Server Error',
    input: {
      status: 500,
      error: 'INTERNAL_SERVER_ERROR',
    },
  },
];

// Manual test function (can be run directly)
export async function runExamples() {
  console.log('🧪 Testing ClearErrors Core...\n');

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    const normalized = normalizeError(testCase.input);
    console.log('Normalized:', JSON.stringify(normalized, null, 2));
    
    const translated = await clearError(testCase.input);
    console.log('Translated:', JSON.stringify(translated, null, 2));
    console.log('---\n');
  }
}

// Uncomment to run:
// runExamples();

