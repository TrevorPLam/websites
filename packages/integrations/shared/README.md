# Integration Shared Utilities

Standardized patterns and utilities for integration packages following 2026 best practices.

## Overview

This package provides shared utilities, types, and patterns for all integration packages in the marketing websites monorepo. It implements 2026 security and resilience standards including:

- **OAuth 2.1 with PKCE** authentication
- **Circuit breaker patterns** for resilience
- **Exponential backoff retry logic** with jitter
- **Secure logging** with automatic redaction
- **Unified monitoring** and metrics
- **Type-safe configuration** management

## Features

### 🔐 Authentication Management

- OAuth 2.1 compliance with PKCE support
- Secure API key management (header-based only)
- Automatic token refresh and storage
- CSRF protection with state parameters

### ⚡ Circuit Breaker & Resilience

- Configurable failure thresholds
- Automatic recovery with half-open state
- Exponential backoff with jitter
- Request timeout handling

### 📊 Monitoring & Logging

- Structured logging with sensitive data redaction
- Integration metrics collection
- Health check endpoints
- Performance monitoring

### 🛡️ Security Standards

- 2026 OAuth 2.1 best practices
- Secure header authentication
- Automatic sensitive data redaction
- Audit trail capabilities

## Quick Start

### Basic HTTP Client with Circuit Breaker

```typescript
import { createHttpClient, createApiKeyAuth } from '@repo/integrations-shared';

const httpClient = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    jitterEnabled: true,
  },
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 30000,
  },
});

const response = await httpClient.request({
  url: '/users',
  method: 'GET',
  headers: {
    Authorization: 'Bearer your-token',
  },
});

if (response.success) {
  console.log(response.data);
} else {
  console.error('Request failed:', response.error);
}
```

### OAuth 2.1 with PKCE

```typescript
import { authManager, PKCEManager, createOAuth2Config } from '@repo/integrations-shared';

// Generate PKCE pair
const codeVerifier = PKCEManager.generateCodeVerifier();
const codeChallenge = await PKCEManager.generateCodeChallenge(codeVerifier);

// Create OAuth config
const oauthConfig = createOAuth2Config(
  'your-client-id',
  'your-client-secret',
  'https://your-app.com/callback',
  'https://auth.example.com/oauth/authorize',
  'https://auth.example.com/oauth/token',
  ['read', 'write'],
  true // Use PKCE
);

// Generate authorization URL
const authUrl = authManager.generateAuthUrl(oauthConfig, codeChallenge);

// Exchange code for token
const token = await authManager.exchangeCodeForToken(oauthConfig, authCode, codeVerifier);
```

### Secure Logging

```typescript
import { createLogger } from '@repo/integrations-shared';

const logger = createLogger('my-integration');

// Automatic sensitive data redaction
logger.info('API request completed', {
  apiKey: 'secret-key-123', // Will be redacted
  userId: 'user-123',
  status: 200,
});

// API call logging with security
logger.logApiCall(
  'POST',
  'https://api.example.com/users',
  201,
  250,
  {
    requestId: 'req-123',
  },
  requestData,
  responseData
);
```

### Integration Adapter Pattern

```typescript
import { BaseIntegrationAdapter, createLogger } from '@repo/integrations-shared';

class MyIntegrationAdapter extends BaseIntegrationAdapter {
  constructor() {
    super('my-integration', 'My Integration', '1.0.0');
  }

  protected async onInitialize(config: IntegrationConfig): Promise<void> {
    // Initialize HTTP client, auth, etc.
  }

  async healthCheck(): Promise<IntegrationResult<{ status: string }>> {
    return this.executeOperation(async () => {
      // Health check logic
      return { status: 'healthy' };
    }, 'health-check');
  }

  async createResource(data: any): Promise<IntegrationResult<Resource>> {
    return this.executeOperation(async () => {
      // Business logic with automatic retry and circuit breaker
      const response = await this.httpClient.request({
        url: '/resources',
        method: 'POST',
        body: data,
      });

      return response.data;
    }, 'create-resource');
  }
}
```

## Configuration

### Default Configuration

