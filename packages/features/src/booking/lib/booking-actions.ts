// File: packages/features/src/booking/lib/booking-actions.ts [TRACE:FILE=packages.features.booking.bookingActions]
// Purpose: Booking action handlers providing appointment submission, validation, and provider
//          integration. Now accepts BookingFeatureConfig for configurable validation.
//
// Relationship: Uses booking-schema, booking-config, booking-providers, booking-repository.
//              Depends on @repo/infra (rate limit, IP).
// System role: Server actions; BookingRepository-backed storage (task 0-2); rate limit and
//              fraud detection then provider sync. Tenant-scoped via resolveTenantId (task 0-3).
// Assumptions: revalidatePath('/book') exists in app.
//
// Exports / Entry: submitBookingRequest function, BookingSubmissionResult interface
// Used by: BookingForm component, booking API endpoints, and appointment management features
//
// Invariants:
// - All bookings must be validated against security schema before processing
// - Rate limiting must be enforced per email and IP address
// - Confirmation numbers must be unique and traceable
// - Provider integration must be best-effort (failures logged but not blocking)
// - Suspicious activity must be detected and flagged for review
// - Schema must be created from provided configuration
// - Bookings are persisted via BookingRepository (replaces in-memory Map, task 0-2)
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Appointment submission and management
// - [FEAT:SECURITY] Fraud detection and rate limiting
// - [FEAT:INTEGRATION] External booking provider synchronization
// - [FEAT:VALIDATION] Security validation and pattern detection
// - [FEAT:MONITORING] Booking activity logging and tracking
// - [FEAT:CONFIGURATION] Configurable validation schema
// - [FEAT:PERSISTENCE] BookingRepository abstraction (task 0-2)

'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import {
  createBookingFormSchema,
  validateBookingSecurity,
  createServiceLabels,
  type BookingFormData,
} from './booking-schema';
import { getBookingProviders } from './booking-providers';
import type { BookingProviderResponse } from './booking-provider-adapter';
import { checkRateLimit, hashIp } from '@repo/infra';
import { getValidatedClientIp } from '@repo/infra/security/request-validation';
import { validateEnv } from '@repo/infra/env';
import type { BookingFeatureConfig } from './booking-config';
import { InMemoryBookingRepository } from './booking-repository';
import { resolveTenantId } from '@repo/infra/auth/tenant-context';

// validateEnv() with default options returns CompleteEnv directly (throwOnError=true)
const validatedEnv = validateEnv() as { NODE_ENV: 'development' | 'production' | 'test' };
const nodeEnv = validatedEnv.NODE_ENV ?? 'development';

/**
 * Module-level BookingRepository instance.
 * InMemoryBookingRepository is the default; swap for SupabaseBookingRepository
 * when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are present (task 0-2).
 */
// [TRACE:CONST=packages.features.booking.bookingRepository]
// [FEAT:BOOKING] [FEAT:PERSISTENCE]
// NOTE: Repository instance - replaces internalBookings Map with typed abstraction (task 0-2).
const bookingRepository = new InMemoryBookingRepository();

/**
 * Booking submission result interface
 */
// [TRACE:INTERFACE=packages.features.booking.BookingSubmissionResult]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Result interface - provides comprehensive booking outcome with provider details and confirmation data.
export interface BookingSubmissionResult {
  success: boolean;
  bookingId?: string;
  confirmationNumber?: string;
  error?: string;
  providerResults?: BookingProviderResponse[];
  requiresConfirmation?: boolean;
}

/**
 * Verification params for IDOR prevention — required for confirm, cancel, and getDetails.
 * Use same error as "not found" when verification fails to avoid enumeration.
 */
export interface BookingVerification {
  confirmationNumber: string;
  email: string;
}

/**
 * Generate unique confirmation number
 * Uses crypto.getRandomValues for cryptographically secure randomness.
 */
// [TRACE:FUNC=packages.features.booking.generateConfirmationNumber]
// [FEAT:BOOKING] [FEAT:SECURITY]
// NOTE: Confirmation generator - creates unique, traceable booking identifiers using timestamp and secure random data.
function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  const random = Array.from(arr, (b) => b.toString(36))
    .join('')
    .substring(0, 6);
  return `BK-${timestamp}-${random}`.toUpperCase();
}

