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
import { rest } from 'msw';
import { vi, beforeEach, afterEach } from 'vitest';

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
    rest.get(url, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        })
      );
    }),

  /**
   * Error response handler
   */
  error: (url: string, message: string, status = 400) =>
    rest.get(url, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({
          success: false,
          error: message,
          timestamp: new Date().toISOString(),
        })
      );
    }),

  /**
   * Rate limit handler
   */
  rateLimit: (url: string) =>
    rest.get(url, (req, res, ctx) => {
      return res(
        ctx.status(429),
        ctx.json({
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: 60,
        }),
        ctx.set('Retry-After', '60')
      );
    }),

  /**
   * Unauthorized handler
   */
  unauthorized: (url: string) =>
    rest.get(url, (req, res, ctx) => {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          error: 'Unauthorized',
        })
      );
    }),

  /**
   * Server error handler
   */
  serverError: (url: string) =>
    rest.get(url, (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          success: false,
          error: 'Internal server error',
        })
      );
    }),

  /**
   * POST request handler
   */
  post: (url: string, responseData: any, status = 201) =>
    rest.post(url, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({
          success: true,
          data: responseData,
          timestamp: new Date().toISOString(),
        })
      );
    }),

  /**
   * PUT request handler
   */
  put: (url: string, responseData: any, status = 200) =>
    rest.put(url, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({
          success: true,
          data: responseData,
          timestamp: new Date().toISOString(),
        })
      );
    }),

  /**
   * DELETE request handler
   */
  delete: (url: string, status = 204) =>
    rest.delete(url, (req, res, ctx) => {
      return res(ctx.status(status));
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
      rest.post('https://api.kit.com/v4/subscribers', (req, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            subscriber: subscriberData,
          })
        );
      }),

    formSubscribe: (formData: any) =>
      rest.post('https://api.kit.com/v4/forms/:id/subscribe', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            subscription: formData,
          })
        );
      }),
  },

  /**
   * Google Maps API handlers
   */
  googleMaps: {
    geocode: (location: any) =>
      rest.get('https://maps.googleapis.com/maps/api/geocode/json', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [location],
            status: 'OK',
          })
        );
      }),

    places: (places: any[]) =>
      rest.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: places,
            status: 'OK',
          })
        );
      }),
  },

  /**
   * Supabase handlers
   */
  supabase: {
    select: (table: string, data: any[]) =>
      rest.get(`https://*.supabase.co/rest/v1/${table}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data));
      }),

    insert: (table: string, data: any) =>
      rest.post(`https://*.supabase.co/rest/v1/${table}`, (req, res, ctx) => {
        return res(ctx.status(201), ctx.json([data]));
      }),

    update: (table: string, data: any) =>
      rest.patch(`https://*.supabase.co/rest/v1/${table}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([data]));
      }),

    delete: (table: string) =>
      rest.delete(`https://*.supabase.co/rest/v1/${table}`, (req, res, ctx) => {
        return res(ctx.status(204));
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
      return rest.post(url, (req, res, ctx) => {
        return res(ctx.status(response.status || 201), ctx.json(response.data));
      });
    }

    if (response.method === 'PUT') {
      return rest.put(url, (req, res, ctx) => {
        return res(ctx.status(response.status || 200), ctx.json(response.data));
      });
    }

    if (response.method === 'DELETE') {
      return rest.delete(url, (req, res, ctx) => {
        return res(ctx.status(response.status || 204));
      });
    }

    // Default to GET
    return rest.get(url, (req, res, ctx) => {
      return res(ctx.status(response.status || 200), ctx.json(response.data));
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
  return rest.get(url, () => {
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
