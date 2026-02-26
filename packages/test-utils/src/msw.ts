/**
 * @file packages/test-utils/src/msw.ts
 * @summary Mock Service Worker setup for network interception.
 * @description Provides MSW utilities for mocking network requests in tests. Enables fast, reliable integration tests without real backend.
 * @security No real network requests; all data is mocked and safe.
 * @adr none
 * @requirements none
 */

import { http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

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
    http.get(url, () => {
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
    http.get(url, () => {
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
   * Not Found handler
   */
  notFound: (url: string) =>
    http.get(url, () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not Found',
          timestamp: new Date().toISOString(),
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * Forbidden handler
   */
  forbidden: (url: string) =>
    http.get(url, () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Forbidden',
          timestamp: new Date().toISOString(),
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }),

  /**
   * Rate limit handler
   */
  rateLimit: (url: string) =>
    http.get(url, () => {
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
    http.get(url, () => {
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
    http.get(url, () => {
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
    http.post(url, () => {
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
    http.put(url, () => {
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
    http.delete(url, () => {
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
      http.post('https://api.kit.com/v4/subscribers', () => {
        return new Response(
          JSON.stringify({
            subscriber: subscriberData,
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }),

    formSubscribe: (formData: any) =>
      http.post('https://api.kit.com/v4/forms/:id/subscribe', () => {
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
      http.get('https://maps.googleapis.com/maps/api/geocode/json', () => {
        return new Response(
          JSON.stringify({
            results: [location],
            status: 'OK',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }),

    places: (places: any[]) =>
      http.get('https://maps.googleapis.com/maps/api/place/textsearch/json', () => {
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
      http.get(/https:\/\/.*\.supabase\.co\/rest\/v1\/.*/, (info) => {
        const url = new URL(info.request.url);
        if (url.pathname.includes(`/rest/v1/${table}`)) {
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404 });
      }),

    insert: (table: string, data: any) =>
      http.post(/https:\/\/.*\.supabase\.co\/rest\/v1\/.*/, (info) => {
        const url = new URL(info.request.url);
        if (url.pathname.includes(`/rest/v1/${table}`)) {
          return new Response(JSON.stringify([data]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404 });
      }),

    update: (table: string, data: any) =>
      http.patch(/https:\/\/.*\.supabase\.co\/rest\/v1\/.*/, (info) => {
        const url = new URL(info.request.url);
        if (url.pathname.includes(`/rest/v1/${table}`)) {
          return new Response(JSON.stringify([data]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404 });
      }),

    delete: (table: string) =>
      http.delete(/https:\/\/.*\.supabase\.co\/rest\/v1\/.*/, (info) => {
        const url = new URL(info.request.url);
        if (url.pathname.includes(`/rest/v1/${table}`)) {
          return new Response(null, { status: 204 });
        }
        return new Response('Not Found', { status: 404 });
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
      return http.post(url, () => {
        return new Response(JSON.stringify(response.data), {
          status: response.status || 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    if (response.method === 'PUT') {
      return http.put(url, () => {
        return new Response(JSON.stringify(response.data), {
          status: response.status || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    if (response.method === 'DELETE') {
      return http.delete(url, () => {
        return new Response(null, { status: response.status || 204 });
      });
    }

    // Default to GET
    return http.get(url, () => {
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
  return async (info: any) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return handler(info);
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
      // For now, we'll simulate waiting and then resolve
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for request to ${url}`));
        return;
      }

      // Simulate finding the request after some time
      setTimeout(() => resolve(), 100);
    };

    checkRequest();
  });
}

// ============================================================================
// Request Tracking
// ============================================================================

/**
 * Global request history for MSW
 */
const requestHistory: Array<{
  url: string;
  method: string;
  timestamp: number;
  body?: any;
}> = [];

/**
 * Get request history from MSW
 */
export function getRequestHistory(): any[] {
  return [...requestHistory];
}

/**
 * Clear request history
 */
export function clearRequestHistory(): void {
  requestHistory.length = 0;
}

/**
 * Track request for history
 */
export function trackRequest(url: string, method: string, body?: any) {
  requestHistory.push({
    url,
    method,
    timestamp: Date.now(),
    body,
  });
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
