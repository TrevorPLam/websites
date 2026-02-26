/**
 * @file packages/features/src/contact/lib/__tests__/contact-actions.test.ts
 * @summary submitContactForm unit tests with mocked dependencies.
 * @description Tests contact form submission with Next.js headers and infrastructure mocks.
 * @security Mock implementations only, no real data access or authentication.
 * @adr none
 * @requirements none
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { submitContactForm } from '../contact-actions';
import { ContactFormData } from '../contact-schema';

const mockHandler = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn((name: string) => (name === 'user-agent' ? 'test-agent' : undefined)),
  }),
}));

vi.mock('@repo/infrastructure', () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  logError: vi.fn(),
  withServerSpan: vi.fn((_: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('@repo/infrastructure/context/server', () => ({
  runWithRequestId: vi.fn((_: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('@repo/infrastructure/security', () => ({
  getValidatedClientIp: vi.fn().mockReturnValue('127.0.0.1'),
}));

describe('submitContactForm', () => {
  const validData: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I have a question.',
  };

  const mockHandler = vi.fn().mockResolvedValue({
    success: true,
    message: 'Received',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    const { checkRateLimit } = require('@repo/infrastructure');
    (checkRateLimit as any).mockResolvedValue(true);
  });

  it('returns success when handler succeeds', async () => {
    const result = await submitContactForm(validData, mockHandler);
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I have a question.',
      }),
      expect.objectContaining({
        clientIp: '127.0.0.1',
        userAgent: 'test-agent',
      })
    );
  });

  it('returns custom success message when handler does not provide message', async () => {
    const handlerNoMessage = vi.fn().mockResolvedValue({
      success: true,
    });
    const result = await submitContactForm(validData, handlerNoMessage, {
      successMessage: 'We received your inquiry!',
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe('We received your inquiry!');
  });

  it('returns failure when handler returns success: false', async () => {
    const failHandler = vi.fn().mockResolvedValue({
      success: false,
      message: 'Database error',
    });
    const result = await submitContactForm(validData, failHandler);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Database error');
  });

  it('returns rate limit message when checkRateLimit returns false', async () => {
    const { checkRateLimit } = require('@repo/infrastructure');
    (checkRateLimit as any).mockResolvedValue(false);
    const result = await submitContactForm(validData, mockHandler);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Too many submissions');
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('sanitizes input before passing to handler', async () => {
    const xssData: ContactFormData = {
      name: '<script>alert(1)</script>',
      email: 'test@example.com',
      message: 'Normal message',
    };
    await submitContactForm(xssData, mockHandler);
    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '&lt;script&gt;alert(1)&lt;/script&gt;',
        email: 'test@example.com',
        message: 'Normal message',
      }),
      expect.any(Object)
    );
  });
});
