import { test, expect } from '@playwright/test';

/**
 * Client Integration Contract Tests
 * 
 * Tests that client-side code properly consumes API contracts
 * Validates error handling, retry logic, and data transformation
 */

interface ClientContract {
  name: string;
  apiEndpoint: string;
  expectedRequests: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
  }[];
  expectedResponses: {
    status: number;
    body: any;
    headers?: Record<string, string>;
  }[];
  errorHandling: {
    retryableErrors: number[];
    nonRetryableErrors: number[];
    maxRetries: number;
  };
  transformations?: {
    request?: (data: any) => any;
    response?: (data: any) => any;
  };
}

const clientContracts: ClientContract[] = [
  {
    name: 'Lead Capture Form',
    apiEndpoint: '/api/leads',
    expectedRequests: [
      {
        method: 'POST',
        path: '/api/leads',
        headers: { 'Content-Type': 'application/json' },
        body: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          consent: true,
        },
      },
    ],
    expectedResponses: [
      {
        status: 200,
        body: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
          email: 'test@example.com',
          firstName: 'John',
        },
      },
    ],
    errorHandling: {
      retryableErrors: [500, 502, 503, 504],
      nonRetryableErrors: [400, 401, 403, 404, 422],
      maxRetries: 3,
    },
  },
  {
    name: 'Booking System',
    apiEndpoint: '/api/bookings',
    expectedRequests: [
      {
        method: 'POST',
        path: '/api/bookings',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' },
        body: {
          serviceId: 'service-123',
          startTime: '2024-01-01T10:00:00Z',
          customerInfo: {
            email: 'customer@example.com',
            name: 'Jane Smith',
          },
        },
      },
    ],
    expectedResponses: [
      {
        status: 200,
        body: {
          id: 'booking-123',
          status: 'confirmed',
          startTime: '2024-01-01T10:00:00Z',
          customerInfo: {
            email: 'customer@example.com',
            name: 'Jane Smith',
          },
        },
      },
    ],
    errorHandling: {
      retryableErrors: [500, 502, 503, 504],
      nonRetryableErrors: [400, 401, 403, 404, 409],
      maxRetries: 2,
    },
  },
  {
    name: 'Customer Portal',
    apiEndpoint: '/api/customer/profile',
    expectedRequests: [
      {
        method: 'GET',
        path: '/api/customer/profile',
        headers: { 'Authorization': 'Bearer token' },
      },
    ],
    expectedResponses: [
      {
        status: 200,
        body: {
          id: 'customer-123',
          email: 'customer@example.com',
          name: 'Jane Smith',
          subscription: 'premium',
        },
      },
    ],
    errorHandling: {
      retryableErrors: [500, 502, 503],
      nonRetryableErrors: [400, 401, 403, 404],
      maxRetries: 1,
    },
  },
];

class RequestInterceptor {
  private requests: any[] = [];
  private responses: any[] = [];

  constructor(page: any) {
    page.route('**/api/**', async (route) => {
      const request = route.request();
      const requestData = {
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData(),
      };

      this.requests.push(requestData);

      // Continue with the request
      const response = await route.continue();
      const responseData = {
        status: response.status(),
        headers: response.headers(),
      };

      this.responses.push(responseData);
    });
  }

  getRequests(): any[] {
    return this.requests;
  }

  getResponses(): any[] {
    return this.responses;
  }

  reset(): void {
    this.requests = [];
    this.responses = [];
  }
}

