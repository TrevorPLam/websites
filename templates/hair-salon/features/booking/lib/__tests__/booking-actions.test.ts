/**
 * Booking Actions Tests
 *
 * Tests for Task 1.1.1: getValidatedClientIp integration.
 * Verifies IP extraction, spoofed header rejection, and fallback behavior.
 *
 * @see ai/security/security-standards.md
 * @see packages/infra/security/request-validation.ts
 */

// Set up env BEFORE any imports that use validatedEnv
require('../../../../lib/__tests__/env-setup');

jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockCheckRateLimit = jest.fn().mockResolvedValue(true);
jest.mock('@repo/infra', () => ({
  ...jest.requireActual('@repo/infra'),
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

jest.mock('../booking-providers', () => ({
  getBookingProviders: () => ({
    createBookingWithAllProviders: jest.fn().mockResolvedValue([]),
    getProviderStatus: jest.fn().mockResolvedValue([]),
  }),
}));

import { headers } from 'next/headers';
import { submitBookingRequest } from '../booking-actions';

/** Valid form data for submission tests */
function createValidFormData(overrides: Record<string, string> = {}): FormData {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const data: Record<string, string> = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+15551234567',
    serviceType: 'haircut-style',
    preferredDate: futureDate.toISOString().split('T')[0]!,
    timeSlot: 'afternoon',
    notes: '',
    honeypot: '',
    timestamp: new Date().toISOString(),
    ...overrides,
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
}

describe('booking-actions - IP validation (Task 1.1.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue(true);
  });

  describe('getValidatedClientIp integration', () => {
    test('valid IP extraction: extracts client IP from trusted x-forwarded-for header', async () => {
      const mockHeaders = new Headers({
        'x-forwarded-for': '192.168.1.100',
      });
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const result = await submitBookingRequest(createValidFormData());

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: '192.168.1.100',
        })
      );
    });

    test('spoofed header rejection: invalid IP in x-forwarded-for returns unknown', async () => {
      const mockHeaders = new Headers({
        'x-forwarded-for': 'attacker-spoofed-value',
      });
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const result = await submitBookingRequest(createValidFormData());

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: 'unknown',
        })
      );
    });

    test('fallback to unknown: no IP headers results in unknown', async () => {
      const mockHeaders = new Headers({});
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const result = await submitBookingRequest(createValidFormData());

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: 'unknown',
        })
      );
    });
  });
});
