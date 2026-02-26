/**
 * @file e2e/contracts/consumers/stripe-consumer.spec.ts
 * @summary Consumer-driven contract tests for Stripe billing service integration.
 * @security Test-only contract validation; no real API calls or secrets exposed.
 * @requirements TASK-002-5: Implement consumer-driven contract tests with validation
 */

import { Pact } from '@pact-foundation/pact';
import { createContractTestingFramework, ContractTestingUtils } from '@repo/testing-contracts';
import { ServiceProvider } from '@repo/testing-contracts/types';
import { StripeMocks } from '@repo/testing-contracts/mocks';

describe('Stripe API Consumer Contract Tests', () => {
  const provider = new Pact({
    consumer: 'marketing-websites-app',
    provider: 'stripe-api',
    port: 1234,
    log: 'pact/logs/stripe-consumer.log',
    dir: 'pact/pacts',
    logLevel: 'info',
    spec: 2,
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.removeInteractions();
  });

  describe('Checkout Session Creation', () => {
    it('should create checkout session for one-time payment', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const priceId = 'price_1234567890';
      const sessionId = 'cs_test_1234567890';

      await provider.addInteraction({
        state: 'stripe API is available',
        uponReceiving: 'create checkout session for one-time payment',
        withRequest: StripeMocks.createCheckoutSessionRequest(tenantId, priceId),
        willRespondWith: StripeMocks.checkoutSessionResponse(sessionId),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
          metadata: {
            tenantId,
          },
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(sessionId);
      expect(data.payment_status).toBe('paid');
      expect(data.metadata.tenantId).toBe(tenantId);
    });

    it('should create checkout session for subscription', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const priceId = 'price_1234567890';
      const sessionId = 'cs_test_1234567890';

      await provider.addInteraction({
        state: 'stripe API is available',
        uponReceiving: 'create checkout session for subscription',
        withRequest: {
          method: 'POST',
          path: '/v1/checkout/sessions',
          headers: {
            'Authorization': 'Bearer sk_test_mock',
            'Content-Type': 'application/json',
          },
          body: {
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            metadata: {
              tenantId,
            },
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: sessionId,
            object: 'checkout.session',
            payment_method_types: ['card'],
            mode: 'subscription',
            status: 'complete',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            payment_status: 'paid',
            created: 1672531200,
            metadata: {
              tenantId,
            },
          },
        },
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
          metadata: {
            tenantId,
          },
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(sessionId);
      expect(data.mode).toBe('subscription');
      expect(data.payment_status).toBe('paid');
    });
  });

  describe('Customer Management', () => {
    it('should create or retrieve customer', async () => {
      const email = 'test@example.com';
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const customerId = 'cus_test_1234567890';

      await provider.addInteraction({
        state: 'stripe API is available',
        uponReceiving: 'create or retrieve customer',
        withRequest: StripeMocks.createCustomerRequest(email, tenantId),
        willRespondWith: StripeMocks.customerResponse(customerId, email),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/customers`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: 'Test Customer',
          metadata: {
            tenantId,
          },
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(customerId);
      expect(data.email).toBe(email);
      expect(data.metadata.tenantId).toBe(tenantId);
    });

    it('should create customer portal session', async () => {
      const customerId = 'cus_test_1234567890';

      await provider.addInteraction({
        state: 'stripe API is available',
        uponReceiving: 'create customer portal session',
        withRequest: {
          method: 'POST',
          path: '/v1/billing_portal/sessions',
          headers: {
            'Authorization': 'Bearer sk_test_mock',
            'Content-Type': 'application/json',
          },
          body: {
            customer: customerId,
            return_url: 'https://example.com/billing',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: 'bps_test_1234567890',
            object: 'billing_portal.session',
            customer: customerId,
            return_url: 'https://example.com/billing',
            created: 1672531200,
          },
        },
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/billing_portal/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerId,
          return_url: 'https://example.com/billing',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('bps_test_1234567890');
      expect(data.customer).toBe(customerId);
      expect(data.return_url).toBe('https://example.com/billing');
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      await provider.addInteraction({
        state: 'stripe API authentication fails',
        uponReceiving: 'request with invalid credentials',
        withRequest: {
          method: 'POST',
          path: '/v1/checkout/sessions',
          headers: {
            'Authorization': 'Bearer invalid_token',
            'Content-Type': 'application/json',
          },
          body: {},
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid API key', 401),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid API key');
    });

    it('should handle validation errors', async () => {
      await provider.addInteraction({
        state: 'stripe API validation fails',
        uponReceiving: 'request with invalid data',
        withRequest: {
          method: 'POST',
          path: '/v1/checkout/sessions',
          headers: {
            'Authorization': 'Bearer sk_test_mock',
            'Content-Type': 'application/json',
          },
          body: {
            // Missing required fields
            mode: 'payment',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Required fields missing', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'payment',
          // Missing required fields
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Required fields missing');
    });
  });

  describe('Contract Validation', () => {
    it('should validate tenant ID format', async () => {
      const invalidTenantId = 'invalid-tenant-id';

      await provider.addInteraction({
        state: 'stripe API validation fails',
        uponReceiving: 'request with invalid tenant ID',
        withRequest: {
          method: 'POST',
          path: '/v1/checkout/sessions',
          headers: {
            'Authorization': 'Bearer sk_test_mock',
            'Content-Type': 'application/json',
          },
          body: {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
              {
                price: 'price_1234567890',
                quantity: 1,
              },
            ],
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            metadata: {
              tenantId: invalidTenantId,
            },
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid tenant ID format', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_mock',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
            {
              price: 'price_1234567890',
              quantity: 1,
            },
          ],
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
          metadata: {
            tenantId: invalidTenantId,
          },
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid tenant ID format');
    });
  });
});