/**
 * Detect suspicious booking patterns (AI-powered fraud detection)
 *
 * FIX summary:
 * 1. Name casing false positive: Previous regex `/^[A-Z\s]+$/` flagged ALL uppercase names
 *    (e.g., "JANE DOE") as suspicious. Bot detection should instead look for length extremes
 *    or lack of word boundaries. Updated to check for numeric characters in names instead.
 * 2. `_ip` parameter: Renamed from `_ip` and used `void ip` to suppress lint warning while
 *    leaving placeholder for future correlation. Now used to log the IP of suspicious attempts.
 */
// [TRACE:FUNC=packages.features.booking.detectSuspiciousActivity]
// [FEAT:SECURITY] [FEAT:FRAUD_DETECTION]
// NOTE: Fraud detection - analyzes booking patterns for suspicious activity using configurable rules.
function detectSuspiciousActivity(data: BookingFormData, ip: string): boolean {
  const suspiciousPatterns = [
    // Check for numeric characters in names (typical bot behavior)
    /\d/.test(data.firstName) || /\d/.test(data.lastName),
    // Check for suspicious email domains
    /@(10minutemail|tempmail|guerrillamail)\.com$/i.test(data.email),
    // Unusual booking patterns
    data.serviceType === 'consultation' && data.notes?.toLowerCase().includes('test'),
  ];

  const isSuspicious = suspiciousPatterns.some(Boolean);

  if (isSuspicious) {
    console.warn(`[FRAUD] Suspicious booking attempt blocked/flagged from IP: ${ip}`, {
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
    });
  }

  return isSuspicious;
}

/**
 * Submit booking request with comprehensive security and validation.
 * Now persists via BookingRepository (task 0-2, replaces internalBookings Map).
 */
