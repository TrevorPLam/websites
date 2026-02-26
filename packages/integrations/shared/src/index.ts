/**
 * @file packages/integrations/shared/src/index.ts
 * Task: Standardize 15+ integration packages with consistent patterns
 *
 * Purpose: Main barrel export for shared integration utilities.
 * Provides standardized patterns, authentication, logging, and HTTP client
 * following 2026 best practices.
 *
 * Created: 2026-02-21
 * Standards: OAuth 2.1, circuit breaker, secure logging, unified monitoring
 */

// Types and interfaces
export type {
  IntegrationResult,
  CircuitBreakerState,
  CircuitBreakerConfig,
  RetryConfig,
  AuthConfig,
  ApiKeyAuth,
  OAuth2Config,
  IntegrationConfig,
  StandardAdapter,
  BaseIntegrationAdapter,
} from './types/adapter';

export { DEFAULT_INTEGRATION_CONFIG } from './types/adapter';

// Authentication utilities
export type { TokenStorage, OAuthToken } from './auth/auth-manager';

export {
  PKCEManager,
  AuthManager,
  MemoryTokenStorage,
  authManager,
  createApiKeyAuth,
  createOAuth2Config,
} from './auth/auth-manager';

// HTTP client utilities
export type { HttpClientConfig, RequestOptions, HttpResponse } from './utils/http-client';

export { HttpClient, createHttpClient } from './utils/http-client';

// Logging and monitoring
export type { LogContext, LogEntry } from './utils/logger';

export { IntegrationLogger, IntegrationMetrics, createLogger } from './utils/logger';

// Re-export commonly used utilities
// Note: fetchWithRetry removed as we now use the HTTP client with circuit breaker
// export { fetchWithRetry } from '../email/utils';