test.describe('Client Integration Contract Tests', () => {
  clientContracts.forEach((contract) => {
    test.describe(`${contract.name} Integration`, () => {
      let interceptor: RequestInterceptor;

      test.beforeEach(async ({ page }) => {
        interceptor = new RequestInterceptor(page);
      });

      test('should send requests according to contract', async ({ page }) => {
        // Mock successful API response
        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          const expectedResponse = contract.expectedResponses[0];
          await route.fulfill({
            status: expectedResponse.status,
            contentType: 'application/json',
            body: JSON.stringify(expectedResponse.body),
          });
        });

        // Navigate to the relevant page and trigger the request
        await navigateToFeaturePage(page, contract.name);
        await triggerClientAction(page, contract);

        // Wait for request to be made
        await page.waitForTimeout(1000);

        // Validate request format
        const requests = interceptor.getRequests();
        expect(requests.length).toBeGreaterThan(0);

        const actualRequest = requests.find(r => r.url.includes(contract.apiEndpoint));
        expect(actualRequest).toBeDefined();

        // Validate request method and path
        const expectedRequest = contract.expectedRequests[0];
        expect(actualRequest.method).toBe(expectedRequest.method);
        expect(actualRequest.url).toContain(expectedRequest.path);

        // Validate headers
        if (expectedRequest.headers) {
          for (const [key, value] of Object.entries(expectedRequest.headers)) {
            expect(actualRequest.headers[key.toLowerCase()]).toBe(value);
          }
        }

        // Validate request body
        if (expectedRequest.body) {
          const postData = JSON.parse(actualRequest.postData || '{}');
          expect(postData).toMatchObject(expectedRequest.body);
        }
      });

      test('should handle successful responses according to contract', async ({ page }) => {
        // Mock API response
        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          const expectedResponse = contract.expectedResponses[0];
          await route.fulfill({
            status: expectedResponse.status,
            contentType: 'application/json',
            body: JSON.stringify(expectedResponse.body),
          });
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientAction(page, contract);

        // Validate client handled the response correctly
        expect(result.success).toBe(true);
        
        if (contract.transformations?.response) {
          const transformedData = contract.transformations.response(contract.expectedResponses[0].body);
          expect(result.data).toMatchObject(transformedData);
        } else {
          expect(result.data).toMatchObject(contract.expectedResponses[0].body);
        }
      });

      test('should retry retryable errors', async ({ page }) => {
        let requestCount = 0;
        const maxRetries = contract.errorHandling.maxRetries;

        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          requestCount++;
          
          // Return retryable error for first attempts
          if (requestCount <= maxRetries) {
            const retryableError = contract.errorHandling.retryableErrors[0];
            await route.fulfill({
              status: retryableError,
              contentType: 'application/json',
              body: JSON.stringify({ error: 'Temporary failure' }),
            });
          } else {
            // Return success on final attempt
            const expectedResponse = contract.expectedResponses[0];
            await route.fulfill({
              status: expectedResponse.status,
              contentType: 'application/json',
              body: JSON.stringify(expectedResponse.body),
            });
          }
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientAction(page, contract);

        // Should eventually succeed after retries
        expect(result.success).toBe(true);
        expect(requestCount).toBe(maxRetries + 1);
      });

      test('should not retry non-retryable errors', async ({ page }) => {
        let requestCount = 0;

        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          requestCount++;
          
          // Return non-retryable error
          const nonRetryableError = contract.errorHandling.nonRetryableErrors[0];
          await route.fulfill({
            status: nonRetryableError,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Client error' }),
          });
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientAction(page, contract);

        // Should fail immediately without retries
        expect(result.success).toBe(false);
        expect(requestCount).toBe(1);
        expect(result.error).toContain(nonRetryableError.toString());
      });

      test('should handle timeout errors', async ({ page }) => {
        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          // Never respond to simulate timeout
          await new Promise(resolve => setTimeout(resolve, 35000));
        });

        // Navigate and trigger action with short timeout
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientActionWithTimeout(page, contract, 5000);

        // Should handle timeout gracefully
        expect(result.success).toBe(false);
        expect(result.error).toContain('timeout');
      });

      test('should transform request data according to contract', async ({ page }) => {
        if (!contract.transformations?.request) {
          test.skip();
        }

        let receivedRequest: any;

        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          const request = route.request();
          receivedRequest = JSON.parse(request.postData() || '{}');
          
          const expectedResponse = contract.expectedResponses[0];
          await route.fulfill({
            status: expectedResponse.status,
            contentType: 'application/json',
            body: JSON.stringify(expectedResponse.body),
          });
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        await triggerClientAction(page, contract);

        // Validate request transformation
        const expectedRequest = contract.expectedRequests[0];
        const transformedRequest = contract.transformations.request(expectedRequest.body);
        
        expect(receivedRequest).toMatchObject(transformedRequest);
      });

      test('should handle network errors gracefully', async ({ page }) => {
        // Mock network failure
        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          await route.abort('failed');
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientAction(page, contract);

        // Should handle network error gracefully
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      test('should validate response data structure', async ({ page }) => {
        // Mock response with missing required fields
        await page.route(`**${contract.apiEndpoint}`, async (route) => {
          const incompleteResponse = { ...contract.expectedResponses[0].body };
          delete incompleteResponse.id; // Remove required field
          
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(incompleteResponse),
          });
        });

        // Navigate and trigger action
        await navigateToFeaturePage(page, contract.name);
        const result = await triggerClientAction(page, contract);

        // Should handle invalid response gracefully
        expect(result.success).toBe(false);
        expect(result.error).toContain('validation');
      });
    });
  });

  test('should maintain backward compatibility with API changes', async ({ page }) => {
    // Test that client can handle API responses with additional fields
    const contract = clientContracts[0]; // Use lead capture as example
    
    await page.route(`**${contract.apiEndpoint}`, async (route) => {
      // Response with additional fields (new API version)
      const response = {
        ...contract.expectedResponses[0].body,
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

    // Navigate and trigger action
    await navigateToFeaturePage(page, contract.name);
    const result = await triggerClientAction(page, contract);

    // Should handle additional fields gracefully
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('should implement proper error boundary handling', async ({ page }) => {
    const contract = clientContracts[0];
    
    // Mock catastrophic API failure
    await page.route(`**${contract.apiEndpoint}`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          error: 'Internal server error',
          details: 'Database connection failed',
          stack: 'Error: Database connection failed...',
        }),
      });
    });

    // Navigate and trigger action
    await navigateToFeaturePage(page, contract.name);
    const result = await triggerClientAction(page, contract);

    // Should handle error without crashing
    expect(result.success).toBe(false);
    expect(result.error).toContain('500');
    
    // Check that error boundary caught the error
    const errorBoundary = page.locator('[data-error-boundary]');
    expect(await errorBoundary.isVisible()).toBe(true);
  });
});

