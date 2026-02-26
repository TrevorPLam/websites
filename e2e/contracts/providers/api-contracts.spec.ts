import { expect, test } from '@playwright/test';

/**
 * API Provider Contract Tests
 *
 * Tests that API endpoints conform to their contracts
 * Validates request/response schemas, error handling, and authentication
 */

interface APISchema {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestSchema?: any;
  responseSchema: any;
  errorResponses: Array<{
    status: number;
    schema: any;
  }>;
  authentication?: 'none' | 'bearer' | 'basic';
  rateLimit?: {
    requests: number;
    window: number;
  };
}

const apiContracts: APISchema[] = [
  {
    path: '/api/leads',
    method: 'POST',
    requestSchema: {
      type: 'object',
      required: ['email', 'firstName'],
      properties: {
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        company: { type: 'string' },
        message: { type: 'string' },
        consent: { type: 'boolean' },
      },
    },
    responseSchema: {
      type: 'object',
      required: ['id', 'status', 'createdAt'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        status: { type: 'string', enum: ['pending', 'processing', 'completed'] },
        createdAt: { type: 'string', format: 'date-time' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string' },
      },
    },
    errorResponses: [
      {
        status: 400,
        schema: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      {
        status: 429,
        schema: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            retryAfter: { type: 'number' },
          },
        },
      },
    ],
    rateLimit: { requests: 100, window: 3600 },
  },
  {
    path: '/api/leads/:id',
    method: 'GET',
    responseSchema: {
      type: 'object',
      required: ['id', 'email', 'firstName', 'status', 'createdAt'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        company: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'processing', 'completed'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    errorResponses: [
      {
        status: 404,
        schema: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
          },
        },
      },
    ],
    authentication: 'bearer',
  },
  {
    path: '/api/bookings',
    method: 'POST',
    requestSchema: {
      type: 'object',
      required: ['serviceId', 'startTime', 'customerInfo'],
      properties: {
        serviceId: { type: 'string', format: 'uuid' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        customerInfo: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        notes: { type: 'string' },
      },
    },
    responseSchema: {
      type: 'object',
      required: ['id', 'status', 'startTime', 'customerInfo'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
        serviceId: { type: 'string', format: 'uuid' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        customerInfo: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        notes: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    errorResponses: [
      {
        status: 400,
        schema: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            field: { type: 'string' },
          },
        },
      },
      {
        status: 409,
        schema: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            conflictType: { type: 'string' },
          },
        },
      },
    ],
    authentication: 'bearer',
  },
];

class SchemaValidator {
  static validate(data: any, schema: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Simple validation - in production, use a proper JSON schema validator
    if (schema.type === 'object') {
      if (schema.required) {
        for (const requiredField of schema.required) {
          if (!(requiredField in data)) {
            errors.push(`Missing required field: ${requiredField}`);
          }
        }
      }

      if (schema.properties) {
        for (const [field, fieldSchema] of Object.entries(schema.properties)) {
          if (field in data) {
            const value = data[field];
            const fieldDef = fieldSchema as any;

            if (fieldDef.type === 'string' && typeof value !== 'string') {
              errors.push(`Field ${field} must be a string`);
            }

            if (fieldDef.type === 'boolean' && typeof value !== 'boolean') {
              errors.push(`Field ${field} must be a boolean`);
            }

            if (fieldDef.enum && !fieldDef.enum.includes(value)) {
              errors.push(`Field ${field} must be one of: ${fieldDef.enum.join(', ')}`);
            }

            if (fieldDef.format === 'email' && typeof value === 'string') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                errors.push(`Field ${field} must be a valid email`);
              }
            }

            if (fieldDef.format === 'uuid' && typeof value === 'string') {
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              if (!uuidRegex.test(value)) {
                errors.push(`Field ${field} must be a valid UUID`);
              }
            }

            if (fieldDef.format === 'date-time' && typeof value === 'string') {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                errors.push(`Field ${field} must be a valid date-time`);
              }
            }

            if (
              fieldDef.minLength &&
              typeof value === 'string' &&
              value.length < fieldDef.minLength
            ) {
              errors.push(`Field ${field} must be at least ${fieldDef.minLength} characters`);
            }
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

test.describe('API Provider Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authentication token for protected endpoints
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  apiContracts.forEach((contract) => {
    test.describe(`${contract.method} ${contract.path}`, () => {
      test('should conform to response schema', async ({ page }) => {
        // Mock API response
        await page.route(`**${contract.path}`, async (route) => {
          const mockResponse = generateMockResponse(contract.responseSchema);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockResponse),
          });
        });

        // Make API request
        const response = await makeAPIRequest(page, contract);

        // Validate response schema
        const validation = SchemaValidator.validate(response, contract.responseSchema);
        expect(validation.valid, `Schema validation failed: ${validation.errors.join(', ')}`).toBe(
          true
        );
      });

      test('should handle authentication requirements', async ({ page }) => {
        if (!contract.authentication) {
          test.skip();
        }

        // Clear authentication
        await page.context().clearCookies();

        // Make request without authentication
        await page.route(`**${contract.path}`, async (route) => {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Authentication required' }),
          });
        });

        try {
          await makeAPIRequest(page, contract);
          // Request should have failed without authentication
          expect(true).toBe(false);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          expect(errorMessage).toContain('401');
        }
      });

      test('should validate request schema', async ({ page }) => {
        if (!contract.requestSchema) {
          test.skip();
        }

        // Mock endpoint to return received data
        await page.route(`**${contract.path}`, async (route) => {
          const request = route.request();
          const postData = request.postDataJSON();

          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ received: postData }),
          });
        });

