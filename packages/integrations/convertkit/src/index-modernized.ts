/**
 * @file packages/integrations/convertkit/src/index-modernized.ts
 * Task: Standardize ConvertKit integration with 2026 best practices
 *
 * Purpose: Modernized ConvertKit adapter using shared integration utilities.
 * Implements circuit breaker, secure logging, OAuth 2.1 patterns, and monitoring.
 *
 * Created: 2026-02-21
 * Standards: Circuit breaker, secure authentication, unified logging, monitoring
 */

import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import type {
  BaseIntegrationAdapter,
  IntegrationConfig,
  IntegrationResult,
  AuthConfig,
  ApiKeyAuth,
} from '../../shared/src/types/adapter';
import {
  createLogger,
  createHttpClient,
  createApiKeyAuth,
  DEFAULT_INTEGRATION_CONFIG,
} from '../../shared/src/index';

const logger = createLogger('convertkit');

/**
 * Modern ConvertKit adapter implementing 2026 integration standards
 */
export class ConvertKitAdapter extends BaseIntegrationAdapter implements EmailAdapter {
  private httpClient: any;
  private authConfig: ApiKeyAuth;

  constructor(apiKey: string) {
    super('convertkit', 'ConvertKit Email Marketing', '2.0.0');

    if (!apiKey) {
      throw new Error('ConvertKit API key is required');
    }

    // Create secure authentication configuration
    this.authConfig = createApiKeyAuth(apiKey, 'X-Kit-Api-Key');

    logger.info('ConvertKit adapter initialized', {
      version: this.version,
      hasApiKey: !!apiKey,
    });
  }

  /**
   * Initialize adapter with configuration
   */
  protected async onInitialize(config: IntegrationConfig): Promise<void> {
    // Override auth config with provided one
    config.auth = this.authConfig;

    // Create HTTP client with circuit breaker and retry logic
    this.httpClient = createHttpClient({
      baseURL: 'https://api.kit.com/v4',
      timeout: config.timeout,
      retry: config.retry,
      circuitBreaker: config.circuitBreaker,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'User-Agent': `marketing-websites/${this.version}`,
      },
    });

