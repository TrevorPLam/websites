// File: packages/features/src/booking/lib/booking-providers.ts  [TRACE:FILE=packages.features.booking.bookingProviders]
// Purpose: External booking provider integration system supporting multiple appointment scheduling platforms.
//          Refactored to use adapter pattern, eliminating ~300 lines of duplicated code across providers.
//          Includes open provider registry (inf-10) for third-party provider self-registration.
//
// Relationship: Uses booking-schema, booking-provider-adapter. Depends on @repo/infra/env (validateEnv).
// System role: Factory of Mindbody/Vagaro/Square adapters; getBookingProviders is lazy to avoid build-time env.
//              Provider registry (BOOKING_PROVIDER_REGISTRY) allows third-party providers to self-register.
// Assumptions: Env vars like MINDBODY_ENABLED, MINDBODY_API_KEY; Calendly not yet implemented as adapter.
//
// Exports / Entry: BookingProvider types, ProviderConfig interface, provider classes, getBookingProviders,
//                  registerBookingProvider, getBookingProviderRegistry
// Used by: Booking actions, booking forms, appointment management features, third-party integrations
//
// Invariants:
// - All providers must implement BookingProviderAdapter interface
// - Provider configurations must be validated before use
// - API failures must be logged but not block booking flow
// - Provider URLs must be properly validated and sanitized
// - Booking IDs must be traceable across provider systems
// - registerBookingProvider invalidates the cached BookingProviders instance for hot-loading
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Multi-provider appointment scheduling
// - [FEAT:INTEGRATION] External API integration (Mindbody, Vagaro, Square, Calendly)
// - [FEAT:CONFIGURATION] Provider management and validation
// - [FEAT:RELIABILITY] Error handling and fallback mechanisms
// - [FEAT:MONITORING] Provider performance tracking
// - [FEAT:ARCHITECTURE] Adapter pattern for code reuse
// - [FEAT:EXTENSIBILITY] Open provider registry — registerBookingProvider() for third-party providers (inf-10)

import type { BookingFormData } from './booking-schema';
import {
  BaseBookingProviderAdapter,
  type BookingProviderAdapter,
  type BookingProviderResponse,
  type ProviderConfig,
  type BookingProvider,
} from './booking-provider-adapter';
import { validateEnv } from '@repo/infra/env';

/**
 * Mindbody API integration adapter
 */
// [TRACE:CLASS=packages.features.booking.MindbodyProvider]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:RELIABILITY]
// NOTE: Mindbody integration - implements wellness platform booking with error handling and logging.
class MindbodyProvider extends BaseBookingProviderAdapter {
  readonly name = 'mindbody';
  readonly apiBase = 'https://api.mindbodyonline.com/public/v6/appointment/booking';

  mapServiceId(serviceType: string): string {
    // Mindbody service ID mapping
    const serviceMap: Record<string, string> = {
      'haircut-style': '1',
      'color-highlights': '2',
      treatment: '3',
      'special-occasion': '4',
      consultation: '5',
    };
    return serviceMap[serviceType] ?? '5';
  }

  mapTimeSlot(timeSlot: string): string {
    const timeMap: Record<string, string> = {
      morning: 'T09:00:00',
      afternoon: 'T14:00:00',
      evening: 'T16:00:00',
    };
    return timeMap[timeSlot] ?? 'T14:00:00';
  }

  buildRequestBody(data: BookingFormData): Record<string, unknown> {
    const startDateTime =
      new Date(data.preferredDate).toISOString().split('T')[0] + this.mapTimeSlot(data.timeSlot);
    const endDateTime = this.calculateEndTime(startDateTime);

    return {
      Test: false,
      SendEmail: true,
      LocationId: this.config.businessId,
      Client: {
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        Phone: data.phone,
      },
      Appointment: {
        ServiceId: this.mapServiceId(data.serviceType),
        StartDateTime: startDateTime,
        EndDateTime: endDateTime,
        Notes: data.notes,
      },
    };
  }

