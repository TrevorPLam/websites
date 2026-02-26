/**
 * @file packages/testing-contracts/src/mocks.ts
 * @summary Mock data generators for external service integrations in contract testing.
 * @security Test-only mocks; no real data or secrets exposed.
 * @requirements TASK-002-1: Create contract testing framework foundation
 */

import { ContractRequest, ContractResponse } from './index';
import { ServiceProvider } from './types';

// Stripe billing service mocks
export const StripeMocks = {
  /**
   * Mock checkout session creation request
   */
  createCheckoutSessionRequest: (tenantId: string, priceId: string): ContractRequest => ({
    method: 'POST',
    path: '/v1/checkout/sessions',
    headers: {
      Authorization: 'Bearer sk_test_mock',
      'Content-Type': 'application/json',
    },
    body: {
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
    },
  }),

  /**
   * Mock checkout session response
   */
  checkoutSessionResponse: (sessionId: string): ContractResponse => ({
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      id: sessionId,
      object: 'checkout.session',
      payment_method_types: ['card'],
      mode: 'payment',
      status: 'complete',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      payment_status: 'paid',
      created: Math.floor(Date.now() / 1000),
    },
  }),

  /**
   * Mock customer creation request
   */
  createCustomerRequest: (email: string, tenantId: string): ContractRequest => ({
    method: 'POST',
    path: '/v1/customers',
    headers: {
      Authorization: 'Bearer sk_test_mock',
      'Content-Type': 'application/json',
    },
    body: {
      email,
      metadata: {
        tenantId,
      },
    },
  }),

  /**
   * Mock customer response
   */
  customerResponse: (customerId: string, email: string): ContractResponse => ({
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      id: customerId,
      object: 'customer',
      email,
      created: Math.floor(Date.now() / 1000),
    },
  }),
};

// Supabase database service mocks
export const SupabaseMocks = {
  /**
   * Mock lead insertion request
   */
  insertLeadRequest: (leadData: any): ContractRequest => ({
    method: 'POST',
    path: '/rest/v1/leads',
    headers: {
      Authorization: 'Bearer mock_supabase_key',
      apikey: process.env.SUPABASE_MOCK_KEY || 'mock_supabase_key_placeholder',
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: leadData,
  }),

  /**
   * Mock lead insertion response
   */
  insertLeadResponse: (): ContractResponse => ({
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: null, // Supabase returns null for minimal response
  }),

  /**
   * Mock lead query request
   */
  queryLeadsRequest: (tenantId: string): ContractRequest => ({
    method: 'GET',
    path: '/rest/v1/leads',
    headers: {
      Authorization: 'Bearer mock_supabase_key',
      apikey: process.env.SUPABASE_MOCK_KEY || 'mock_supabase_key_placeholder',
    },
    query: {
      tenant_id: `eq.${tenantId}`,
      order: 'created_at.desc',
    },
  }),

  /**
   * Mock lead query response
   */
  queryLeadsResponse: (leads: any[]): ContractResponse => ({
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: leads,
  }),
};

// Resend email service mocks
export const ResendMocks = {
  /**
   * Mock email send request
   */
  sendEmailRequest: (to: string, subject: string, html: string): ContractRequest => ({
    method: 'POST',
    path: '/emails',
    headers: {
      Authorization: 'Bearer re_mock_api_key',
      'Content-Type': 'application/json',
    },
    body: {
      from: 'noreply@example.com',
      to,
      subject,
      html,
    },
  }),

  /**
   * Mock email send response
   */
  sendEmailResponse: (emailId: string): ContractResponse => ({
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      id: emailId,
      object: 'email',
    },
  }),
};

// ConvertKit email service mocks
export const ConvertKitMocks = {
  /**
   * Mock subscriber add request
   */
  addSubscriberRequest: (email: string, formId: string): ContractRequest => ({
    method: 'POST',
    path: `/v3/forms/${formId}/subscribe`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email,
    },
  }),

  /**
   * Mock subscriber add response
   */
  addSubscriberResponse: (subscriberId: string): ContractResponse => ({
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      subscriber: {
        id: subscriberId,
        email: 'test@example.com',
        state: 'active',
        created_at: new Date().toISOString(),
      },
    },
  }),
};

