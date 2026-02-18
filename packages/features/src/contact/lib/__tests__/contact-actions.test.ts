/**
 * submitContactForm unit tests.
 * Mocks Next.js headers and @repo/infra for isolated testing.
 */

import { submitContactForm } from '../contact-actions';
import type { ContactFormData, ContactSubmissionHandler } from '../contact-schema';

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn((name: string) => (name === 'user-agent' ? 'test-agent' : undefined)),
  }),
}));

jest.mock('@repo/infra', () => ({
  checkRateLimit: jest.fn().mockResolvedValue(true),
  logError: jest.fn(),
  withServerSpan: jest.fn((_: unknown, fn: () => Promise<unknown>) => fn()),
}));

jest.mock('@repo/infra/context/request-context.server', () => ({
  runWithRequestId: jest.fn((_: unknown, fn: () => Promise<unknown>) => fn()),
}));

jest.mock('@repo/infra/security/request-validation', () => ({
  getValidatedClientIp: jest.fn().mockReturnValue('127.0.0.1'),
}));

describe('submitContactForm', () => {
  const validData: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I have a question.',
  };

  const mockHandler: ContactSubmissionHandler = jest.fn().mockResolvedValue({
    success: true,
    message: 'Received',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const { checkRateLimit } = require('@repo/infra');
    (checkRateLimit as jest.Mock).mockResolvedValue(true);
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
    const handlerNoMessage: ContactSubmissionHandler = jest.fn().mockResolvedValue({
      success: true,
    });
    const result = await submitContactForm(validData, handlerNoMessage, {
      successMessage: 'We received your inquiry!',
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe('We received your inquiry!');
  });

  it('returns failure when handler returns success: false', async () => {
    const failHandler: ContactSubmissionHandler = jest.fn().mockResolvedValue({
      success: false,
      message: 'Database error',
    });
    const result = await submitContactForm(validData, failHandler);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Database error');
  });

  it('returns rate limit message when checkRateLimit returns false', async () => {
    const { checkRateLimit } = require('@repo/infra');
    (checkRateLimit as jest.Mock).mockResolvedValue(false);
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