  parseResponse(json: unknown): BookingProviderResponse {
    const result = json as { Appointment?: { Id?: number } };
    return {
      success: true,
      bookingId: result.Appointment?.Id?.toString(),
      providerUrl: `https://clients.mindbodyonline.com/appointments?appointmentID=${result.Appointment?.Id}`,
    };
  }

  protected getAdditionalHeaders(): Record<string, string> {
    return { 'API-Version': '6.0' };
  }

  private calculateEndTime(startDateTime: string): string {
    const start = new Date(startDateTime);
    const duration = 60; // 60 minutes default
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString();
  }
}

/**
 * Vagaro API integration adapter
 */
// [TRACE:CLASS=packages.features.booking.VagaroProvider]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:RELIABILITY]
// NOTE: Vagaro integration - implements appointment scheduling platform booking.
class VagaroProvider extends BaseBookingProviderAdapter {
  readonly name = 'vagaro';
  readonly apiBase = 'https://www.vagaro.com/api/v1/appointments';

  mapServiceId(serviceType: string): string {
    const serviceMap: Record<string, string> = {
      'haircut-style': '101',
      'color-highlights': '102',
      treatment: '103',
      'special-occasion': '104',
      consultation: '105',
    };
    return serviceMap[serviceType] ?? '105';
  }

  mapTimeSlot(timeSlot: string): string {
    const timeMap: Record<string, string> = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '16:00',
    };
    return timeMap[timeSlot] ?? '14:00';
  }

  buildRequestBody(data: BookingFormData): Record<string, unknown> {
    return {
      customerInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      appointmentInfo: {
        serviceId: this.mapServiceId(data.serviceType),
        date: data.preferredDate,
        time: this.mapTimeSlot(data.timeSlot),
        notes: data.notes,
      },
      businessId: this.config.businessId,
    };
  }

  parseResponse(json: unknown): BookingProviderResponse {
    const result = json as { appointmentId?: string };
    return {
      success: true,
      bookingId: result.appointmentId,
      providerUrl: `https://www.vagaro.com/appointments/${result.appointmentId}`,
    };
  }
}

/**
 * Square Appointments API integration adapter
 */
// [TRACE:CLASS=packages.features.booking.SquareProvider]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:RELIABILITY]
// NOTE: Square integration - implements Square Appointments API booking.
class SquareProvider extends BaseBookingProviderAdapter {
  readonly name = 'square';
  readonly apiBase = 'https://connect.squareup.com/v2/bookings';

  mapServiceId(serviceType: string): string {
    const serviceMap: Record<string, string> = {
      'haircut-style': 'SVC001',
      'color-highlights': 'SVC002',
      treatment: 'SVC003',
      'special-occasion': 'SVC004',
      consultation: 'SVC005',
    };
    return serviceMap[serviceType] ?? 'SVC005';
  }

  mapTimeSlot(timeSlot: string): string {
    const timeMap: Record<string, string> = {
      morning: 'T09:00:00-05:00',
      afternoon: 'T14:00:00-05:00',
      evening: 'T16:00:00-05:00',
    };
    return timeMap[timeSlot] ?? 'T14:00:00-05:00';
  }

  buildRequestBody(data: BookingFormData): Record<string, unknown> {
    const startAt =
      new Date(data.preferredDate).toISOString().split('T')[0] + this.mapTimeSlot(data.timeSlot);

    return {
      idempotency_key: `${Date.now()}-${data.email}`,
      booking: {
        location_id: this.config.businessId,
        customer_id: 'customer_id_placeholder', // Would be resolved via getOrCreateCustomer in production
        start_at: startAt,
        appointment_segments: [
          {
            service_variation_id: this.mapServiceId(data.serviceType),
            duration_minutes: 60,
            team_member_id: 'any',
          },
        ],
        customer_note: data.notes,
      },
    };
  }

