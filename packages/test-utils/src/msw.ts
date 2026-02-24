/**
 * @file packages/test-utils/src/msw.ts
 * @role test
 * @summary Mock Service Worker setup for network interception
 *
 * Provides MSW utilities for mocking network requests in tests.
 * Enables fast, reliable integration tests without real backend.
 *
 * @entrypoints
 * - import { setupMsw, mockApi } from '@repo/test-utils/msw'
 *
 * @exports
 * - MSW setup and teardown utilities
 * - Common API mock handlers
 * - Network interception helpers
 *
 * @depends_on
 * - External: msw
 *
 * @used_by
 * - Integration test suites
 *
 * @runtime
 * - environment: test
 * - side_effects: Sets up global MSW instance
 */

import { setupServer } from 'msw/node';
import { http } from 'msw';
import { vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// ============================================================================
// MSW Server Setup
// ============================================================================

/**
 * Global MSW server instance
 */
let mswServer: ReturnType<typeof setupServer> | null = null;

/**
 * Setup MSW server with default handlers
 */
export function setupMsw(handlers: any[] = []) {
  if (mswServer) {
    mswServer.close();
  }

  mswServer = setupServer(...handlers);

  // Start server before all tests
  beforeAll(() => {
    mswServer?.listen({
      onUnhandledRequest: 'error',
    });
  });

  // Reset request handlers between tests
  afterEach(() => {
    mswServer?.resetHandlers();
  });

  // Close server after all tests
  afterAll(() => {
    mswServer?.close();
  });

  return mswServer;
}

// ============================================================================
// Common API Handlers
// ============================================================================

/**
 * Create mock handlers for common API scenarios
 */
export const createApiHandlers = {
  /**
   * Success response handler
   */
  success: (url: string, data: any, status = 200) =>
    http.get(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * Error response handler
   */
  error: (url: string, message: string, status = 400) =>
    http.get(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: false,
          error: message,
          timestamp: new Date().toISOString(),
        }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * Rate limit handler
   */
  rateLimit: (url: string) =>
    http.get(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }),

  /**
   * Unauthorized handler
   */
  unauthorized: (url: string) =>
    http.get(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * Server error handler
   */
  serverError: (url: string) =>
    http.get(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * POST request handler
   */
  post: (url: string, responseData: any, status = 201) =>
    http.post(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: true,
          data: responseData,
          timestamp: new Date().toISOString(),
        }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * PUT request handler
   */
  put: (url: string, responseData: any, status = 200) =>
    http.put(url, ({ request }) => {
      return new Response(
        JSON.stringify({
          success: true,
          data: responseData,
          timestamp: new Date().toISOString(),
        }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * DELETE request handler
   */
  delete: (url: string, status = 204) =>
    http.delete(url, ({ request }) => {
      return new Response(null, { status });
    }),
};

// ============================================================================
// Integration-Specific Handlers
// ============================================================================

/**
 * Mock handlers for common integrations
 */
export const integrationHandlers = {
  /**
   * ConvertKit API handlers
   */
  convertkit: {
    subscriber: (subscriberData: any) =>
      http.post('https://api.kit.com/v4/subscribers', ({ request }) => {
        return new Response(
          JSON.stringify({
            subscriber: subscriberData,
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }),

    formSubscribe: (formData: any) =>
      http.post('https://api.kit.com/v4/forms/:id/subscribe', ({ request }) => {
        return new Response(
          JSON.stringify({
            subscription: formData,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }),
  },

  /**
   * Google Maps API handlers
   */
  googleMaps: {
    geocode: (location: any) =>
      http.get('https://maps.googleapis.com/maps/api/geocode/json', ({ request }) => {
        return new Response(
          JSON.stringify({
            results: [location],
            status: 'OK',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }),

    places: (places: any[]) =>
      http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', ({ request }) => {
        return new Response(
          JSON.stringify({
            results: places,
            status: 'OK',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }),
  },

  /**
   * Supabase handlers
   */
  supabase: {
    select: (table: string, data: any[]) =>
      http.get(`https://*.supabase.co/rest/v1/${table}`, ({ request }) => {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),

    insert: (table: string, data: any) =>
      http.post(`https://*.supabase.co/rest/v1/${table}`, ({ request }) => {
        return new Response(JSON.stringify([data]), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }),

    update: (table: string, data: any) =>
      http.patch(`https://*.supabase.co/rest/v1/${table}`, ({ request }) => {
        return new Response(JSON.stringify([data]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),

    delete: (table: string) =>
      http.delete(`https://*.supabase.co/rest/v1/${table}`, ({ request }) => {
        return new Response(null, { status: 204 });
      }),
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a mock API with multiple endpoints
 */
export function createMockApi(baseUrl: string, endpoints: Record<string, any>) {
  const handlers = Object.entries(endpoints).map(([path, response]) => {
    const url = `${baseUrl}${path}`;

    if (response.method === 'POST') {
      return http.post(url, ({ request }) => {
        return new Response(JSON.stringify(response.data), {
          status: response.status || 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    if (response.method === 'PUT') {
      return http.put(url, ({ request }) => {
        return new Response(JSON.stringify(response.data), {
          status: response.status || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    if (response.method === 'DELETE') {
      return http.delete(url, ({ request }) => {
        return new Response(null, { status: response.status || 204 });
      });
    }

    // Default to GET
    return http.get(url, ({ request }) => {
      return new Response(JSON.stringify(response.data), {
        status: response.status || 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  return setupMsw(handlers);
}

/**
 * Mock network delays for testing loading states
 */
export function createDelayedHandler(handler: any, delayMs: number) {
  return async (req: any, res: any, ctx: any) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return handler(req, res, ctx);
  };
}

/**
 * Mock network failures
 */
export function createNetworkFailureHandler(url: string) {
  return http.get(url, () => {
    throw new Error('Network error');
  });
}

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Wait for network requests to complete
 */
export function waitForNetworkRequest(url: string, timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkRequest = () => {
      // In a real implementation, you'd track actual requests
      // For now, we'll simulate waiting
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for request to ${url}`));
        return;
      }

      setTimeout(checkRequest, 100);
    };

    checkRequest();
  });
}

/**
 * Get request history from MSW
 */
export function getRequestHistory(): any[] {
  // This would need to be implemented with request tracking
  // For now, return empty array
  return [];
}

/**
 * Clear request history
 */
export function clearRequestHistory(): void {
  // This would need to be implemented with request tracking
}

// ============================================================================
// Exports
// ============================================================================

export default {
  setupMsw,
  createApiHandlers,
  integrationHandlers,
  createMockApi,
  createDelayedHandler,
  createNetworkFailureHandler,
  waitForNetworkRequest,
  getRequestHistory,
  clearRequestHistory,
};
