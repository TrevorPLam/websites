import { test, expect } from '@playwright/test';

/**
 * Stripe API Chaos Tests
 * 
 * Tests system resilience under various Stripe API failure scenarios
 * Including rate limiting, timeouts, and service degradation
 */

class StripeChaosInjector {
  private activeFaults = new Map<string, any>();

  injectFault(type: string, config: any) {
    this.activeFaults.set(type, config);
  }

  clearFaults() {
    this.activeFaults.clear();
  }

  shouldInjectFault(type: string): boolean {
    const fault = this.activeFaults.get(type);
    return fault && Math.random() < (fault.probability || 1.0);
  }

  getFaultConfig(type: string) {
    return this.activeFaults.get(type);
  }
}

class MockStripeAPI {
  private requestCount = 0;
  private lastRequestTime = 0;

  async createPaymentIntent(data: any): Promise<any> {
    this.requestCount++;
    const now = Date.now();

    // Simulate rate limiting
    if (now - this.lastRequestTime < 100) {
      throw new Error('Rate limit exceeded');
    }
    this.lastRequestTime = now;

    // Simulate API response
    return {
      id: `pi_${Date.now()}`,
      status: 'requires_payment_method',
      amount: data.amount,
      currency: data.currency,
      created: Math.floor(Date.now() / 1000),
    };
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<any> {
    this.requestCount++;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 2000,
      currency: 'usd',
    };
  }

  async retrieveCustomer(customerId: string): Promise<any> {
    this.requestCount++;
    
    return {
      id: customerId,
      email: 'test@example.com',
      name: 'Test Customer',
      created: Math.floor(Date.now() / 1000),
    };
  }

  getRequestCount(): number {
    return this.requestCount;
  }

  reset() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }
}