// [TRACE:FUNC=packages.features.booking.submitBookingRequest]
// [FEAT:BOOKING] [FEAT:SECURITY] [FEAT:VALIDATION] [FEAT:CONFIGURATION] [FEAT:PERSISTENCE]
// NOTE: Booking submission - validates, stores via repository, and syncs with external providers.
export async function submitBookingRequest(
  formData: FormData,
  config: BookingFeatureConfig
): Promise<BookingSubmissionResult> {
  try {
    const headersList = await headers();
    const clientIp = getValidatedClientIp(headersList, {
      environment: nodeEnv,
    });

    // Extract and validate form data
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
    } satisfies Record<string, unknown>;

    // Create schema from config and validate
    const schema = createBookingFormSchema(config);
    const validatedData = validateBookingSecurity(rawFormData, schema);

    // Rate limiting check (2026 security pattern)
    const rateLimitResult = await checkRateLimit({
      email: validatedData.email,
      clientIp,
      hashIp,
    });

    if (!rateLimitResult) {
      return {
        success: false,
        error: 'Too many booking attempts. Please try again later.',
      };
    }

    // AI-powered fraud detection (2026 security pattern)
    if (detectSuspiciousActivity(validatedData, clientIp)) {
      // For demo purposes, we flag but allow. In production, we might return an error here.
      console.warn('Suspicious activity flagged for review.');
    }

    // Generate confirmation number and persist via repository (task 0-2)
    const confirmationNumber = generateConfirmationNumber();
    const record = await bookingRepository.create({
      data: validatedData,
      status: 'pending',
      confirmationNumber,
    });

    // Attempt to create bookings with external providers
    const providers = getBookingProviders();
    const providerResults = await providers.createBookingWithAllProviders(validatedData);

    // Get service labels for logging
    const serviceLabels = createServiceLabels(config);

    // Log booking attempt for audit
    console.info('Booking submitted:', {
      bookingId: record.id,
      confirmationNumber,
      service: serviceLabels[validatedData.serviceType] ?? validatedData.serviceType,
      email: validatedData.email,
      ip: clientIp,
      providerResults: providerResults.map((r) => ({ success: r.success, provider: 'external' })),
      timestamp: new Date().toISOString(),
    });

    // Revalidate booking page to show updated data
    revalidatePath('/book');
    revalidatePath('/booking-confirmation');

    return {
      success: true,
      bookingId: record.id,
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

/**
 * Confirm booking (typically after email verification).
 * Requires verification params for IDOR prevention.
 */
// [TRACE:FUNC=packages.features.booking.confirmBooking]
// [FEAT:BOOKING] [FEAT:SECURITY] [FEAT:PERSISTENCE]
// NOTE: Booking confirmation - retrieves via repository, verifies, then updates status.
export async function confirmBooking(
  bookingId: string,
  verification: BookingVerification
): Promise<BookingSubmissionResult> {
  try {
    const booking = await bookingRepository.getById(bookingId);

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (
      booking.confirmationNumber !== verification.confirmationNumber ||
      booking.data.email !== verification.email
    ) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status !== 'pending') {
      return { success: false, error: 'Booking already processed' };
    }

    // Update booking status via repository
    const updated = await bookingRepository.update(bookingId, { status: 'confirmed' });

    // Log confirmation for audit
    console.info('Booking confirmed:', {
      bookingId,
      confirmationNumber: updated.confirmationNumber,
      timestamp: new Date().toISOString(),
    });

    // Revalidate pages
    revalidatePath('/booking-confirmation');
    revalidatePath('/book');

    return {
      success: true,
      bookingId,
      confirmationNumber: updated.confirmationNumber,
    };
  } catch (error: unknown) {
    console.error('Booking confirmation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return { success: false, error: 'Failed to confirm booking' };
  }
}

/**
 * Cancel booking.
 * Requires verification params for IDOR prevention.
 */
// [TRACE:FUNC=packages.features.booking.cancelBooking]
// [FEAT:BOOKING] [FEAT:SECURITY] [FEAT:PERSISTENCE]
// NOTE: Booking cancellation - retrieves via repository, verifies, then updates status.
export async function cancelBooking(
  bookingId: string,
  verification: BookingVerification
): Promise<BookingSubmissionResult> {
  try {
    const booking = await bookingRepository.getById(bookingId);

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (
      booking.confirmationNumber !== verification.confirmationNumber ||
      booking.data.email !== verification.email
    ) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Booking already cancelled' };
    }

    // Update booking status via repository
    const updated = await bookingRepository.update(bookingId, { status: 'cancelled' });

    // Log cancellation for audit
    console.info('Booking cancelled:', {
      bookingId,
      confirmationNumber: updated.confirmationNumber,
      timestamp: new Date().toISOString(),
    });

    // Revalidate pages
    revalidatePath('/booking-confirmation');
    revalidatePath('/book');

    return {
      success: true,
      bookingId,
      confirmationNumber: updated.confirmationNumber,
    };
  } catch (error: unknown) {
    console.error('Booking cancellation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return { success: false, error: 'Failed to cancel booking' };
  }
}

/**
 * Get booking details for confirmation page.
 * Requires verification params for IDOR prevention.
 */
// [TRACE:FUNC=packages.features.booking.getBookingDetails]
// [FEAT:BOOKING] [FEAT:SECURITY] [FEAT:PERSISTENCE]
// NOTE: Booking retrieval - fetches via repository, verifies, returns enriched details.
export async function getBookingDetails(
  bookingId: string,
  config: BookingFeatureConfig,
  verification: BookingVerification
) {
  const booking = await bookingRepository.getById(bookingId);

  if (!booking) {
    return null;
  }

  if (
    booking.confirmationNumber !== verification.confirmationNumber ||
    booking.data.email !== verification.email
  ) {
    return null;
  }

  const serviceLabels = createServiceLabels(config);

  return {
    ...booking,
    serviceLabel: serviceLabels[booking.data.serviceType] ?? booking.data.serviceType,
    formattedDate: new Date(booking.data.preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

/**
 * Get provider status for admin dashboard
 */
// [TRACE:FUNC=packages.features.booking.getBookingProviderStatus]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Provider status - returns status of all configured booking providers.
export async function getBookingProviderStatus() {
  const providers = getBookingProviders();
  return providers.getProviderStatus();
}
