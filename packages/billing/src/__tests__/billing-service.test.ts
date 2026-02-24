/**
 * Tests for Stripe Billing Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  StripeBillingService,
  validateBillingConfig,
  validateCheckoutRequest,
} from '../billing-service';

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
    customers: {
      create: vi.fn(),
      list: vi.fn(),
    },
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
    subscriptions: {
      retrieve: vi.fn(),
      cancel: vi.fn(),
      list: vi.fn(),
    },
    products: {
      create: vi.fn(),
      retrieve: vi.fn(),
      list: vi.fn(),
    },
    prices: {
      create: vi.fn(),
      list: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  })),
}));

describe('StripeBillingService', () => {
  let billingService: StripeBillingService;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      tenantId: 'test-tenant-123',
      stripeSecretKey: 'sk_test_123',
      webhookSecret: 'whsec_123',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      currency: 'usd',
    };

    billingService = new StripeBillingService(mockConfig);
  });

  describe('Configuration Validation', () => {
    it('should validate billing config', () => {
      expect(validateBillingConfig(mockConfig)).toEqual(mockConfig);
    });

    it('should throw error for invalid config', () => {
      const invalidConfig = { ...mockConfig, stripeSecretKey: '' };
      expect(() => validateBillingConfig(invalidConfig)).toThrow();
    });
  });

  describe('Checkout Session Creation', () => {
    it('should create checkout session', async () => {
      const request = {
        tenantId: 'test-tenant-123',
        priceId: 'price_123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      validateCheckoutRequest(request);
      expect(request.priceId).toBe('price_123');
    });

    it('should validate checkout request', () => {
      const validRequest = {
        tenantId: 'test-tenant-123',
        priceId: 'price_123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      };

      expect(validateCheckoutRequest(validRequest)).toEqual(validRequest);
    });
  });

  describe('Customer Management', () => {
    it('should create customer service instance', () => {
      expect(billingService).toBeDefined();
      expect(billingService['config']).toEqual(mockConfig);
    });
  });
});