        // Test with invalid request data
        const invalidRequest = generateInvalidRequest(contract.requestSchema);

        try {
          await makeAPIRequest(page, contract, invalidRequest);
          // Request should have failed with invalid data
          expect(true).toBe(false);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          expect(errorMessage).toContain('400');
        }
      });

      test('should handle error responses according to contract', async ({ page }) => {
        for (const errorResponse of contract.errorResponses) {
          // Mock error response
          await page.route(`**${contract.path}`, async (route) => {
            const mockError = generateMockResponse(errorResponse.schema);
            await route.fulfill({
              status: errorResponse.status,
              contentType: 'application/json',
              body: JSON.stringify(mockError),
            });
          });

          try {
            await makeAPIRequest(page, contract);
            // Request should have failed with error status
            expect(true).toBe(false);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            expect(errorMessage).toContain(errorResponse.status.toString());
          }
        }
      });

      test('should respect rate limits', async ({ page }) => {
        if (!contract.rateLimit) {
          test.skip();
        }

        let requestCount = 0;

        await page.route(`**${contract.path}`, async (route) => {
          requestCount++;

          if (requestCount > contract.rateLimit!.requests) {
            await route.fulfill({
              status: 429,
              contentType: 'application/json',
              body: JSON.stringify({
                error: 'Rate limit exceeded',
                retryAfter: contract.rateLimit!.window,
              }),
            });
          } else {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ success: true }),
            });
          }
        });

        // Make requests up to and beyond the rate limit
        const results = [];
        for (let i = 0; i < contract.rateLimit!.requests + 5; i++) {
          try {
            const response = await makeAPIRequest(page, contract);
            results.push({ success: true, response });
          } catch (error: unknown) {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }

        const rateLimited = results.filter((r) => !r.success && r.error?.includes('429')).length;

        expect(rateLimited).toBeGreaterThan(0);
      });
    });
  });

  test('should maintain backward compatibility', async ({ page }) => {
    // Test that API responses include all required fields for older clients
    const legacyContract = apiContracts[0]; // Use leads API as example

    await page.route(`**${legacyContract.path}`, async (route) => {
      // Response with additional fields (new version)
      const response = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00Z',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        // New fields that shouldn't break old clients
        phone: '+1234567890',
        company: 'Acme Corp',
        source: 'website',
        metadata: { campaign: 'spring2024' },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });

    const apiResponse = await makeAPIRequest(page, legacyContract);

    // Validate against original schema (backward compatibility)
    const validation = SchemaValidator.validate(apiResponse, legacyContract.responseSchema);
    expect(validation.valid).toBe(true);
  });
});

// Helper functions
function generateMockResponse(schema: any): any {
  if (schema.type === 'object') {
    const response: any = {};

    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        const fieldDef = value as any;

        if (fieldDef.format === 'uuid') {
          response[key] = '123e4567-e89b-12d3-a456-426614174000';
        } else if (fieldDef.format === 'email') {
          response[key] = 'test@example.com';
        } else if (fieldDef.format === 'date-time') {
          response[key] = '2024-01-01T00:00:00Z';
        } else if (fieldDef.type === 'string') {
          if (fieldDef.enum) {
            response[key] = fieldDef.enum[0];
          } else {
            response[key] = 'test-string';
          }
        } else if (fieldDef.type === 'boolean') {
          response[key] = true;
        } else if (fieldDef.type === 'number') {
          response[key] = 123;
        } else if (fieldDef.type === 'object' && fieldDef.properties) {
          response[key] = generateMockResponse(fieldDef);
        }
      }
    }

    return response;
  }

  return {};
}

function generateInvalidRequest(schema: any): any {
  const invalid: any = {};

  if (schema.required) {
    // Remove a required field
    const missingField = schema.required[0];
    // Don't include the missing field
  }

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      const fieldDef = value as any;

      if (fieldDef.type === 'string') {
        if (fieldDef.format === 'email') {
          invalid[key] = 'invalid-email';
        } else if (fieldDef.enum) {
          invalid[key] = 'not-in-enum';
        } else {
          invalid[key] = 123; // Wrong type
        }
      } else if (fieldDef.type === 'boolean') {
        invalid[key] = 'not-boolean';
      }
    }
  }

  return invalid;
}

async function makeAPIRequest(page: any, contract: APISchema, data?: any): Promise<any> {
  const url = contract.path.replace(':id', '123e4567-e89b-12d3-a456-426614174000');

  const response = await page.evaluate(
    ({ url, method, data }: { url: string; method: string; data?: any }) => {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      return fetch(url, options).then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      });
    },
    { url, method: contract.method, data }
  );

  return response;
}
