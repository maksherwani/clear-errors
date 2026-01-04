# @ahmedsherwani/clearerrors-core

Core translation engine for turning backend API errors into user-friendly frontend messages.

## Installation

```bash
npm install @ahmedsherwani/clearerrors-core
```

## Usage

### Basic Usage

```typescript
import { clearError } from '@ahmedsherwani/clearerrors-core';

const translated = await clearError({
  status: 401,
  error: 'UNAUTHORIZED'
});

// Result:
// {
//   message: "Please sign in to continue",
//   severity: "error",
//   uiHint: "modal",
//   action: "LOGIN"
// }
```

### Normalize Errors

```typescript
import { normalizeError } from '@ahmedsherwani/clearerrors-core';

// Normalize any error format (Axios, Fetch, standard errors)
const normalized = normalizeError(error);
```

### Translate Normalized Errors

```typescript
import { translateError, normalizeError } from '@ahmedsherwani/clearerrors-core';

const normalized = normalizeError(error);
const translated = await translateError(normalized, {
  locale: 'en',
  tone: 'friendly',
  useAI: false,
  aiApiKey: process.env.OPENAI_API_KEY, // Optional
});
```

## Features

- ✅ Error normalization (handles Axios, Fetch, standard errors)
- ✅ Rule-based translation with priority matching
- ✅ AI fallback (OpenAI) for unknown errors
- ✅ Custom rules support
- ✅ TypeScript support
- ✅ Zero dependencies

## API Reference

### `clearError(error, options?)`

Main function to translate any error into a user-friendly message.

**Parameters:**
- `error`: Any error object (Axios error, Fetch error, standard error, etc.)
- `options`: Optional translation options
  - `locale`: Language code (default: 'en')
  - `tone`: Message tone - 'friendly', 'professional', 'casual' (default: 'friendly')
  - `useAI`: Whether to use AI fallback (default: false)
  - `aiApiKey`: OpenAI API key (required if useAI is true)

**Returns:** `Promise<TranslatedError>`

### `normalizeError(error)`

Normalize any error format into a standard shape.

**Parameters:**
- `error`: Any error object

**Returns:** `NormalizedError`

### `translateError(normalizedError, options?)`

Translate a normalized error into a user-friendly message.

**Parameters:**
- `normalizedError`: A normalized error object
- `options`: Translation options (same as `clearError`)

**Returns:** `Promise<TranslatedError>`

## License

MIT