```typescript
import { DEFAULT_INTEGRATION_CONFIG } from '@repo/integrations-shared';

const config = {
  ...DEFAULT_INTEGRATION_CONFIG,
  timeout: 15000,
  retry: {
    maxAttempts: 5,
    baseDelay: 2000,
    maxDelay: 30000,
    backoffFactor: 2,
    jitterEnabled: true,
  },
  circuitBreaker: {
    failureThreshold: 10,
    resetTimeout: 60000,
    monitoringEnabled: true,
  },
};
```

### Authentication Configuration

#### API Key Authentication

```typescript
import { createApiKeyAuth } from '@repo/integrations-shared';

const authConfig = createApiKeyAuth(
  'your-api-key',
  'X-Api-Key', // Header name
  'Bearer ' // Optional prefix
);
```

#### OAuth 2.1 Configuration

```typescript
import { createOAuth2Config } from '@repo/integrations-shared';

const authConfig = createOAuth2Config(
  'client-id',
  'client-secret',
  'https://app.com/callback',
  'https://auth.example.com/authorize',
  'https://auth.example.com/token',
  ['read', 'write'],
  true // PKCE enabled
);
```

## Security Best Practices

### 1. Header-Based Authentication

Never expose API keys in request bodies or URLs:

```typescript
// ✅ Correct - Header-based
headers: {
  'X-Api-Key': 'your-key'
}

// ❌ Incorrect - In request body
body: {
  api_key: 'your-key' // Security vulnerability
}
```

### 2. OAuth 2.1 with PKCE

Always use PKCE for public clients:

```typescript
// ✅ Correct - PKCE enabled
const oauthConfig = createOAuth2Config(
  clientId,
  clientSecret,
  redirectUri,
  authEndpoint,
  tokenEndpoint,
  scopes,
  true // PKCE required for OAuth 2.1
);
```

### 3. Secure Logging

Use the provided logger that automatically redacts sensitive data:

```typescript
// ✅ Correct - Automatic redaction
logger.info('Request completed', {
  apiKey: 'secret-key', // Automatically redacted
  userId: 'user-123',
});

// ❌ Incorrect - Manual logging
console.log('Request with key:', apiKey); // Security risk
```

## Monitoring

### Metrics Collection

```typescript
import { IntegrationMetrics } from '@repo/integrations-shared';

// Record request metrics
IntegrationMetrics.recordRequest('my-integration', true, 250);

// Get metrics for all integrations
const allMetrics = IntegrationMetrics.getMetrics();

// Get metrics for specific integration
const myMetrics = IntegrationMetrics.getMetrics('my-integration');
```

### Health Checks

```typescript
const healthResult = await adapter.healthCheck();
if (healthResult.success) {
  console.log('Integration health:', healthResult.data.status);
} else {
  console.error('Health check failed:', healthResult.error);
}
```

## Error Handling

### Circuit Breaker States

- **Closed**: Normal operation, requests pass through
- **Open**: All requests fail fast, no requests sent to downstream service
- **Half-Open**: Limited requests allowed to test service recovery

### Retry Logic

- Exponential backoff with jitter prevents thundering herd
- Configurable max attempts and delays
- Smart retry detection (only retryable errors)

### Error Classification

```typescript
// Network errors (retryable)
TimeoutError, NetworkError, ECONNRESET, ETIMEDOUT

// HTTP status codes (retryable)
5xx server errors, 429 rate limit, 408 timeout

// HTTP status codes (non-retryable)
4xx client errors (except 429, 408)
```

## Migration Guide

### From Legacy Integration

1. **Replace manual HTTP calls** with `createHttpClient`
2. **Add circuit breaker configuration** to prevent cascading failures
3. **Use secure logging** instead of console.log
4. **Implement OAuth 2.1** if using OAuth authentication
5. **Add health checks** for monitoring

### Example Migration

**Before:**

```typescript
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

**After:**

```typescript
const httpClient = createHttpClient({
  circuitBreaker: { failureThreshold: 5 },
  retry: { maxAttempts: 3 },
});

const result = await httpClient.request({
  url,
  headers: await authManager.buildHeaders(authConfig, 'my-integration'),
});
```

## Testing

The package includes comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test adapter.test.ts
```

## Contributing

When adding new integration patterns:

1. **Follow 2026 security standards**
2. **Add comprehensive tests**
3. **Update documentation**
4. **Use TypeScript strict mode**
5. **Include error handling examples**

## License

MIT License - see LICENSE file for details.
