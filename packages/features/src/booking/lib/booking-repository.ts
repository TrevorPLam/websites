/**
 * @file packages/features/src/booking/lib/booking-repository.ts
 * @summary BookingRepository interface and InMemoryBookingRepository (Task 0-2).
 * @see tasks/0-2-replace-internal-bookings-persistent-storage.md
 *
 * Purpose: Replaces the process-local internalBookings Map with a typed
 * BookingRepository abstraction. The in-memory implementation is the default;
 * swap with SupabaseBookingRepository when Supabase env vars are provided.
 *
 * Exports / Entry: BookingRecord, BookingRepository, InMemoryBookingRepository
 * Used by: booking-actions.ts (server actions)
 *
 * Invariants:
 * - Repository methods are async (future-proofs Supabase or other I/O)
 * - All queries accept optional tenantId for multi-tenant scoping (task 0-3)
 * - getById / getByConfirmation return null for missing OR wrong-tenant records
 *   (same response prevents tenant enumeration)
 * - update() throws if record not found (caller must handle)
 *
 * Status: @internal
 */

import type { BookingFormData } from './booking-schema';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single booking record. Designed to accept CanonicalBooking in evol-5. */
export interface BookingRecord {
  id: string;
  /** Form submission payload. Will be replaced by CanonicalBooking in evol-5. */
  data: BookingFormData;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationNumber: string;
  /** Tenant identifier for multi-tenant scoping (from task 0-3). */
  tenantId?: string;
}

// ─── Repository interface ─────────────────────────────────────────────────────

/**
 * Persistence abstraction for bookings.
 *
 * All methods that retrieve records accept an optional tenantId; when provided,
 * records belonging to a different tenant are treated as non-existent (same error
 * as not found — prevents enumeration).
 */
export interface BookingRepository {
  /**
   * Persist a new booking record.
   * Assigns a UUID id and current timestamp; returns the complete record.
   */
  create(record: Omit<BookingRecord, 'id' | 'timestamp'>): Promise<BookingRecord>;

  /**
   * Retrieve a booking by its UUID id.
   * Returns null if not found or if tenantId does not match.
   */
  getById(id: string, tenantId?: string): Promise<BookingRecord | null>;

  /**
   * Retrieve a booking by confirmation number and email.
   * Returns null if not found, email mismatch, or tenantId mismatch.
   */
  getByConfirmation(
    confirmationNumber: string,
    email: string,
    tenantId?: string
  ): Promise<BookingRecord | null>;

  /**
   * Update status of an existing booking.
   * Returns the updated record. Throws if not found (or tenantId mismatch).
   */
  update(
    id: string,
    updates: Partial<Pick<BookingRecord, 'status'>>,
    tenantId?: string
  ): Promise<BookingRecord>;
}

// ─── Repository factory (environment-based selection) ───────────────────────

/**
 * Factory function that returns the appropriate BookingRepository implementation
 * based on environment configuration.
 *
 * - If SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured: returns SupabaseBookingRepository
 * - Otherwise: returns InMemoryBookingRepository (development fallback)
 *
 * @returns BookingRepository instance
 */
export function getBookingRepository(): BookingRepository {
  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    // For now, always return in-memory since Supabase implementation isn't ready
    // TODO: Implement SupabaseBookingRepository and return it here
    console.info(
      'Supabase configured but using in-memory repository until SupabaseBookingRepository is implemented'
    );
    return new InMemoryBookingRepository();
  }

  // Default to in-memory for development
  return new InMemoryBookingRepository();
}

// ─── In-memory implementation (default) ──────────────────────────────────────

/**
 * In-memory BookingRepository. Replaces the old `internalBookings` Map.
 *
 * Suitable for development and demo deployments. Not persistent across process
 * restarts. For production, replace with SupabaseBookingRepository.
 *
 * Thread-safety: JavaScript is single-threaded so no locking is needed.
 */
export class InMemoryBookingRepository implements BookingRepository {
  private readonly store = new Map<string, BookingRecord>();

  async create(record: Omit<BookingRecord, 'id' | 'timestamp'>): Promise<BookingRecord> {
    const bookingRecord: BookingRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    this.store.set(bookingRecord.id, bookingRecord);
    return bookingRecord;
  }

  async getById(id: string, tenantId?: string): Promise<BookingRecord | null> {
    const record = this.store.get(id);
    if (!record) return null;
    // Treat tenant mismatch the same as not found (prevent enumeration)
    if (tenantId !== undefined && record.tenantId !== tenantId) return null;
    return record;
  }

  async getByConfirmation(
    confirmationNumber: string,
    email: string,
    tenantId?: string
  ): Promise<BookingRecord | null> {
    for (const record of this.store.values()) {
      if (
        record.confirmationNumber === confirmationNumber &&
        record.data.email === email &&
        (tenantId === undefined || record.tenantId === tenantId)
      ) {
        return record;
      }
    }
    return null;
  }

  async update(
    id: string,
    updates: Partial<Pick<BookingRecord, 'status'>>,
    tenantId?: string
  ): Promise<BookingRecord> {
    const record = await this.getById(id, tenantId);
    if (!record) {
      throw new Error('Booking not found');
    }
    const updated: BookingRecord = { ...record, ...updates };
    this.store.set(id, updated);
    return updated;
  }

  /** For testing: return current store size. */
  get size(): number {
    return this.store.size;
  }
}
