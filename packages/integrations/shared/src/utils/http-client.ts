/**
 * @file packages/integrations/shared/src/utils/http-client.ts
 * Task: Implement circuit breakers for all third-party integrations
 *
 * Purpose: Provides HTTP client with built-in circuit breaker, retry logic,
 * and monitoring following 2026 resilience patterns.
 *
 * Created: 2026-02-21
 * Standards: Circuit breaker patterns, exponential backoff, timeout handling
 */

import type { CircuitBreakerConfig, RetryConfig, IntegrationResult } from '../types/adapter';
import { createLogger, IntegrationMetrics } from './logger';

const logger = createLogger('http-client');

export interface HttpClientConfig {
  baseURL?: string;
  timeout: number;
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: Partial<RetryConfig>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Enhanced HTTP client with circuit breaker and retry logic
 * Following 2026 resilience patterns for microservice communication
 */
export class HttpClient {
  private circuitBreakerState: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private requestCount = 0;
  private successCount = 0;

  constructor(private readonly config: HttpClientConfig) {}

  /**
   * Execute HTTP request with circuit breaker and retry logic
   */
  async request<T = unknown>(options: RequestOptions): Promise<IntegrationResult<HttpResponse<T>>> {
    const startTime = Date.now();
    this.requestCount++;

    try {
      // Check circuit breaker state
      const circuitBreakerCheck = this.checkCircuitBreaker();
      if (!circuitBreakerCheck.success) {
        return circuitBreakerCheck;
      }

      // Execute request with retry logic
      const result = await this.executeWithRetry<T>(options);

      // Update metrics on success
      const duration = Date.now() - startTime;
      this.successCount++;
      this.resetCircuitBreaker();

      IntegrationMetrics.recordRequest('http-client', true, duration);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // Update metrics on failure
      const duration = Date.now() - startTime;
      this.updateCircuitBreaker();

      IntegrationMetrics.recordRequest('http-client', false, duration);

      const errorMessage = error instanceof Error ? error.message : String(error);
      const retryable = this.isRetryableError(error);

      logger.error(
        'HTTP request failed',
        error instanceof Error ? error : new Error(errorMessage),
        {
          method: options.method || 'GET',
          url: options.url,
          status: (error as any).status,
          duration,
          retryable,
        }
      );

      return {
        success: false,
        error: errorMessage,
        code: this.getErrorCode(error),
        retryable,
      };
    }
  }

  /**
   * Execute HTTP request with retry logic
   */
  private async executeWithRetry<T>(options: RequestOptions): Promise<HttpResponse<T>> {
    const retryConfig = { ...this.config.retry, ...options.retries };
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        return await this.executeRequest<T>(options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === retryConfig.maxAttempts || !this.isRetryableError(error)) {
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateDelay(retryConfig, attempt);

        logger.debug(`Retrying HTTP request (attempt ${attempt}/${retryConfig.maxAttempts})`, {
          method: options.method || 'GET',
          url: options.url,
          delay,
          error: lastError.message,
        });

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Execute single HTTP request
   */
  private async executeRequest<T>(options: RequestOptions): Promise<HttpResponse<T>> {
    const { url = '', method = 'GET', headers = {}, body, timeout = this.config.timeout } = options;

    const fullUrl = this.buildUrl(url);
    const requestHeaders = { ...this.config.defaultHeaders, ...headers };

    // Log request start
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    logger.debug('HTTP request started', {
      requestId,
      method,
      url: fullUrl,
      hasBody: !!body,
      timeout,
    });

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T;
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as T;
      } else {
        data = (await response.blob()) as T;
      }

      // Check for HTTP errors
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      const duration = Date.now() - startTime;
      const httpResponse: HttpResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      };

      // Log successful response
      logger.logApiCall(method, fullUrl, response.status, duration, {
        requestId,
        success: true,
      });

      return httpResponse;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log failed response
      logger.logApiCall(method, fullUrl, (error as any).status, duration, {
        requestId,
        success: false,
        error: (error as any).name,
      });

      throw error;
    }
  }