  parseResponse(json: unknown): BookingProviderResponse {
    const result = json as { booking?: { id?: string } };
    return {
      success: true,
      bookingId: result.booking?.id,
      providerUrl: `https://squareup.com/appointments/${result.booking?.id}`,
    };
  }
}

/**
 * Provider factory and configuration manager
 */
// [TRACE:CLASS=packages.features.booking.BookingProviders]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:CONFIGURATION]
// NOTE: Provider factory - manages multiple provider instances and coordinates booking creation.
export class BookingProviders {
  private providers: Map<BookingProvider, BookingProviderAdapter>;
  /** Adapters from BOOKING_PROVIDER_REGISTRY (external/third-party providers). */
  private registeredAdapters: Map<string, BookingProviderAdapter>;
  private readonly env = validateEnv();

  constructor() {
    this.providers = new Map();
    this.providers.set('mindbody', new MindbodyProvider(this.getProviderConfig('mindbody')));
    this.providers.set('vagaro', new VagaroProvider(this.getProviderConfig('vagaro')));
    this.providers.set('square', new SquareProvider(this.getProviderConfig('square')));

    // Load externally registered providers (inf-10 open registry).
    // Registry is populated via registerBookingProvider() side-effect imports.
    this.registeredAdapters = new Map();
    for (const [id, factory] of BOOKING_PROVIDER_REGISTRY.entries()) {
      this.registeredAdapters.set(id, factory(this.getProviderConfig(id)));
    }
  }

  private getProviderConfig(provider: BookingProvider | string): ProviderConfig {
    const prefix = provider.toUpperCase();

    return {
      enabled: this.env[`${prefix}_ENABLED` as keyof typeof this.env] === 'true',
      apiKey: String(this.env[`${prefix}_API_KEY` as keyof typeof this.env] || ''),
      apiSecret: String(this.env[`${prefix}_API_SECRET` as keyof typeof this.env] || ''),
      businessId: String(this.env[`${prefix}_BUSINESS_ID` as keyof typeof this.env] || ''),
      webhookUrl: String(this.env[`${prefix}_WEBHOOK_URL` as keyof typeof this.env] || ''),
    };
  }

  /**
   * Create booking with specified provider
   */
  async createBookingWithProvider(
    provider: BookingProvider,
    data: BookingFormData
  ): Promise<BookingProviderResponse> {
    const adapter = this.providers.get(provider);
    if (!adapter) {
      return { success: false, error: 'Unknown provider' };
    }
    return adapter.createBooking(data);
  }

  /**
   * Get status of all providers
   */
  getProviderStatus(): Record<BookingProvider, { enabled: boolean; configured: boolean }> {
    const status: Record<BookingProvider, { enabled: boolean; configured: boolean }> = {
      mindbody: { enabled: false, configured: false },
      vagaro: { enabled: false, configured: false },
      square: { enabled: false, configured: false },
      calendly: { enabled: false, configured: false },
    };

    for (const [provider, adapter] of this.providers.entries()) {
      status[provider] = {
        enabled: adapter.config.enabled,
        configured: !!(adapter.config.apiKey && adapter.config.businessId),
      };
    }

    return status;
  }

  /**
   * Create booking with all enabled providers (built-in + registered external providers).
   */
  async createBookingWithAllProviders(data: BookingFormData): Promise<BookingProviderResponse[]> {
    // Collect enabled built-in providers
    const enabledBuiltIn = Array.from(this.providers.entries())
      .filter(([, adapter]) => adapter.config.enabled)
      .map(([provider]) => provider);

    // Collect enabled registered (external) providers
    const enabledRegistered = Array.from(this.registeredAdapters.entries())
      .filter(([, adapter]) => adapter.config.enabled)
      .map(([id]) => id);

    const builtInResults = await Promise.allSettled(
      enabledBuiltIn.map((provider) => this.createBookingWithProvider(provider, data))
    );
    const registeredResults = await Promise.allSettled(
      enabledRegistered.map((id) => {
        const adapter = this.registeredAdapters.get(id);
        return adapter
          ? adapter.createBooking(data)
          : Promise.resolve({ success: false, error: `Registered provider '${id}' not found` });
      })
    );

    const allIds = [...enabledBuiltIn, ...enabledRegistered];
    return [...builtInResults, ...registeredResults].map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return { success: false, error: `Provider ${allIds[index]} failed` };
    });
  }
}

