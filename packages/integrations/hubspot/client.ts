/**
 * @file packages/integrations/hubspot/client.ts
 * Purpose: HubSpot CRM API client with circuit breaker and retry logic
 *
 * Updates (2026-02-21):
 * - Implemented circuit breaker pattern for fault tolerance
 * - Added exponential backoff retry logic with jitter
 * - Configured timeout and monitoring for API calls
 * - Added fallback mechanisms for service outages
 * - Maintained Bearer token authentication for OAuth 2.1 compliance
 */
import { logError } from '@repo/infra';
import { createHttpClient } from '@repo/integrations-shared';
import type { HubSpotContactResponse } from './types';

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com';

/**
 * HubSpot API client with circuit breaker and retry logic
 */
class HubSpotClient {
  public httpClient: ReturnType<typeof createHttpClient>;

  constructor() {
    const token = this.getToken();

    // Initialize HTTP client with circuit breaker and retry logic
    this.httpClient = createHttpClient({
      baseURL: HUBSPOT_API_BASE_URL,
      timeout: 15000, // HubSpot can be slower
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 15000,
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
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Get HubSpot API token with validation
   */
  private getToken(): string {
    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
    if (!token) {
      throw new Error('HUBSPOT_PRIVATE_APP_TOKEN is required for HubSpot operations');
    }
    return token;
  }

  /**
   * Build headers with optional idempotency key
   */
  public buildHeaders(idempotencyKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return headers;
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
        url: '/crm/v3/ping',
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

// Global HubSpot client instance
const hubSpotClient = new HubSpotClient();

type HubSpotSearchResponse = {
  total: number;
  results: Array<{ id: string }>;
};

type HubSpotUpsertTarget = {
  url: string;
  method: 'PATCH' | 'POST';
};

function getUpsertTarget(existingId?: string): HubSpotUpsertTarget {
  if (existingId) {
    return {
      url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`,
      method: 'PATCH',
    };
  }
  return {
    url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`,
    method: 'POST',
  };
}

export async function searchHubSpotContact(email: string): Promise<string | undefined> {
  try {
    const result = await hubSpotClient.httpClient.request<HubSpotSearchResponse>({
      url: '/crm/v3/objects/contacts/search',
      method: 'POST',
      body: {
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
        properties: ['email'],
        limit: 1,
      },
    });

    if (!result.success) {
      logError('HubSpot search request failed', undefined, {
        error: result.error,
        code: result.code,
        retryable: result.retryable,
      });
      throw new Error(`HubSpot search failed: ${result.error}`);
    }

    const data = result.data.data;
    if (!Array.isArray(data.results)) {
      logError('HubSpot search response missing results array');
      throw new Error('HubSpot search response missing results array');
    }

    return data.results[0]?.id;
  } catch (error) {
    // Re-throw network/timeout errors but log API errors
    if (error instanceof Error && error.message.includes('HubSpot search failed')) {
      throw error;
    }

    logError(
      'HubSpot search request failed',
      error instanceof Error ? error : new Error(String(error))
    );
    throw new Error(
      `HubSpot search failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function upsertHubSpotContact(params: {
  properties: Record<string, string>;
  idempotencyKey?: string;
  existingId?: string;
}): Promise<HubSpotContactResponse> {
  const { properties, idempotencyKey, existingId } = params;
  const { url, method } = getUpsertTarget(existingId);

  try {
    const result = await hubSpotClient.httpClient.request<HubSpotContactResponse>({
      url: url.replace(HUBSPOT_API_BASE_URL, ''), // Remove base URL since client has it
      method: method as 'POST' | 'PATCH',
      headers: hubSpotClient.buildHeaders(idempotencyKey),
      body: { properties },
    });

    if (!result.success) {
      logError('HubSpot upsert request failed', undefined, {
        error: result.error,
        code: result.code,
        retryable: result.retryable,
      });
      throw new Error(`HubSpot upsert failed: ${result.error}`);
    }

    return result.data.data;
  } catch (error) {
    // Re-throw network/timeout errors but log API errors
    if (error instanceof Error && error.message.includes('HubSpot upsert failed')) {
      throw error;
    }

    logError(
      'HubSpot upsert request failed',
      error instanceof Error ? error : new Error(String(error))
    );
    throw new Error(
      `HubSpot upsert failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Export HubSpot client instance for advanced usage
 */
export { hubSpotClient };

/**
 * Export circuit breaker state for monitoring
 */
export function getHubSpotCircuitBreakerState(): 'closed' | 'open' | 'half-open' {
  return hubSpotClient.getCircuitBreakerState();
}

/**
 * Export metrics for monitoring
 */
export function getHubSpotMetrics() {
  return hubSpotClient.getMetrics();
}

/**
 * Export health check function
 */
export async function hubSpotHealthCheck() {
  return hubSpotClient.healthCheck();
}
