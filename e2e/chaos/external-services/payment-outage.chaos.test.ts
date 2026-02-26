import { test, expect } from '@playwright/test';

/**
 * External Service Outage Chaos Tests
 * 
 * Tests system resilience during external service outages including:
 * - Email service failures (Resend, SendGrid)
 * - CRM integration failures (HubSpot)
 * - Analytics service failures
 * - Webhook delivery failures
 * - Third-party API failures
 */

/**
 * External Service Chaos Injector
 * 
 * Manages fault injection for various external services
 */
class ExternalServiceChaosInjector {
  private activeFaults = new Map<string, any>();

  injectFault(service: string, config: any) {
    this.activeFaults.set(service, config);
  }

  clearFaults() {
    this.activeFaults.clear();
  }

  shouldInjectFault(service: string): boolean {
    const fault = this.activeFaults.get(service);
    return fault && Math.random() < (fault.probability || 1.0);
  }

  getFaultConfig(service: string) {
    return this.activeFaults.get(service);
  }
}

/**
 * Mock Email Service (Resend/SendGrid)
 */
class MockEmailService {
  private sentEmails = 0;
  private failedEmails = 0;

  async sendEmail(data: any): Promise<any> {
    this.sentEmails++;
    
    return {
      id: `email_${Date.now()}_${this.sentEmails}`,
      status: 'sent',
      to: data.to,
      subject: data.subject,
      sentAt: new Date().toISOString(),
    };
  }

