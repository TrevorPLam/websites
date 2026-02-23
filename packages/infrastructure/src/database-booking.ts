/**
 * @file packages/infra/src/database-booking.ts
 * Task: security-1-server-action-hardening
 *
 * Purpose: Tenant-scoped query helpers for booking operations.
 * Provides getBookingForTenant and updateBookingStatus functions that
 * enforce tenant isolation at the database layer.
 *
 * Exports: getBookingForTenant, updateBookingStatus
 * Used by: booking actions (when refactored to use secureAction)
 *
 * Invariants:
 * - All queries include tenant_id filter
 * - Tenant mismatch returns null (same as not found)
 * - Updates throw if record not found
 *
 * Status: @public
 */

// Define types locally to avoid circular dependency
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
}

export interface BookingRecord {
  id: string;
  data: BookingFormData;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationNumber: string;
  /**
   * Tenant identifier for multi-tenant scoping.
   * REQUIRED for all records in multi-tenant deployments.
   */
  tenantId: string;
}

export interface BookingRepository {
  /**
   * Persist a new booking record.
   * @param record - Booking record WITHOUT id/timestamp (tenantId REQUIRED)
   */
  create(record: Omit<BookingRecord, 'id' | 'timestamp'>): Promise<BookingRecord>;

  /**
   * Retrieve a booking by its UUID id.
   * @param id - Booking UUID
   * @param tenantId - REQUIRED tenant identifier
   * @returns Booking record or null (not found or tenant mismatch)
   */
  getById(id: string, tenantId: string): Promise<BookingRecord | null>;

  /**
   * Retrieve a booking by confirmation number and email.
   * @param confirmationNumber - Booking confirmation number
   * @param email - Email address for verification
   * @param tenantId - REQUIRED tenant identifier
   * @returns Booking record or null (not found or tenant mismatch)
   */
  getByConfirmation(
    confirmationNumber: string,
    email: string,
    tenantId: string
  ): Promise<BookingRecord | null>;

  /**
   * Update booking status with tenant scoping.
   * @param id - Booking UUID
   * @param updates - Partial status updates
   * @param tenantId - REQUIRED tenant identifier
   * @returns Updated booking record
   * @throws Error if booking not found or tenant mismatch
   */
  update(
    id: string,
    updates: Partial<Pick<BookingRecord, 'status'>>,
    tenantId: string
  ): Promise<BookingRecord>;
}

// ─── Tenant-scoped query helpers ────────────────────────────────────────────────

/**
 * Retrieve a booking for a specific tenant.
 * Enforces tenant isolation by returning null if tenant doesn't match.
 *
 * @param repository - BookingRepository instance
 * @param params - Booking ID and tenant ID
 * @returns BookingRecord or null (not found or tenant mismatch)
 */
export async function getBookingForTenant(
  {
    bookingId,
    tenantId,
  }: {
    bookingId: string;
    tenantId: string;
  },
  repository: BookingRepository
): Promise<BookingRecord | null> {
  return repository.getById(bookingId, tenantId);
}

/**
 * Update booking status with tenant scoping.
 * Enforces tenant isolation and throws if record not found.
 *
 * @param repository - BookingRepository instance
 * @param params - Update parameters including tenant ID
 * @returns Updated BookingRecord
 * @throws Error if booking not found or tenant mismatch
 */
export async function updateBookingStatus(
  {
    bookingId,
    tenantId,
    status,
  }: {
    bookingId: string;
    tenantId: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  },
  repository: BookingRepository
): Promise<BookingRecord> {
  return repository.update(bookingId, { status }, tenantId);
}

/**
 * Retrieve booking by confirmation number and email for a specific tenant.
 * Enforces tenant isolation by returning null if tenant doesn't match.
 *
 * @param repository - BookingRepository instance
 * @param params - Confirmation parameters including tenant ID
 * @returns BookingRecord or null (not found or tenant mismatch)
 */
export async function getBookingByConfirmationForTenant(
  {
    confirmationNumber,
    email,
    tenantId,
  }: {
    confirmationNumber: string;
    email: string;
    tenantId: string;
  },
  repository: BookingRepository
): Promise<BookingRecord | null> {
  return repository.getByConfirmation(confirmationNumber, email, tenantId);
}
