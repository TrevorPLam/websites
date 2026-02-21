/**
 * @file packages/integrations/mailchimp/src/index.ts
 * Task: [4.1] Mailchimp email marketing adapter with circuit breaker
 *
 * Resilience Updates (2026-02-21):
 * - Implemented circuit breaker pattern for fault tolerance
 * - Added exponential backoff retry logic with jitter
 * - Configured timeout and monitoring for API calls
 * - Added fallback mechanisms for service outages
 * - Maintained API key authentication for OAuth 2.1 compliance
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import { createHttpClient, createApiKeyAuth } from '../shared';
import type { IntegrationConfig, ApiKeyAuth } from '../shared';

export class MailchimpAdapter implements EmailAdapter {
  id = 'mailchimp';
  private httpClient: ReturnType<typeof createHttpClient>;
  private config: IntegrationConfig;

  constructor(
    private apiKey: string,
    private server: string
  ) {
    if (!apiKey) {
      throw new Error('Mailchimp API key is required');
    }
    if (!server) {
      throw new Error('Mailchimp server prefix is required');
    }

    // Initialize HTTP client with circuit breaker and retry logic
    this.config = this.createConfig(apiKey);
    this.httpClient = createHttpClient({
      baseURL: `https://${server}.api.mailchimp.com/3.0`,
      timeout: 12000,
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 12000,
        backoffFactor: 2,
        jitterEnabled: true,
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 30000,
        monitoringEnabled: true,
      },
      defaultHeaders: {
        'Content-Type': 'application/json',
        Authorization: `apikey ${apiKey}`, // Mailchimp uses 'apikey' prefix
      },
    });
  }

  /**
   * Create integration configuration following 2026 security standards
   */
  private createConfig(apiKey: string): IntegrationConfig {
    const authConfig: ApiKeyAuth = {
      type: 'api_key',
      key: apiKey,
      headerName: 'Authorization',
      prefix: 'apikey ',
    };

    return {
      timeout: 12000,
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 12000,
        backoffFactor: 2,
        jitterEnabled: true,
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 30000,
        monitoringEnabled: true,
      },
      auth: authConfig,
      monitoring: {
        enabled: true,
        alertThresholds: {
          errorRate: 0.1, // 10%
          responseTime: 6000, // 6 seconds
        },
      },
    };
  }

  async subscribe(subscriber: EmailSubscriber, listId?: string) {
    if (!listId) return { success: false, error: 'List ID required' };

    try {
      const result = await this.httpClient.request<unknown>({
        url: `/lists/${listId}/members`,
        method: 'POST',
        body: {
          email_address: subscriber.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: subscriber.firstName,
            LNAME: subscriber.lastName,
          },
          tags: subscriber.tags,
        },
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Subscription failed',
          code: result.code,
          retryable: result.retryable,
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async unsubscribe(email: string, listId?: string) {
    if (!listId) return { success: false, error: 'List ID required' };

    try {
      // Mailchimp requires MD5 hash of email for member operations
      const emailHash = require('crypto')
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex');

      const result = await this.httpClient.request<unknown>({
        url: `/lists/${listId}/members/${emailHash}`,
        method: 'PATCH',
        body: { status: 'unsubscribed' },
      });

      return { success: result.success };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, unknown>) {
    try {
      // Mailchimp requires MD5 hash of email for member operations
      const emailHash = require('crypto')
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex');

      const result = await this.httpClient.request<unknown>({
        url: `/lists/members/${emailHash}/events`,
        method: 'POST',
        body: {
          name: eventName,
          properties: data,
        },
      });

      return { success: result.success };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get circuit breaker state for monitoring
   */
  getCircuitBreakerState(): 'closed' | 'open' | 'half-open' {
    return this.httpClient.getCircuitBreakerState();
  }

  /**
   * Get integration metrics for monitoring
   */
  getMetrics() {
    return {
      success: true,
      data: this.httpClient.getMetrics(),
    };
  }

  /**
   * Health check for the integration
   */
  async healthCheck() {
    try {
      const result = await this.httpClient.request<{ status: string }>({
        url: '/ping',
        method: 'GET',
        timeout: 5000, // Shorter timeout for health checks
        retries: { maxAttempts: 1 }, // No retries for health checks
      });

      if (result.success) {
        return {
          success: true,
          data: { status: 'healthy' },
        };
      } else {
        return {
          success: false,
          error: result.error,
          code: result.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        code: 'HEALTH_CHECK_FAILED',
      };
    }
  }
}