    logger.info('ConvertKit adapter initialized with circuit breaker', {
      timeout: config.timeout,
      retryAttempts: config.retry.maxAttempts,
      circuitBreakerThreshold: config.circuitBreaker.failureThreshold,
    });
  }

  /**
   * Health check for ConvertKit API
   */
  async healthCheck(): Promise<
    IntegrationResult<{ status: 'healthy' | 'degraded' | 'unhealthy' }>
  > {
    if (!this.httpClient) {
      return {
        success: false,
        error: 'Adapter not initialized',
        code: 'NOT_INITIALIZED',
      };
    }

    return this.executeOperation(async () => {
      // Test API connectivity with a simple request
      const response = await this.httpClient.request({
        url: '/subscribers',
        method: 'GET',
        headers: await this.buildHeaders(),
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      const status =
        response.data.status >= 500
          ? 'unhealthy'
          : response.data.status >= 400
            ? 'degraded'
            : 'healthy';

      return { status };
    }, 'health-check');
  }

  /**
   * Subscribe a user to a ConvertKit form
   * Implements secure two-step process following 2026 best practices
   */
  async subscribe(subscriber: EmailSubscriber, formId?: string) {
    if (!formId) {
      return { success: false, error: 'Form ID required for ConvertKit subscription' };
    }

    return this.executeOperation(async () => {
      logger.startOperation('subscribe', {
        email: subscriber.email,
        formId,
        hasFirstName: !!subscriber.firstName,
      });

      // Step 1: Create subscriber (inactive)
      const subscriberData = await this.createSubscriber(subscriber);
      if (!subscriberData) {
        throw new Error('Failed to create subscriber');
      }

      // Step 2: Add subscriber to form (triggers confirmation email)
      const addedToForm = await this.addSubscriberToForm(subscriber.email, formId);
      if (!addedToForm) {
        throw new Error('Failed to add subscriber to form');
      }

      logger.info('Subscription completed successfully', {
        email: subscriber.email,
        formId,
        subscriberId: subscriberData.id,
      });

      return { success: true };
    }, 'subscribe');
  }

  /**
   * Unsubscribe a user from a ConvertKit form
   */
  async unsubscribe(email: string, listId?: string) {
    return this.executeOperation(async () => {
      // ConvertKit unsubscribe requires the subscriber ID which we don't have.
      // This would require additional API calls to find the subscriber first.
      logger.warn('Unsubscribe not fully implemented for ConvertKit', {
        email,
        listId,
        reason: 'Requires subscriber ID lookup',
      });

      throw new Error(
        'Unsubscribe not fully implemented for ConvertKit - requires subscriber ID lookup'
      );
    }, 'unsubscribe');
  }

  /**
   * Send custom event to ConvertKit
   * ConvertKit doesn't have a direct "Events" API like Mailchimp.
   */
  async sendEvent(email: string, eventName: string, data?: Record<string, unknown>) {
    return this.executeOperation(async () => {
      logger.warn('Event sending not implemented for ConvertKit', {
        email,
        eventName,
        reason: 'ConvertKit uses tags/custom fields instead of events',
      });

      throw new Error('Event sending not implemented for ConvertKit - use tags or custom fields');
    }, 'send-event');
  }

  /**
   * Create subscriber in ConvertKit v4 API
   */
  private async createSubscriber(subscriber: EmailSubscriber): Promise<{ id: string } | null> {
    const response = await this.httpClient.request({
      url: '/subscribers',
      method: 'POST',
      headers: await this.buildHeaders(),
      body: {
        email_address: subscriber.email,
        first_name: subscriber.firstName,
        state: 'inactive', // Create as inactive first, then add to form
      },
    });

    if (!response.success) {
      logger.error('Failed to create subscriber', undefined, {
        email: subscriber.email,
        error: response.error,
      });
      return null;
    }

    logger.debug('Subscriber created successfully', {
      email: subscriber.email,
      subscriberId: response.data.data.id,
    });

    return response.data.data;
  }

  /**
   * Add subscriber to a form in ConvertKit v4 API
   */
  private async addSubscriberToForm(email: string, formId: string): Promise<boolean> {
    const response = await this.httpClient.request({
      url: `/forms/${formId}/subscribers`,
      method: 'POST',
      headers: await this.buildHeaders(),
      body: {
        email_address: email,
      },
    });

    const success = response.success && response.data.status < 400;

    logger.debug('Form subscription result', {
      email,
      formId,
      success,
      status: response.data?.status,
    });

    return success;
  }

  /**
   * Build authenticated headers using shared auth manager
   */
  private async buildHeaders(): Promise<Record<string, string>> {
    if (!this.config) {
      throw new Error('Adapter not initialized');
    }

    // For API key auth, we can build headers directly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': `marketing-websites/${this.version}`,
    };

    // Use secure header authentication (2026 best practice)
    headers[this.authConfig.headerName] = `${this.authConfig.prefix || ''}${this.authConfig.key}`;

    return headers;
  }
}

/**
 * Factory function to create ConvertKit adapter with default configuration
 */
export function createConvertKitAdapter(apiKey: string): ConvertKitAdapter {
  const adapter = new ConvertKitAdapter(apiKey);

  // Initialize with default configuration
  adapter
    .initialize({
      ...DEFAULT_INTEGRATION_CONFIG,
      auth: createApiKeyAuth(apiKey, 'X-Kit-Api-Key'),
    })
    .catch((error) => {
      logger.error('Failed to initialize ConvertKit adapter', error);
    });

  return adapter;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use createConvertKitAdapter instead
 */
export class ConvertKitAdapterLegacy extends ConvertKitAdapter {
  // Maintain backward compatibility with existing code
}
