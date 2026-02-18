/**
 * Booking feature parity tests.
 * Verifies @repo/features/booking submitBookingRequest matches contract required by template.
 * See docs/testing/refactor-parity-matrix.md (B1–B6).
 */

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

// Mock internal booking-providers so submitBookingRequest does not call real provider APIs
jest.mock(
  require.resolve('@repo/features/booking/lib/booking-providers'),
  () => ({
    getBookingProviders: () => ({
      createBookingWithAllProviders: jest.fn().mockResolvedValue([]),
      getProviderStatus: jest.fn().mockResolvedValue([]),
    }),
  }),
  { virtual: false }
);

import { headers } from 'next/headers';
import {
  submitBookingRequest,
  type BookingSubmissionResult,
  type BookingFeatureConfig,
} from '@repo/features/booking';

const defaultConfig: BookingFeatureConfig = {
  services: [
    { id: 'haircut-style', label: 'Haircut & Styling' },
    { id: 'coloring', label: 'Coloring' },
  ],
  timeSlots: [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
  ],
  maxAdvanceDays: 90,
};

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

describe('Booking parity (@repo/features/booking)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue(true);
  });

  describe('IP validation (B1–B3)', () => {
    it('B1: extracts client IP from trusted x-forwarded-for header', async () => {
      const mockHeaders = new Headers({
        'x-forwarded-for': '192.168.1.100',
      });
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const result = await submitBookingRequest(createValidFormData(), defaultConfig);

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: '192.168.1.100',
        })
      );
    });

    it('B2: spoofed header rejection → clientIp unknown', async () => {
      const mockHeaders = new Headers({
        'x-forwarded-for': 'attacker-spoofed-value',
      });
      (headers as jest.Mock).mockResolvedValue(mockHeaders);

      const result = await submitBookingRequest(createValidFormData(), defaultConfig);

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: 'unknown',
        })
      );
    });

    it('B3: no IP headers → clientIp unknown', async () => {
      (headers as jest.Mock).mockResolvedValue(new Headers({}));

      const result = await submitBookingRequest(createValidFormData(), defaultConfig);

      expect(result.success).toBe(true);
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientIp: 'unknown',
        })
      );
    });
  });

  describe('Result shape (B4)', () => {
    it('B4: returns BookingSubmissionResult with success, bookingId?, confirmationNumber?, error?', async () => {
      (headers as jest.Mock).mockResolvedValue(new Headers({}));

      const result: BookingSubmissionResult = await submitBookingRequest(
        createValidFormData(),
        defaultConfig
      );

      expect(result).toMatchObject({
        success: expect.any(Boolean),
      });
      if (result.success) {
        expect(result).toHaveProperty('bookingId');
        expect(result).toHaveProperty('confirmationNumber');
        expect(typeof result.bookingId).toBe('string');
        expect(typeof result.confirmationNumber).toBe('string');
      } else {
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('Rate limiting (B5)', () => {
    it('B5: rate limit false → success false and error message', async () => {
      mockCheckRateLimit.mockResolvedValue(false);
      (headers as jest.Mock).mockResolvedValue(new Headers({}));

      const result = await submitBookingRequest(createValidFormData(), defaultConfig);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/try again later|rate limit/i);
    });
  });

  describe('Valid submission (B6)', () => {
    it('B6: valid form data + config → success true', async () => {
      (headers as jest.Mock).mockResolvedValue(new Headers({}));

      const result = await submitBookingRequest(createValidFormData(), defaultConfig);

      expect(result.success).toBe(true);
      expect(result.bookingId).toBeDefined();
      expect(result.confirmationNumber).toBeDefined();
    });
  });
});