// Generic error responses
export const ErrorMocks = {
  /**
   * Mock authentication error response
   */
  authenticationError: (message: string = 'Unauthorized'): ContractResponse => ({
    status: 401,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      error: {
        message,
        type: 'authentication_error',
        code: 401,
      },
    },
  }),

  /**
   * Mock validation error response
   */
  validationError: (errors: string[]): ContractResponse => ({
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      error: {
        message: 'Validation failed',
        type: 'validation_error',
        code: 400,
        errors,
      },
    },
  }),

  /**
   * Mock rate limit error response
   */
  rateLimitError: (retryAfter: number = 60): ContractResponse => ({
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString(),
    },
    body: {
      error: {
        message: 'Rate limit exceeded',
        type: 'rate_limit_error',
        code: 429,
        retry_after: retryAfter,
      },
    },
  }),

  /**
   * Mock server error response
   */
  serverError: (message: string = 'Internal server error'): ContractResponse => ({
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      error: {
        message,
        type: 'server_error',
        code: 500,
      },
    },
  }),
};

// Mock factory functions
export const MockFactory = {
  /**
   * Generate mock request for specific service
   */
  generateRequest: (provider: ServiceProvider, operation: string, params: any): ContractRequest => {
    switch (provider) {
      case ServiceProvider.STRIPE:
        switch (operation) {
          case 'createCheckoutSession':
            return StripeMocks.createCheckoutSessionRequest(params.tenantId, params.priceId);
          case 'createCustomer':
            return StripeMocks.createCustomerRequest(params.email, params.tenantId);
          default:
            throw new Error(`Unknown Stripe operation: ${operation}`);
        }
      case ServiceProvider.SUPABASE:
        switch (operation) {
          case 'insertLead':
            return SupabaseMocks.insertLeadRequest(params.leadData);
          case 'queryLeads':
            return SupabaseMocks.queryLeadsRequest(params.tenantId);
          default:
            throw new Error(`Unknown Supabase operation: ${operation}`);
        }
      case ServiceProvider.RESEND:
        switch (operation) {
          case 'sendEmail':
            return ResendMocks.sendEmailRequest(params.to, params.subject, params.html);
          default:
            throw new Error(`Unknown Resend operation: ${operation}`);
        }
      case ServiceProvider.CONVERTKIT:
        switch (operation) {
          case 'addSubscriber':
            return ConvertKitMocks.addSubscriberRequest(params.email, params.formId);
          default:
            throw new Error(`Unknown ConvertKit operation: ${operation}`);
        }
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  },

  /**
   * Generate mock response for specific service
   */
  generateResponse: (
    provider: ServiceProvider,
    operation: string,
    params: any
  ): ContractResponse => {
    switch (provider) {
      case ServiceProvider.STRIPE:
        switch (operation) {
          case 'createCheckoutSession':
            return StripeMocks.checkoutSessionResponse(params.sessionId);
          case 'createCustomer':
            return StripeMocks.customerResponse(params.customerId, params.email);
          default:
            throw new Error(`Unknown Stripe operation: ${operation}`);
        }
      case ServiceProvider.SUPABASE:
        switch (operation) {
          case 'insertLead':
            return SupabaseMocks.insertLeadResponse();
          case 'queryLeads':
            return SupabaseMocks.queryLeadsResponse(params.leads);
          default:
            throw new Error(`Unknown Supabase operation: ${operation}`);
        }
      case ServiceProvider.RESEND:
        switch (operation) {
          case 'sendEmail':
            return ResendMocks.sendEmailResponse(params.emailId);
          default:
            throw new Error(`Unknown Resend operation: ${operation}`);
        }
      case ServiceProvider.CONVERTKIT:
        switch (operation) {
          case 'addSubscriber':
            return ConvertKitMocks.addSubscriberResponse(params.subscriberId);
          default:
            throw new Error(`Unknown ConvertKit operation: ${operation}`);
        }
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  },
};
