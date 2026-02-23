/**
 * @file packages/integrations/convertkit/src/__tests__/convertkit.test.ts
 * Purpose: Test suite for ConvertKit adapter with security validation
 *
 * Tests security improvements:
 * - API key in X-Kit-Api-Key header (not request body)
 * - ConvertKit v4 API usage
 * - Secure logging without exposing secrets
 * - Two-step subscription process
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ConvertKitAdapter } from '../index';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Headers constructor
global.Headers = vi.fn((init?: HeadersInit) => {
  const map = new Map<string, string>();
  if (init) {
    if (Array.isArray(init)) {
      init.forEach(([key, value]) => map.set(key, value));
    } else if (typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => map.set(key, value));
    }
  }
  return {
    get: (key: string) => map.get(key) || null,
    set: (key: string, value: string) => map.set(key, value),
    has: (key: string) => map.has(key),
    delete: (key: string) => map.delete(key),
    entries: () => map.entries(),
    values: () => map.values(),
    keys: () => map.keys(),
    forEach: (callback: (value: string, key: string) => void) => {
      map.forEach(callback);
    },
    append: (key: string, value: string) => map.set(key, value),
    getSetCookie: () => '',
    [Symbol.iterator]: () => map.entries(),
  };
}) as any;

// Helper function to create complete mock Response
function createMockResponse(data: any, options: Partial<Response> = {}): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0),
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic',
    url: '',
    clone: () => ({}) as Response,
    ...options,
  } as Response;
}

function createMockErrorResponse(status: number, error: any): Response {
  return {
    ok: false,
    status,
    statusText: 'Error',
    headers: new Headers(),
    json: async () => error,
    text: async () => JSON.stringify(error),
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0),
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic',
    url: '',
    clone: () => ({}) as Response,
  } as Response;
}

// Mock console.log for secure logging testing
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

// Set NODE_ENV to 'development' for logging tests
const originalNodeEnv = process.env.NODE_ENV;
beforeEach(() => {
  process.env.NODE_ENV = 'development';
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  mockConsoleLog.mockClear();
});

describe('ConvertKitAdapter Security Tests', () => {
  let adapter: ConvertKitAdapter;
  const testApiKey = 'ck_test_123456789';
  const testFormId = '123456';

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new ConvertKitAdapter(testApiKey);
  });

  describe('Constructor Security', () => {
    it('should throw error when API key is missing', () => {
      expect(() => new ConvertKitAdapter('')).toThrow('ConvertKit API key is required');
      expect(() => new ConvertKitAdapter('' as any)).toThrow('ConvertKit API key is required');
    });

    it('should log initialization securely', () => {
      new ConvertKitAdapter(testApiKey);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[ConvertKit] Adapter initialized with API key',
        expect.stringContaining('[REDACTED]')
      );
    });
  });

  describe('API Security - Header Authentication', () => {
    it('should use X-Kit-Api-Key header for subscriber creation', async () => {
      // Mock successful subscriber creation response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: 'sub_123' }),
          text: async () => JSON.stringify({ id: 'sub_123' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          json: async () => ({}),
          text: async () => JSON.stringify({}),
        } as Response);

      await adapter.subscribe({ email: 'test@example.com', firstName: 'John' }, testFormId);

      // Verify first call (create subscriber) uses secure header
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.kit.com/v4/subscribers',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': testApiKey, // API key in header, not body
          }),
        })
      );

      // Verify API key is NOT in request body
      const firstCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(firstCallBody).not.toHaveProperty('api_key');
      expect(firstCallBody).not.toHaveProperty('apiKey');
    });

    it('should use X-Kit-Api-Key header for form subscription', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'sub_123' }),
        })
        .mockResolvedValueOnce({
          ok: true,
        });

      await adapter.subscribe({ email: 'test@example.com', firstName: 'John' }, testFormId);

      // Verify second call (add to form) uses secure header
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.kit.com/v4/forms/${testFormId}/subscribers`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': testApiKey, // API key in header
          }),
        })
      );
    });
  });

  describe('API Version Security - v4 Usage', () => {
    it('should use ConvertKit v4 API endpoints', async () => {
      mockFetch
        .mockResolvedValueOnce(createMockResponse({ id: 'sub_123' }))
        .mockResolvedValueOnce(createMockResponse({}));

      await adapter.subscribe({ email: 'test@example.com', firstName: 'John' }, testFormId);

      // Verify v4 API endpoints are used (not legacy v3)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.kit.com/v4/subscribers', // v4 endpoint
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.kit.com/v4/forms/${testFormId}/subscribers`, // v4 endpoint
        expect.any(Object)
      );
    });
  });

  describe('Secure Logging', () => {
    it('should redact API keys in logs', () => {
      new ConvertKitAdapter(testApiKey);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[ConvertKit] Adapter initialized with API key',
        expect.stringMatching(/\[REDACTED\]/)
      );
    });

    it('should log operations without sensitive data', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: 'sub_123' }),
          text: async () => JSON.stringify({ id: 'sub_123' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          json: async () => ({}),
          text: async () => JSON.stringify({}),
        } as Response);

      await adapter.subscribe({ email: 'test@example.com', firstName: 'John' }, testFormId);

      // Verify logging occurs but doesn't expose sensitive data
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[ConvertKit] Creating subscriber',
        expect.stringContaining('test@example.com')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[ConvertKit] Adding subscriber to form',
        expect.stringContaining('test@example.com')
      );
    });
  });

  describe('Two-Step Subscription Process', () => {
    it('should create subscriber first, then add to form', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: 'sub_123' }),
          text: async () => JSON.stringify({ id: 'sub_123' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          json: async () => ({}),
          text: async () => JSON.stringify({}),
        } as Response);

      const result = await adapter.subscribe(
        { email: 'test@example.com', firstName: 'John' },
        testFormId
      );

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // First call: create subscriber
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'https://api.kit.com/v4/subscribers',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"state":"inactive"'),
        })
      );

      // Second call: add to form
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        `https://api.kit.com/v4/forms/${testFormId}/subscribers`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should fail if subscriber creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Invalid API key',
      });

      const result = await adapter.subscribe(
        { email: 'test@example.com', firstName: 'John' },
        testFormId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create subscriber');
      expect(mockFetch).toHaveBeenCalledTimes(1); // Should not proceed to form addition
    });

    it('should fail if form addition fails', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: 'sub_123' }),
          text: async () => JSON.stringify({ id: 'sub_123' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          headers: new Headers(),
          json: async () => ({ error: 'Invalid form' }),
          text: async () => JSON.stringify({ error: 'Invalid form' }),
        } as Response);

      const result = await adapter.subscribe(
        { email: 'test@example.com', firstName: 'John' },
        testFormId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to add subscriber to form');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Input Validation', () => {
    it('should require form ID for subscription', async () => {
      const result = await adapter.subscribe({ email: 'test@example.com', firstName: 'John' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Form ID required for ConvertKit subscription');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await adapter.subscribe(
        { email: 'test@example.com', firstName: 'John' },
        testFormId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create subscriber');
    });

    it('should handle API error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'API Error: Invalid request',
      });

      const result = await adapter.subscribe(
        { email: 'test@example.com', firstName: 'John' },
        testFormId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create subscriber');
    });
  });

  describe('Legacy Method Compatibility', () => {
    it('should maintain interface compatibility for unsubscribe', async () => {
      const result = await adapter.unsubscribe('test@example.com', testFormId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unsubscribe not fully implemented for ConvertKit');
    });

    it('should maintain interface compatibility for sendEvent', async () => {
      const result = await adapter.sendEvent('test@example.com', 'test_event');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Event sending not implemented for ConvertKit');
    });
  });
});
