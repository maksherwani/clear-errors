# @ahmedsherwani/clearerrors-sdk

Frontend SDK for translating API errors into user-friendly messages. **Completely free - no API keys required!**

## Installation

```bash
npm install @ahmedsherwani/clearerrors-sdk
```

## Quick Start

```typescript
import { translateApiError } from '@ahmedsherwani/clearerrors-sdk';

// In your error handler
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw await response.json();
  }
} catch (error) {
  // Translate the error - no API key needed!
  const translated = await translateApiError(error, {
    locale: 'en',
    tone: 'friendly',
  });

  // Display to user
  showError(translated.message);
}
```

## Features

- ✅ **No API keys required** - completely free!
- ✅ Works with any error format (Axios, Fetch, standard errors)
- ✅ TypeScript support
- ✅ Zero configuration needed
- ✅ Can use local translation or API endpoint
- ✅ Lightweight and fast

## Usage

### Basic Usage

```typescript
import { translateApiError } from '@ahmedsherwani/clearerrors-sdk';

const result = await translateApiError(error, {
  locale: 'en',
  tone: 'friendly',
});
```

### With API Endpoint

By default, the SDK will try to use the API endpoint at `http://localhost:3001`. You can configure this:

```typescript
const result = await translateApiError(error, {
  apiUrl: 'https://api.clearerrors.com',
  locale: 'en',
  tone: 'friendly',
});
```

### With Axios Interceptor

```typescript
import { createAxiosInterceptor } from '@ahmedsherwani/clearerrors-sdk';
import axios from 'axios';

const interceptor = createAxiosInterceptor({
  apiUrl: 'https://api.clearerrors.com',
  locale: 'en',
  tone: 'friendly',
});

axios.interceptors.response.use(undefined, interceptor);
```

## Options

- `apiKey` (optional): API key for usage tracking (not required for free usage)
- `apiUrl` (optional): API endpoint URL (default: `http://localhost:3001`)
- `locale` (optional): Language code (default: 'en')
- `tone` (optional): Message tone - 'friendly', 'professional', 'casual' (default: 'friendly')
- `useAI` (optional): Whether to use AI fallback (default: false)

## API Reference

### `translateApiError(error, options?)`

Main function to translate API errors.

**Parameters:**
- `error`: Any error object
- `options`: SDK options (see above)

**Returns:** `Promise<TranslatedError>`

### `createAxiosInterceptor(options?)`

Create an Axios response interceptor for automatic error translation.

**Parameters:**
- `options`: SDK options

**Returns:** Axios error interceptor function

## Examples

See the [main repository](https://github.com/yourusername/clear-errors) for more examples.

## License

MIT

