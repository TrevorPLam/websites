/**
 * Booking actions unit tests.
 * Verifies submitBookingRequest, confirmBooking, cancelBooking, getBookingDetails
 * with IDOR prevention (verification required for mutations).
 */

import {
  submitBookingRequest,
  confirmBooking,
  cancelBooking,
  getBookingDetails,
} from '../booking-actions';
import type { BookingFeatureConfig } from '../booking-config';

// Shared mock state for testing
const mockBookings = new Map();

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn((name: string) => (name === 'x-forwarded-for' ? '192.168.1.1' : undefined)),
  }),
}));

jest.mock('@repo/infra', () => ({
  secureAction: jest.fn((input, schema, handler, options) => {
    // Mock implementation for secureAction
    // Options used for audit logging in real implementation
    // Return proper Result<T, ActionError> format
    try {
      const result = handler(
        {
          tenantId: 'test-tenant',
          userId: 'test-user',
          roles: [],
          correlationId: 'test-correlation',
        },
        input
      );
      return Promise.resolve({ success: true, data: result });
    } catch (error: unknown) {
      console.error('Mock secureAction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return Promise.resolve({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: errorMessage },
      });
    }
  }),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  hashIp: jest.fn((ip: string) => ip),
  getBookingForTenant: jest.fn().mockImplementation(({ bookingId }) => {
    return Promise.resolve(mockBookings.get(bookingId));
  }),
  updateBookingStatus: jest.fn().mockImplementation(({ bookingId, status }) => {
    const booking = mockBookings.get(bookingId);
    if (booking) {
      const updated = { ...booking, status };
      mockBookings.set(bookingId, updated);
      return Promise.resolve(updated);
    }
    return Promise.resolve(null);
  }),
  getBookingByConfirmationForTenant: jest
    .fn()
    .mockImplementation(({ confirmationNumber, email }) => {
      for (const booking of mockBookings.values()) {
        if (booking.confirmationNumber === confirmationNumber && booking.data.email === email) {
          return Promise.resolve(booking);
        }
      }
      return Promise.resolve(null);
    }),
  resolveTenantId: jest.fn(() => 'test-tenant'),
  validateEnv: jest.fn(() => ({ NODE_ENV: 'test' })),
}));

jest.mock('@repo/infra/security/request-validation', () => ({
  getValidatedClientIp: jest.fn().mockReturnValue('192.168.1.1'),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('../booking-repository', () => ({
  getBookingRepository: jest.fn(() => ({
    create: jest.fn().mockImplementation(({ data, confirmationNumber }) => {
      const booking = {
        id: 'test-booking-id',
        confirmationNumber,
        status: 'pending',
        data,
      };
      mockBookings.set('test-booking-id', booking);
      return booking;
    }),
  })),
}));

jest.mock('../booking-providers', () => ({
  getBookingProviders: jest.fn().mockReturnValue({
    createBookingWithAllProviders: jest.fn().mockResolvedValue([]),
  }),
}));

const testConfig: BookingFeatureConfig = {
  services: [{ id: 'consultation', label: 'Consultation' }],
  timeSlots: [{ value: '09:00', label: '9:00 AM' }],
  maxAdvanceDays: 30,
};

function createFormData(overrides: Record<string, string> = {}): FormData {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaults = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '555-123-4567',
    serviceType: 'consultation',
    preferredDate: tomorrow.toISOString().split('T')[0],
    timeSlot: '09:00',
    notes: '',
    honeypot: '',
    timestamp: new Date().toISOString(),
  };
  const data = { ...defaults, ...overrides };
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

describe('submitBookingRequest', () => {
  it('returns success with bookingId and confirmationNumber', async () => {
    const formData = createFormData();
    const result = await submitBookingRequest(formData, testConfig);
    expect(result.success).toBe(true);
    expect(result.bookingId).toBeDefined();
    expect(result.confirmationNumber).toMatch(/^BK-/);
  });
});

describe('confirmBooking', () => {
  it('requires verification and rejects without matching confirmationNumber', async () => {
    const formData = createFormData();
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;

    const result = await confirmBooking(bookingId, {
      confirmationNumber: 'WRONG-CONFIRM',
      email: 'jane@example.com',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Booking not found');
  });

  it('requires verification and rejects without matching email', async () => {
    const formData = createFormData({ email: 'jane@example.com' });
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;
    const confirmationNumber = submit.confirmationNumber!;

    const result = await confirmBooking(bookingId, {
      confirmationNumber,
      email: 'wrong@example.com',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Booking not found');
  });

  it('confirms when verification matches', async () => {
    const formData = createFormData({ email: 'verify@test.com' });
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;
    const confirmationNumber = submit.confirmationNumber!;

    const result = await confirmBooking(bookingId, {
      confirmationNumber,
      email: 'verify@test.com',
    });
    expect(result.success).toBe(true);
  });
});

describe('cancelBooking', () => {
  it('requires verification and rejects without matching verification', async () => {
    const formData = createFormData();
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;

    const result = await cancelBooking(bookingId, {
      confirmationNumber: 'WRONG',
      email: 'wrong@example.com',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Booking not found');
  });

  it('cancels when verification matches', async () => {
    const formData = createFormData({ email: 'cancel@test.com' });
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;
    const confirmationNumber = submit.confirmationNumber!;

    const result = await cancelBooking(bookingId, {
      confirmationNumber,
      email: 'cancel@test.com',
    });
    expect(result.success).toBe(true);
  });
});

describe('getBookingDetails', () => {
  it('returns null without matching verification', async () => {
    const formData = createFormData();
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;

    const result = await getBookingDetails(bookingId, testConfig, {
      confirmationNumber: 'WRONG',
      email: 'wrong@example.com',
    });
    expect(result).toBeNull();
  });

  it('returns booking when verification matches', async () => {
    const formData = createFormData({ email: 'details@test.com' });
    const submit = await submitBookingRequest(formData, testConfig);
    expect(submit.success).toBe(true);
    const bookingId = submit.bookingId!;
    const confirmationNumber = submit.confirmationNumber!;

    const result = await getBookingDetails(bookingId, testConfig, {
      confirmationNumber,
      email: 'details@test.com',
    });
    expect(result).not.toBeNull();
    expect(result?.id).toBe(bookingId);
    expect(result?.confirmationNumber).toBe(confirmationNumber);
  });
});
