/**
 * Booking schema unit tests.
 * Verifies validation, security checks, and label helpers.
 */

import {
  createBookingFormSchema,
  validateBookingSecurity,
  createServiceLabels,
  createTimeSlotLabels,
  sanitizeNotes,
  type BookingFormData,
} from '../booking-schema';
import type { BookingFeatureConfig } from '../booking-config';
import { addDays } from 'date-fns';

const testConfig: BookingFeatureConfig = {
  services: [
    { id: 'haircut', label: 'Haircut' },
    { id: 'coloring', label: 'Coloring' },
  ],
  timeSlots: [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
  ],
  maxAdvanceDays: 30,
};

describe('createBookingFormSchema', () => {
  it('creates schema that validates valid data', () => {
    const schema = createBookingFormSchema(testConfig);
    const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
    const validData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-123-4567',
      serviceType: 'haircut',
      preferredDate: tomorrow,
      timeSlot: '09:00',
      notes: '',
      honeypot: '',
      timestamp: new Date().toISOString(),
    };
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const schema = createBookingFormSchema(testConfig);
    const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
    const invalidData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '555-123-4567',
      serviceType: 'haircut',
      preferredDate: tomorrow,
      timeSlot: '09:00',
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects honeypot with value (bot detection)', () => {
    const schema = createBookingFormSchema(testConfig);
    const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
    const botData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-123-4567',
      serviceType: 'haircut',
      preferredDate: tomorrow,
      timeSlot: '09:00',
      honeypot: 'spam',
    };
    const result = schema.safeParse(botData);
    expect(result.success).toBe(false);
  });
});

describe('validateBookingSecurity', () => {
  it('returns parsed data for valid input', () => {
    const schema = createBookingFormSchema(testConfig);
    const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
    const validData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-123-4567',
      serviceType: 'haircut',
      preferredDate: tomorrow,
      timeSlot: '09:00',
    };
    const result = validateBookingSecurity(validData, schema);
    expect(result.firstName).toBe('Jane');
    expect(result.email).toBe('jane@example.com');
  });

  it('throws for invalid input', () => {
    const schema = createBookingFormSchema(testConfig);
    expect(() => validateBookingSecurity({ invalid: 'data' }, schema)).toThrow();
  });
});

describe('createServiceLabels', () => {
  it('returns label map from config', () => {
    const labels = createServiceLabels(testConfig);
    expect(labels).toEqual({ haircut: 'Haircut', coloring: 'Coloring' });
  });
});

describe('createTimeSlotLabels', () => {
  it('returns time slot label map', () => {
    const labels = createTimeSlotLabels(testConfig);
    expect(labels).toEqual({ '09:00': '9:00 AM', '10:00': '10:00 AM' });
  });
});

describe('sanitizeNotes', () => {
  it('removes script tags', () => {
    const result = sanitizeNotes('Hello <script>alert(1)</script> world');
    expect(result).not.toContain('script');
    expect(result).toBe('Hello  world');
  });

  it('removes HTML tags', () => {
    const result = sanitizeNotes('Test <b>bold</b> text');
    expect(result).toBe('Test bold text');
  });

  it('truncates to 500 chars', () => {
    const long = 'a'.repeat(600);
    const result = sanitizeNotes(long);
    expect(result.length).toBe(500);
  });
});
