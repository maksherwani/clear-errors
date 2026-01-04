# ClearErrors

Turn backend API errors into user-friendly frontend messages.

## 🎯 Product Goal

Build a production-ready tool (web app + npm package) that:
- Translates raw backend errors into clean UI messages
- Standardizes error handling across frontend apps
- Is completely free and open source
- **Core translation is free** - no API keys or authentication required for basic usage

## 🧱 Architecture

```
apps/
 ├─ web/        → marketing + playground
 ├─ api/        → NestJS backend
packages/
 ├─ core/       → error translation engine
 ├─ sdk/        → npm package (frontend)
```

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 🚀 Quick Start

### Install dependencies
```bash
pnpm install
```

### Build packages
```bash
pnpm build
```

### Environment Variables

Create a `.env` file in `apps/api/` (optional for basic usage):

```bash
# JWT Secret for authentication (required for auth features)
JWT_SECRET=your-secret-key-change-in-production

# OpenAI API Key (optional, for AI fallback)
OPENAI_API_KEY=sk-...

# API Port (default: 3001)
PORT=3001

# Frontend URL for CORS (default: http://localhost:3000)
FRONTEND_URL=http://localhost:3000
```

**Note:** The `/translate` endpoint works without any authentication. Environment variables are only needed for:
- User authentication features (register/login)
- AI-powered error translation (requires OpenAI API key)
- Custom rules management

### Run development servers
```bash
# Web app (http://localhost:3000)
pnpm dev:web

# API (http://localhost:3001)
pnpm dev:api
```

### Try the Playground
1. Start the web app: `pnpm dev:web`
2. Navigate to http://localhost:3000/playground
3. Paste an API error JSON and see it translated instantly!

## 📦 Packages

- `@ahmedsherwani/clearerrors-core` - Core translation engine (normalization, rules, AI fallback)
- `@ahmedsherwani/clearerrors-sdk` - Frontend npm package for easy integration
- `apps/web` - Next.js marketing site + interactive playground
- `apps/api` - NestJS backend API with auth, usage tracking, and rules management

## 💡 Usage

### Basic Usage (Core Package)
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

### With SDK (API Integration)
```typescript
import { translateApiError } from '@ahmedsherwani/clearerrors-sdk';

const result = await translateApiError(error, {
  locale: 'en',
  tone: 'friendly',
});
// No API key required - completely free!
```

See package READMEs for more examples:
- [Core Package Examples](./packages/core/README.md)
- [SDK Package Examples](./packages/sdk/README.md)

## 🏗️ Features

✅ Error normalization (handles Axios, Fetch, standard errors)  
✅ Rule-based translation with priority matching  
✅ AI fallback (OpenAI) for unknown errors  
✅ Custom rules support (via API)  
✅ **Free core translation** - no API keys required for basic usage  
✅ User authentication (JWT + API keys)  
✅ Usage tracking  
✅ Subscription management  
✅ API key management (create, rotate, revoke)  
✅ Beautiful playground for testing  
✅ TypeScript support throughout

## 🔌 API Endpoints

### Public Endpoints (No Authentication Required)

- `POST /translate` - Translate any error into a user-friendly message

### Authenticated Endpoints (Require JWT Token)

**Authentication:**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

**Rules Management:**
- `GET /rules` - Get user's custom error translation rules
- `POST /rules` - Create a new rule
- `DELETE /rules/:id` - Delete a rule

**API Keys:**
- `GET /api-keys` - List user's API keys
- `POST /api-keys` - Create a new API key
- `POST /api-keys/:id/rotate` - Rotate an API key
- `DELETE /api-keys/:id` - Revoke an API key

**Usage & Subscription:**
- `GET /usage` - Get usage statistics
- `GET /subscription` - Get subscription status
- `POST /subscription/checkout` - Create checkout session
- `POST /subscription/portal` - Create customer portal session  

## 📋 TODO

- [ ] Add database (PostgreSQL/Prisma) for persistence
- [ ] Add rules management UI
- [ ] Deploy to production

## 📚 Documentation

- [Core Package README](./packages/core/README.md) - Core translation engine documentation
- [SDK Package README](./packages/sdk/README.md) - Frontend SDK documentation

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