  /**
   * Build full URL from base URL and path
   */
  private buildUrl(path: string): string {
    if (!this.config.baseURL) {
      return path;
    }

    const baseURL = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseURL}${normalizedPath}`;
  }

  /**
   * Parse Headers object into plain record
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Check circuit breaker state
   */
  private checkCircuitBreaker(): IntegrationResult<never> {
    if (this.circuitBreakerState === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.circuitBreaker.resetTimeout) {
        this.circuitBreakerState = 'half-open';
        logger.info('Circuit breaker transitioning to half-open');
      } else {
        return {
          success: false,
          error: 'Circuit breaker is open',
          code: 'CIRCUIT_BREAKER_OPEN',
          retryable: true,
        };
      }
    }

    return { success: true, data: undefined as never };
  }

  /**
   * Update circuit breaker on failure
   */
  private updateCircuitBreaker(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.circuitBreaker.failureThreshold) {
      this.circuitBreakerState = 'open';
      logger.warn('Circuit breaker opened', {
        failureCount: this.failureCount,
        threshold: this.config.circuitBreaker.failureThreshold,
      });
    }
  }

  /**
   * Reset circuit breaker on success
   */
  private resetCircuitBreaker(): void {
    if (this.circuitBreakerState === 'half-open') {
      this.circuitBreakerState = 'closed';
      this.failureCount = 0;
      logger.info('Circuit breaker reset to closed');
    }
  }

  /**
   * Calculate retry delay with exponential backoff and jitter
   */
  private calculateDelay(config: RetryConfig, attempt: number): number {
    const baseDelay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
    const cappedDelay = Math.min(baseDelay, config.maxDelay);

    if (config.jitterEnabled) {
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * cappedDelay * 0.1;
      return cappedDelay + jitter;
    }

    return cappedDelay;
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Network errors and timeouts are retryable
      if (
        error.name === 'TimeoutError' ||
        error.name === 'AbortError' ||
        error.message.includes('timeout') ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('ENOTFOUND')
      ) {
        return true;
      }

      // HTTP status codes that are retryable
      if ('status' in error) {
        const status = Number((error as any).status);
        return status >= 500 || status === 429 || status === 408;
      }
    }

    return false;
  }

  /**
   * Get error code for classification
   */
  private getErrorCode(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') return 'TIMEOUT';
      if (error.message.includes('ECONNRESET')) return 'CONNECTION_RESET';
      if (error.message.includes('ENOTFOUND')) return 'DNS_ERROR';
      if ('status' in error) return `HTTP_${(error as any).status}`;
    }
    return 'UNKNOWN_ERROR';
  }

  /**
   * Sleep helper for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get circuit breaker state for monitoring
   */
  getCircuitBreakerState(): 'closed' | 'open' | 'half-open' {
    return this.circuitBreakerState;
  }

  /**
   * Get HTTP client metrics
   */
  getMetrics(): {
    requestCount: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    circuitBreakerState: string;
  } {
    const successRate = this.requestCount > 0 ? this.successCount / this.requestCount : 0;
    const failureCount = this.requestCount - this.successCount;

    return {
      requestCount: this.requestCount,
      successCount: this.successCount,
      failureCount,
      successRate: Math.round(successRate * 100) / 100,
      circuitBreakerState: this.circuitBreakerState,
    };
  }

  /**
   * Reset all metrics (useful for testing)
   */
  resetMetrics(): void {
    this.requestCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.circuitBreakerState = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Factory function to create HTTP client with default configuration
 */
export function createHttpClient(config: Partial<HttpClientConfig> = {}): HttpClient {
  const defaultConfig: HttpClientConfig = {
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
      monitoringEnabled: true,
    },
    defaultHeaders: {
      'User-Agent': 'marketing-websites/1.0.0',
    },
  };

  return new HttpClient({ ...defaultConfig, ...config });
}