test.describe('Stripe API Chaos Tests', () => {
  let chaosInjector: StripeChaosInjector;
  let mockStripeAPI: MockStripeAPI;

  test.beforeEach(() => {
    chaosInjector = new StripeChaosInjector();
    mockStripeAPI = new MockStripeAPI();
  });

  test.afterEach(() => {
    chaosInjector.clearFaults();
    mockStripeAPI.reset();
  });

  test('should handle Stripe API rate limiting gracefully', async ({ page }) => {
    // Inject rate limiting fault
    chaosInjector.injectFault('rate_limit', {
      probability: 0.7,
      requestsPerSecond: 10,
    });

    // Navigate to payment page
    await page.goto('/portal/billing/upgrade');
    await page.waitForLoadState('networkidle');

    // Mock Stripe API with rate limiting
    await page.route('**/api/stripe/payment-intent', async (route) => {
      if (chaosInjector.shouldInjectFault('rate_limit')) {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'Rate limit exceeded',
              type: 'rate_limit_error',
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'pi_test123',
            status: 'requires_payment_method',
          }),
        });
      }
    });

    // Attempt multiple payment operations
    const results = [];
    for (let i = 0; i < 20; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/stripe/payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 2000, currency: 'usd' }),
          }).then(r => r.json());
        });

        results.push({ success: true, data: response });
      } catch (error: unknown) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      // Small delay between requests
      await page.waitForTimeout(50);
    }

    // Analyze rate limiting impact
    const successful = results.filter(r => r.success).length;
    const rateLimited = results.filter(r => 
      !r.success && r.error?.includes('rate limit')
    ).length;

    expect(successful).toBeGreaterThan(0);
    expect(rateLimited).toBeGreaterThan(0);
    expect(successful + rateLimited).toBe(20);
  });

  test('should implement exponential backoff for Stripe failures', async ({ page }) => {
    // Inject intermittent failures
    chaosInjector.injectFault('intermittent_failure', {
      probability: 0.6,
      maxRetries: 3,
    });

    let requestCount = 0;
    
    await page.route('**/api/stripe/**', async (route) => {
      requestCount++;
      
      if (chaosInjector.shouldInjectFault('intermittent_failure') && requestCount <= 3) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { message: 'Internal server error' },
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

    // Test retry logic with exponential backoff
    const executeWithRetry = async (): Promise<any> => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await page.evaluate(() => {
            return fetch('/api/stripe/customer', {
              method: 'GET',
            }).then(r => r.json());
          });
          
          return response;
        } catch (error: unknown) {
          if (attempt === 3) {
            throw error;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await page.waitForTimeout(delay);
        }
      }
    };

    const result = await executeWithRetry();
    
    expect(result.success).toBe(true);
    expect(requestCount).toBeGreaterThan(1);
    expect(requestCount).toBeLessThanOrEqual(4);
  });

  test('should handle Stripe service timeouts', async ({ page }) => {
    // Inject timeout fault
    chaosInjector.injectFault('timeout', {
      probability: 0.8,
      timeoutMs: 30000,
    });

    await page.route('**/api/stripe/payment-intent', async (route) => {
      if (chaosInjector.shouldInjectFault('timeout')) {
        // Simulate timeout by delaying response
        await new Promise(resolve => setTimeout(resolve, 35000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'pi_timeout' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'pi_success' }),
        });
      }
    });

    // Test timeout handling
    const startTime = Date.now();
    
    try {
      await page.evaluate(() => {
        return fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 2000 }),
        }).then(r => r.json());
      });
    } catch (error: unknown) {
      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThan(30000);
      expect(duration).toBeLessThan(40000);
    }
  });

  test('should maintain service during Stripe degradation', async ({ page }) => {
    // Inject partial service degradation
    chaosInjector.injectFault('partial_degradation', {
      probability: 0.3,
      responseTimeIncrease: 2000,
    });

    await page.route('**/api/stripe/**', async (route) => {
      if (chaosInjector.shouldInjectFault('partial_degradation')) {
        // Add delay to simulate degradation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Monitor performance during degradation
    const metrics = {
      responseTimes: [] as number[],
      successCount: 0,
      degradedCount: 0,
    };

    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      
      try {
        await page.evaluate(() => {
          return fetch('/api/stripe/balance').then(r => r.json());
        });
        
        const responseTime = performance.now() - startTime;
        metrics.responseTimes.push(responseTime);
        metrics.successCount++;
        
        if (responseTime > 1500) {
          metrics.degradedCount++;
        }
      } catch (error: unknown) {
        // Handle errors
      }
    }

    expect(metrics.successCount).toBe(10);
    expect(metrics.degradedCount).toBeGreaterThan(0);
    expect(metrics.degradedCount).toBeLessThan(10);
    
    const avgResponseTime = metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
    expect(avgResponseTime).toBeGreaterThan(500);
  });

  test('should handle Stripe webhook delivery failures', async ({ page }) => {
    // Inject webhook delivery failures
    chaosInjector.injectFault('webhook_failure', {
      probability: 0.5,
      failureTypes: ['timeout', 'connection_error', 'invalid_signature'],
    });

    await page.route('**/api/webhooks/stripe', async (route) => {
      if (chaosInjector.shouldInjectFault('webhook_failure')) {
        const config = chaosInjector.getFaultConfig('webhook_failure');
        const failureType = config.failureTypes[Math.floor(Math.random() * config.failureTypes.length)];
        
        switch (failureType) {
          case 'timeout':
            await new Promise(resolve => setTimeout(resolve, 35000));
            break;
          case 'connection_error':
            await route.fulfill({
              status: 503,
              contentType: 'application/json',
              body: JSON.stringify({ error: 'Service unavailable' }),
            });
            return;
          case 'invalid_signature':
            await route.fulfill({
              status: 401,
              contentType: 'application/json',
              body: JSON.stringify({ error: 'Invalid signature' }),
            });
            return;
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ received: true }),
      });
    });

    // Test webhook delivery
    const webhookResults = [];
    
    for (let i = 0; i < 10; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/webhooks/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Stripe-Signature': 'test_signature',
            },
            body: JSON.stringify({
              type: 'payment_intent.succeeded',
              data: { object: { id: 'pi_test123' } },
            }),
          }).then(r => r.json());
        });

        webhookResults.push({ success: true, response });
      } catch (error: unknown) {
        webhookResults.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }

    // Analyze webhook delivery results
    const successful = webhookResults.filter(r => r.success).length;
    const failed = webhookResults.filter(r => !r.success).length;

    expect(successful).toBeGreaterThan(0);
    expect(failed).toBeGreaterThan(0);
    expect(successful + failed).toBe(10);
  });

  test('should implement circuit breaker for Stripe API', async ({ page }) => {
    let failureCount = 0;
    const failureThreshold = 3;
    let circuitOpen = false;

    await page.route('**/api/stripe/**', async (route) => {
      if (circuitOpen) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Circuit breaker open' }),
        });
        return;
      }

      failureCount++;
      
      if (failureCount >= failureThreshold) {
        circuitOpen = true;
        // Close circuit after some time
        setTimeout(() => {
          circuitOpen = false;
          failureCount = 0;
        }, 10000);
      }

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service error' }),
      });
    });

    // Test circuit breaker behavior
    const results = [];
    
    // Trigger failures to open circuit
    for (let i = 0; i < 5; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/stripe/customer').then(r => r.json());
        });
        results.push({ success: true, response });
      } catch (error: unknown) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }

    // Should have circuit breaker responses after threshold
    const circuitBreakerResponses = results.filter(r => 
      !r.success && r.error?.includes('Circuit breaker open')
    ).length;

    expect(circuitBreakerResponses).toBeGreaterThan(0);
    expect(failureCount).toBeGreaterThanOrEqual(failureThreshold);
  });
});