/**
 * Lazy-loaded booking providers instance
 * This avoids build-time environment validation
 */
let _bookingProviders: BookingProviders | null = null;

/**
 * Get or create booking providers instance
 */
// [TRACE:FUNC=packages.features.booking.getBookingProviders]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Provider factory function - lazy-loads provider instances to avoid build-time env validation.
export function getBookingProviders(): BookingProviders {
  if (!_bookingProviders) {
    _bookingProviders = new BookingProviders();
  }
  return _bookingProviders;
}

// ─── Provider Registry (Task inf-10) ─────────────────────────────────────────
//
// Open registration system for third-party booking providers. Follows the same
// self-registration pattern used by the section registry in @repo/page-templates.
//
// Usage:
//   import { registerBookingProvider } from '@repo/features/booking';
//   registerBookingProvider('acuity', (config) => new AcuityAdapter(config));
//
// The registration invalidates the cached BookingProviders instance so the next
// getBookingProviders() call picks up the new provider automatically.

/**
 * Factory function that constructs a BookingProviderAdapter from a ProviderConfig.
 * Implement this to add a custom or third-party booking provider.
 */
export type BookingProviderFactory = (config: ProviderConfig) => BookingProviderAdapter;

/**
 * Module-level open registry for external booking provider factories.
 * Built-in providers (Mindbody, Vagaro, Square) are wired directly in BookingProviders constructor.
 * Third-party providers register here via side-effect import of their module.
 */
const BOOKING_PROVIDER_REGISTRY = new Map<string, BookingProviderFactory>();

/**
 * Register a booking provider factory under a unique string ID.
 *
 * Call this in your provider module at import time (side-effect import pattern).
 * Invalidates the cached BookingProviders singleton so the next getBookingProviders()
 * call constructs a fresh instance including the newly registered provider.
 *
 * @param id      - Unique provider identifier (e.g. 'acuity', 'calendly-v2', 'mindbody-v7')
 * @param factory - Function that creates a BookingProviderAdapter from a ProviderConfig
 *
 * @example
 * // In your provider module (e.g. packages/integrations/acuity/src/index.ts):
 * import { registerBookingProvider } from '@repo/features/booking';
 * registerBookingProvider('acuity', (config) => new AcuityAdapter(config));
 */
// [TRACE:FUNC=packages.features.booking.registerBookingProvider]
// [FEAT:EXTENSIBILITY] [FEAT:BOOKING]
// NOTE: inf-10 Provider Registry — enables open extension without modifying built-in providers.
export function registerBookingProvider(id: string, factory: BookingProviderFactory): void {
  if (BOOKING_PROVIDER_REGISTRY.has(id)) {
    console.warn(
      `[booking-registry] Provider '${id}' is already registered — overwriting with new factory.`
    );
  }
  BOOKING_PROVIDER_REGISTRY.set(id, factory);
  // Invalidate cached instance so next call picks up the registered provider.
  _bookingProviders = null;
}

/**
 * Returns a read-only snapshot of the current provider registry.
 * Useful for debugging, tooling, and integration tests.
 *
 * @returns ReadonlyMap of provider IDs to their factory functions
 */
// [TRACE:FUNC=packages.features.booking.getBookingProviderRegistry]
// [FEAT:EXTENSIBILITY]
export function getBookingProviderRegistry(): ReadonlyMap<string, BookingProviderFactory> {
  return BOOKING_PROVIDER_REGISTRY;
}