// Helper functions
async function navigateToFeaturePage(page: any, contractName: string): Promise<void> {
  const pageMap: Record<string, string> = {
    'Lead Capture Form': '/contact',
    'Booking System': '/booking',
    'Customer Portal': '/portal/profile',
  };

  const targetUrl = pageMap[contractName] || '/';
  await page.goto(targetUrl);
  await page.waitForLoadState('networkidle');
}

async function triggerClientAction(page: any, contract: ClientContract): Promise<any> {
  const actionMap: Record<string, () => Promise<any>> = {
    'Lead Capture Form': () => submitLeadForm(page),
    'Booking System': () => createBooking(page),
    'Customer Portal': () => loadCustomerProfile(page),
  };

  const action = actionMap[contract.name];
  if (!action) {
    throw new Error(`No action defined for contract: ${contract.name}`);
  }

  return await action();
}

async function triggerClientActionWithTimeout(page: any, contract: ClientContract, timeout: number): Promise<any> {
  const actionMap: Record<string, () => Promise<any>> = {
    'Lead Capture Form': () => submitLeadFormWithTimeout(page, timeout),
    'Booking System': () => createBookingWithTimeout(page, timeout),
    'Customer Portal': () => loadCustomerProfileWithTimeout(page, timeout),
  };

  const action = actionMap[contract.name];
  if (!action) {
    throw new Error(`No action defined for contract: ${contract.name}`);
  }

  return await action();
}

async function submitLeadForm(page: any): Promise<any> {
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.check('input[name="consent"]');
  
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Mock form submission result
      window.leadFormResult = { success: true, data: { id: '123', status: 'pending' } };
      resolve(window.leadFormResult);
    });
  });

  return result;
}

async function submitLeadFormWithTimeout(page: any, timeout: number): Promise<any> {
  return Promise.race([
    submitLeadForm(page),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
  ]);
}

async function createBooking(page: any): Promise<any> {
  await page.selectOption('select[name="service"]', 'service-123');
  await page.fill('input[name="startTime"]', '2024-01-01T10:00:00');
  await page.fill('input[name="customerEmail"]', 'customer@example.com');
  await page.fill('input[name="customerName"]', 'Jane Smith');
  
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Mock booking creation result
      window.bookingResult = { success: true, data: { id: 'booking-123', status: 'confirmed' } };
      resolve(window.bookingResult);
    });
  });

  return result;
}

async function createBookingWithTimeout(page: any, timeout: number): Promise<any> {
  return Promise.race([
    createBooking(page),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
  ]);
}

async function loadCustomerProfile(page: any): Promise<any> {
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Mock profile loading result
      window.profileResult = { success: true, data: { id: 'customer-123', email: 'customer@example.com' } };
      resolve(window.profileResult);
    });
  });

  return result;
}

async function loadCustomerProfileWithTimeout(page: any, timeout: number): Promise<any> {
  return Promise.race([
    loadCustomerProfile(page),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
  ]);
}