  async sendBulkEmail(emails: any[]): Promise<any> {
    const results = [];
    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push({ success: true, result });
      } catch (error) {
        this.failedEmails++;
        results.push({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
    return results;
  }

  getStats() {
    return {
      sentEmails: this.sentEmails,
      failedEmails: this.failedEmails,
      totalAttempts: this.sentEmails + this.failedEmails,
    };
  }

  reset() {
    this.sentEmails = 0;
    this.failedEmails = 0;
  }
}

/**
 * Mock CRM Service (HubSpot)
 */
class MockCRMService {
  private contacts = new Map<string, any>();
  private deals = new Map<string, any>();

  async createContact(data: any): Promise<any> {
    const contactId = `contact_${Date.now()}`;
    const contact = {
      id: contactId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.contacts.set(contactId, contact);
    return contact;
  }

  async updateContact(contactId: string, data: any): Promise<any> {
    const contact = this.contacts.get(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contact,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    this.contacts.set(contactId, updatedContact);
    return updatedContact;
  }

  async createDeal(data: any): Promise<any> {
    const dealId = `deal_${Date.now()}`;
    const deal = {
      id: dealId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.deals.set(dealId, deal);
    return deal;
  }

  getStats() {
    return {
      totalContacts: this.contacts.size,
      totalDeals: this.deals.size,
    };
  }

  reset() {
    this.contacts.clear();
    this.deals.clear();
  }
}

/**
 * Mock Analytics Service
 */
class MockAnalyticsService {
  private events = new Map<string, any[]>();
  private failedEvents = 0;

  async trackEvent(event: any): Promise<any> {
    const eventName = event.name;
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
      id: `event_${Date.now()}_${Math.random()}`,
    };
    
    this.events.get(eventName)!.push(eventWithTimestamp);
    return eventWithTimestamp;
  }

  async trackBatchEvents(events: any[]): Promise<any> {
    const results = [];
    for (const event of events) {
      try {
        const result = await this.trackEvent(event);
        results.push({ success: true, result });
      } catch (error) {
        this.failedEvents++;
        results.push({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
    return results;
  }

  getStats() {
    const totalEvents = Array.from(this.events.values()).reduce((sum, events) => sum + events.length, 0);
    return {
      totalEvents,
      failedEvents: this.failedEvents,
      eventTypes: this.events.size,
    };
  }

  reset() {
    this.events.clear();
    this.failedEvents = 0;
  }
}

test.describe('External Service Outage Chaos Tests', () => {
  let chaosInjector: ExternalServiceChaosInjector;
  let emailService: MockEmailService;
  let crmService: MockCRMService;
  let analyticsService: MockAnalyticsService;

  test.beforeEach(() => {
    chaosInjector = new ExternalServiceChaosInjector();
    emailService = new MockEmailService();
    crmService = new MockCRMService();
    analyticsService = new MockAnalyticsService();
  });

  test.afterEach(() => {
    chaosInjector.clearFaults();
    emailService.reset();
    crmService.reset();
    analyticsService.reset();
  });

  test('should handle email service outage gracefully', async ({ page }) => {
    // Inject email service outage
    chaosInjector.injectFault('email_service', {
      probability: 0.7,
      outageType: 'service_unavailable',
      duration: 30000,
    });

    // Mock email API endpoints
    await page.route('**/api/email/send', async (route) => {
      if (chaosInjector.shouldInjectFault('email_service')) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Email service temporarily unavailable',
            code: 'SERVICE_OUTAGE',
          }),
        });
      } else {
        // Simulate successful email send
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: `email_${Date.now()}`,
            status: 'sent',
          }),
        });
      }
    });

    // Test email sending during outage
    const emailResults = [];
    
    for (let i = 0; i < 10; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: 'test@example.com',
              subject: `Test Email ${i}`,
              body: 'This is a test email',
            }),
          }).then(r => r.json());
        });

        emailResults.push({ success: true, response });
      } catch (error: unknown) {
        emailResults.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      // Small delay between requests
      await page.waitForTimeout(100);
    }

    // Analyze outage impact
    const successful = emailResults.filter(r => r.success).length;
    const failed = emailResults.filter(r => !r.success).length;
    const serviceUnavailable = emailResults.filter(r => 
      !r.success && r.response?.code === 'SERVICE_OUTAGE'
    ).length;

    expect(successful).toBeGreaterThan(0); // Some should succeed
    expect(failed).toBeGreaterThan(0); // Some should fail during outage
    expect(serviceUnavailable).toBeGreaterThan(0); // Service outage errors should occur
    expect(successful + failed).toBe(10); // All attempts accounted for
  });

  test('should implement email service circuit breaker', async ({ page }) => {
    let failureCount = 0;
    const failureThreshold = 3;
    let circuitOpen = false;

    // Inject consecutive failures to trigger circuit breaker
    chaosInjector.injectFault('email_circuit_breaker', {
      probability: 1.0,
      failureThreshold,
      recoveryTime: 10000,
    });

    await page.route('**/api/email/send', async (route) => {
      if (circuitOpen) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Circuit breaker open - email service unavailable',
            code: 'CIRCUIT_BREAKER_OPEN',
          }),
        });
        return;
      }

      failureCount++;
      
      if (failureCount >= failureThreshold) {
        circuitOpen = true;
        // Close circuit after recovery time
        setTimeout(() => {
          circuitOpen = false;
          failureCount = 0;
        }, 10000);
      }

      // Simulate service failure
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        }),
      });
    });

    // Test circuit breaker behavior
    const results = [];
    
    // Trigger failures to open circuit
    for (let i = 0; i < 5; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: 'test@example.com',
              subject: `Test Email ${i}`,
            }),
          }).then(r => r.json());
        });
        
        results.push({ success: true, response });
      } catch (error: unknown) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      await page.waitForTimeout(100);
    }

    // Should have circuit breaker responses after threshold
    const circuitBreakerResponses = results.filter(r => 
      !r.success && r.error?.includes('Circuit breaker open')
    ).length;

    expect(circuitBreakerResponses).toBeGreaterThan(0);
    expect(failureCount).toBeGreaterThanOrEqual(failureThreshold);
  });

  test('should handle CRM service outage with data consistency', async ({ page }) => {
    // Inject CRM service outage
    chaosInjector.injectFault('crm_service', {
      probability: 0.6,
      outageType: 'intermittent_failure',
      dataCorruptionRisk: 0.1, // 10% chance of data corruption
    });

    await page.route('**/api/crm/contact', async (route) => {
      if (chaosInjector.shouldInjectFault('crm_service')) {
        const config = chaosInjector.getFaultConfig('crm_service');
        
        // Simulate data corruption risk
        if (Math.random() < config.dataCorruptionRisk) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'corrupted_contact',
              name: undefined, // Corrupted data
              email: null, // Corrupted data
              createdAt: 'invalid-date',
            }),
          });
          return;
        }

        // Simulate service outage
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'CRM service unavailable',
            code: 'CRM_OUTAGE',
          }),
        });
      } else {
        // Normal response
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: `contact_${Date.now()}`,
            name: 'Test Contact',
            email: 'test@example.com',
            createdAt: new Date().toISOString(),
          }),
        });
      }
    });

    // Test CRM operations during outage
    const crmResults = [];
    
    for (let i = 0; i < 15; i++) {
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/crm/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `Test Contact ${i}`,
              email: `test${i}@example.com`,
            }),
          }).then(r => r.json());
        });

        // Validate data consistency
        const isValid = response.id && response.name && response.email && response.createdAt;
        crmResults.push({ 
          success: true, 
          response,
          dataValid: isValid,
        });
      } catch (error: unknown) {
        crmResults.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      await page.waitForTimeout(50);
    }

    // Analyze CRM outage impact
    const successful = crmResults.filter(r => r.success).length;
    const failed = crmResults.filter(r => !r.success).length;
    const dataCorrupted = crmResults.filter(r => r.success && !r.dataValid).length;
    const serviceOutage = crmResults.filter(r => 
      !r.success && r.error?.includes('CRM_OUTAGE')
    ).length;

    expect(successful).toBeGreaterThan(0);
    expect(failed).toBeGreaterThan(0);
    expect(serviceOutage).toBeGreaterThan(0);
    expect(dataCorrupted).toBeLessThan(3); // Should have minimal data corruption
    
    // Verify data consistency measures
    const validDataRate = (successful - dataCorrupted) / successful;
    expect(validDataRate).toBeGreaterThan(0.9); // At least 90% data consistency
  });

  test('should maintain analytics during service degradation', async ({ page }) => {
    // Inject analytics service degradation
    chaosInjector.injectFault('analytics_service', {
      probability: 0.4,
      degradationType: 'slow_response',
      responseTimeIncrease: 2000, // 2 second delay
      dataLossRisk: 0.05, // 5% chance of data loss
    });

    await page.route('**/api/analytics/track', async (route) => {
      if (chaosInjector.shouldInjectFault('analytics_service')) {
        const config = chaosInjector.getFaultConfig('analytics_service');
        
        // Simulate data loss
        if (Math.random() < config.dataLossRisk) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'Event lost during transmission',
            }),
          });
          return;
        }

        // Simulate slow response
        await new Promise(resolve => setTimeout(resolve, config.responseTimeIncrease));
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            eventId: `event_${Date.now()}`,
          }),
        });
      } else {
        // Normal response
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            eventId: `event_${Date.now()}`,
          }),
        });
      }
    });

    // Test analytics tracking during degradation
    const analyticsResults = [];
    const responseTimes = [];
    
    for (let i = 0; i < 20; i++) {
      const startTime = performance.now();
      
      try {
        const response = await page.evaluate(() => {
          return fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'page_view',
              properties: {
                page: '/dashboard',
                userId: 'user_123',
              },
            }),
          }).then(r => r.json());
        });

        const responseTime = performance.now() - startTime;
        responseTimes.push(responseTime);
        
        analyticsResults.push({ 
          success: true, 
          response,
          responseTime,
        });
      } catch (error: unknown) {
        analyticsResults.push({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      await page.waitForTimeout(25);
    }

    // Analyze analytics degradation impact
    const successful = analyticsResults.filter(r => r.success).length;
    const failed = analyticsResults.filter(r => !r.success).length;
    const dataLost = analyticsResults.filter(r => 
      r.success && r.response?.success === false
    ).length;
    const slowResponses = analyticsResults.filter(r => 
      r.success && r.responseTime > 1500 // More than 1.5 seconds
    ).length;

    expect(successful).toBeGreaterThan(0);
    expect(dataLost).toBeLessThan(2); // Minimal data loss
    expect(slowResponses).toBeGreaterThan(0); // Some slow responses during degradation
    
    // Verify performance impact
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeGreaterThan(200); // Some degradation expected
    expect(avgResponseTime).toBeLessThan(2000); // But not too severe
  });

  test('should handle webhook delivery failures with retry logic', async ({ page }) => {
    // Inject webhook delivery failures
    chaosInjector.injectFault('webhook_delivery', {
      probability: 0.5,
      failureTypes: ['timeout', 'connection_error', 'invalid_signature'],
      retryAttempts: 3,
    });

    await page.route('**/api/webhooks/stripe', async (route) => {
      if (chaosInjector.shouldInjectFault('webhook_delivery')) {
        const config = chaosInjector.getFaultConfig('webhook_delivery');
        const failureType = config.failureTypes[Math.floor(Math.random() * config.failureTypes.length)];
        
        switch (failureType) {
          case 'timeout':
            // Simulate timeout by not responding
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

    // Test webhook delivery with retry logic
    const webhookResults = [];
    
    for (let i = 0; i < 12; i++) {
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
              data: { object: { id: `pi_test_${i}` } },
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

      await page.waitForTimeout(100);
    }

    // Analyze webhook delivery results
    const successful = webhookResults.filter(r => r.success).length;
    const failed = webhookResults.filter(r => !r.success).length;
    const timeouts = webhookResults.filter(r => 
      !r.success && r.error?.includes('timeout')
    ).length;
    const authFailures = webhookResults.filter(r => 
      !r.success && r.error?.includes('Invalid signature')
    ).length;

    expect(successful).toBeGreaterThan(0);
    expect(failed).toBeGreaterThan(0);
    expect(timeouts + authFailures).toBeGreaterThan(0);
    
    // Verify retry logic effectiveness
    const successRate = successful / (successful + failed);
    expect(successRate).toBeGreaterThan(0.5); // At least 50% success rate with retries
  });

  test('should implement graceful degradation across multiple services', async ({ page }) => {
    // Inject multiple service failures simultaneously
    chaosInjector.injectFault('email_service', { probability: 0.3, outageType: 'service_unavailable' });
    chaosInjector.injectFault('crm_service', { probability: 0.2, outageType: 'slow_response' });
    chaosInjector.injectFault('analytics_service', { probability: 0.4, outageType: 'data_loss' });

    // Setup mock routes for all services
    await page.route('**/api/email/send', async (route) => {
      if (chaosInjector.shouldInjectFault('email_service')) {
        await route.fulfill({ status: 503, body: '{"error":"Email unavailable"}' });
      } else {
        await route.fulfill({ status: 200, body: '{"id":"email_sent"}' });
      }
    });

    await page.route('**/api/crm/contact', async (route) => {
      if (chaosInjector.shouldInjectFault('crm_service')) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Slow response
        await route.fulfill({ status: 200, body: '{"id":"contact_created"}' });
      } else {
        await route.fulfill({ status: 200, body: '{"id":"contact_created"}' });
      }
    });

    await page.route('**/api/analytics/track', async (route) => {
      if (chaosInjector.shouldInjectFault('analytics_service')) {
        await route.fulfill({ status: 200, body: '{"success":false,"error":"Data lost"}' });
      } else {
        await route.fulfill({ status: 200, body: '{"success":true,"eventId":"event_123"}' });
      }
    });

    // Test system behavior with multiple service issues
    const systemMetrics = {
      emailOperations: { success: 0, failed: 0 },
      crmOperations: { success: 0, failed: 0 },
      analyticsOperations: { success: 0, failed: 0 },
      totalResponseTime: 0,
      operationCount: 0,
    };

    // Execute mixed operations
    for (let i = 0; i < 15; i++) {
      const startTime = performance.now();

      // Test email operation
      try {
        const emailResponse = await page.evaluate(() => {
          return fetch('/api/email/send', {
            method: 'POST',
            body: JSON.stringify({ to: 'test@example.com', subject: 'Test' }),
          }).then(r => r.json());
        });
        systemMetrics.emailOperations.success++;
      } catch {
        systemMetrics.emailOperations.failed++;
      }

      // Test CRM operation
      try {
        const crmResponse = await page.evaluate(() => {
          return fetch('/api/crm/contact', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
          }).then(r => r.json());
        });
        systemMetrics.crmOperations.success++;
      } catch {
        systemMetrics.crmOperations.failed++;
      }

      // Test analytics operation
      try {
        const analyticsResponse = await page.evaluate(() => {
          return fetch('/api/analytics/track', {
            method: 'POST',
            body: JSON.stringify({ event: 'test', properties: {} }),
          }).then(r => r.json());
        });
        if (analyticsResponse.success) {
          systemMetrics.analyticsOperations.success++;
        } else {
          systemMetrics.analyticsOperations.failed++;
        }
      } catch {
        systemMetrics.analyticsOperations.failed++;
      }

      const responseTime = performance.now() - startTime;
      systemMetrics.totalResponseTime += responseTime;
      systemMetrics.operationCount++;

      await page.waitForTimeout(50);
    }

    // Analyze system resilience
    const totalOperations = systemMetrics.emailOperations.success + systemMetrics.emailOperations.failed +
                          systemMetrics.crmOperations.success + systemMetrics.crmOperations.failed +
                          systemMetrics.analyticsOperations.success + systemMetrics.analyticsOperations.failed;
    
    const totalSuccessful = systemMetrics.emailOperations.success + systemMetrics.crmOperations.success + 
                           systemMetrics.analyticsOperations.success;
    
    const totalFailed = totalOperations - totalSuccessful;
    const avgResponseTime = systemMetrics.totalResponseTime / systemMetrics.operationCount;
    const systemSuccessRate = totalSuccessful / totalOperations;

    // System should maintain partial functionality
    expect(systemSuccessRate).toBeGreaterThan(0.4); // At least 40% success rate
    expect(totalSuccessful).toBeGreaterThan(0); // Some operations should succeed
    expect(totalFailed).toBeGreaterThan(0); // Some operations should fail
    expect(avgResponseTime).toBeLessThan(5000); // Response times should be reasonable

    // Individual service resilience
    const emailSuccessRate = systemMetrics.emailOperations.success / 
                           (systemMetrics.emailOperations.success + systemMetrics.emailOperations.failed);
    const crmSuccessRate = systemMetrics.crmOperations.success / 
                          (systemMetrics.crmOperations.success + systemMetrics.crmOperations.failed);
    const analyticsSuccessRate = systemMetrics.analyticsOperations.success / 
                               (systemMetrics.analyticsOperations.success + systemMetrics.analyticsOperations.failed);

    // Each service should maintain some level of functionality
    expect(emailSuccessRate).toBeGreaterThan(0.5);
    expect(crmSuccessRate).toBeGreaterThan(0.6);
    expect(analyticsSuccessRate).toBeGreaterThan(0.3);
  });
});
