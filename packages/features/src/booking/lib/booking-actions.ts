// File: packages/features/src/booking/lib/booking-actions.ts  [TRACE:FILE=packages.features.booking.bookingActions]
// Purpose: Booking action handlers providing appointment submission, validation, and provider integration.
// Status: @internal

'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { BookingFormData, validateBookingSecurity, SERVICE_LABELS } from './booking-schema';
import { getBookingProviders, BookingProviderResponse } from './booking-providers';
import { checkRateLimit } from '@repo/infra';
import { getValidatedClientIp } from '@repo/infra/security/request-validation';
import { validateEnv } from '@repo/infra/env';

const validatedEnv = validateEnv();

export interface BookingSubmissionResult {
  success: boolean;
  bookingId?: string;
  confirmationNumber?: string;
  error?: string;
  providerResults?: BookingProviderResponse[];
  requiresConfirmation?: boolean;
}

const internalBookings = new Map<
  string,
  {
    id: string;
    data: BookingFormData;
    timestamp: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    confirmationNumber: string;
  }
>();

function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BK-${timestamp}-${random}`.toUpperCase();
}

function detectSuspiciousActivity(data: BookingFormData, _ip: string): boolean {
  const suspiciousPatterns = [
    /^[A-Z\s]+$/.test(data.firstName) && /^[A-Z\s]+$/.test(data.lastName),
    /@(10minutemail|tempmail|guerrillamail)\.com$/i.test(data.email),
    false,
    data.serviceType === 'consultation' && data.notes?.toLowerCase().includes('test'),
  ];

  return suspiciousPatterns.some(Boolean);
}

export async function submitBookingRequest(formData: FormData): Promise<BookingSubmissionResult> {
  try {
    const headersList = await headers();
    const clientIp = getValidatedClientIp(headersList, {
      environment: validatedEnv.NODE_ENV,
    });

    const rawFormData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      serviceType: formData.get('serviceType'),
      preferredDate: formData.get('preferredDate'),
      timeSlot: formData.get('timeSlot'),
      notes: formData.get('notes'),
      honeypot: formData.get('honeypot'),
      timestamp: formData.get('timestamp'),
    } satisfies Record<string, FormDataEntryValue | null>;

    const validatedData = validateBookingSecurity(rawFormData);

    const rateLimitResult = await checkRateLimit({
      email: validatedData.email,
      clientIp,
      hashIp: (value: string) => btoa(value).substring(0, 16),
    });

    if (!rateLimitResult) {
      return {
        success: false,
        error: 'Too many booking attempts. Please try again later.',
      };
    }

    if (detectSuspiciousActivity(validatedData, clientIp)) {
      console.warn('Suspicious booking activity detected:', {
        ip: clientIp,
        email: validatedData.email,
        timestamp: new Date().toISOString(),
        patterns: 'AI detection triggered',
      });
    }

    const bookingId = crypto.randomUUID();
    const confirmationNumber = generateConfirmationNumber();

    internalBookings.set(bookingId, {
      id: bookingId,
      data: validatedData,
      timestamp: new Date(),
      status: 'pending',
      confirmationNumber,
    });

    const providers = getBookingProviders();
    const providerResults = await providers.createBookingWithAllProviders(validatedData);

    console.info('Booking submitted:', {
      bookingId,
      confirmationNumber,
      service: SERVICE_LABELS[validatedData.serviceType],
      email: validatedData.email,
      ip: clientIp,
      providerResults: providerResults.map((r) => ({ success: r.success, provider: 'external' })),
      timestamp: new Date().toISOString(),
    });

    revalidatePath('/book');
    revalidatePath('/booking-confirmation');

    return {
      success: true,
      bookingId,
      confirmationNumber,
      providerResults,
      requiresConfirmation: true,
    };
  } catch (error: unknown) {
    console.error('Booking submission error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: 'Failed to submit booking request. Please try again.',
    };
  }
}

export async function confirmBooking(bookingId: string): Promise<BookingSubmissionResult> {
  try {
    const booking = internalBookings.get(bookingId);

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    booking.status = 'confirmed';
    revalidatePath('/book');
    revalidatePath('/booking-confirmation');

    return { success: true, bookingId, confirmationNumber: booking.confirmationNumber };
  } catch (error: unknown) {
    console.error('Booking confirmation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return { success: false, error: 'Failed to confirm booking' };
  }
}

export async function cancelBooking(bookingId: string): Promise<BookingSubmissionResult> {
  try {
    const booking = internalBookings.get(bookingId);

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    booking.status = 'cancelled';
    revalidatePath('/book');

    return { success: true, bookingId, confirmationNumber: booking.confirmationNumber };
  } catch (error: unknown) {
    console.error('Booking cancellation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return { success: false, error: 'Failed to cancel booking' };
  }
}
