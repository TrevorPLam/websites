/**
 * Contact feature parity tests.
 * Verifies @repo/features/contact result shape and schema contract.
 * See docs/testing/refactor-parity-matrix.md (C1–C3).
 * Imports only types and schema factory to avoid pulling in ContactForm (@repo/infra/client).
 */

import type {
  ContactSubmissionResult,
  ContactFeatureConfig,
} from '@repo/features/contact';
import { createContactFormSchema } from '@repo/features/contact/lib/contact-schema';

const minimalContactConfig: ContactFeatureConfig = {
  fields: [
    { id: 'name', label: 'Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'message', label: 'Message', type: 'textarea', required: true },
  ],
  steps: [{ id: 'step1', title: 'Contact', fieldIds: ['name', 'email', 'message'] }],
  consent: null,
};

describe('Contact parity (@repo/features/contact)', () => {
  describe('C1: ContactSubmissionResult shape', () => {
    it('result has success, message, and optional errors', () => {
      const successResult: ContactSubmissionResult = {
        success: true,
        message: 'Thank you for your message.',
      };
      expect(successResult.success).toBe(true);
      expect(successResult.message).toBeDefined();

      const errorResult: ContactSubmissionResult = {
        success: false,
        message: 'Validation failed',
        errors: [{ path: ['email'], message: 'Invalid email' }],
      };
      expect(errorResult.success).toBe(false);
      expect(Array.isArray(errorResult.errors)).toBe(true);
    });
  });

  describe('C2: schema validates required fields', () => {
    it('accepts valid contact data', () => {
      const schema = createContactFormSchema(minimalContactConfig);
      const valid = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello, I would like to book an appointment.',
      };
      expect(() => schema.parse(valid)).not.toThrow();
    });

    it('rejects missing required fields', () => {
      const schema = createContactFormSchema(minimalContactConfig);
      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ name: 'Jane' })).toThrow();
      expect(() =>
        schema.parse({ name: 'Jane', email: 'jane@example.com' })
      ).toThrow();
    });

    it('rejects invalid email', () => {
      const schema = createContactFormSchema(minimalContactConfig);
      expect(() =>
        schema.parse({
          name: 'Jane',
          email: 'not-an-email',
          message: 'Hello',
        })
      ).toThrow();
    });
  });

  describe('C3: rate limiting (contract only)', () => {
    it('ContactSubmissionResult allows success false with message (rate limit path)', () => {
      const rateLimitResult: ContactSubmissionResult = {
        success: false,
        message: 'Too many attempts. Please try again later.',
      };
      expect(rateLimitResult.success).toBe(false);
      expect(rateLimitResult.message).toMatch(/try again|later/i);
    });
  });
});
