// File: packages/features/src/booking/lib/booking-provider-adapter.ts  [TRACE:FILE=packages.features.booking.bookingProviderAdapter]
// Purpose: Abstract adapter interface for booking provider integrations, eliminating code duplication
//          across multiple provider implementations. Implements Strategy pattern for provider abstraction.
//
// Relationship: Uses booking-schema (BookingFormData). Implementations live in booking-providers.ts.
// System role: Strategy pattern; createBooking calls buildRequestBody/parseResponse; fetch in base class.
// Assumptions: Subclasses implement buildRequestBody, parseResponse; config.enabled and apiKey gate requests.
//
// Exports / Entry: BookingProviderAdapter interface, BaseBookingProviderAdapter abstract class
// Used by: Booking provider implementations (Mindbody, Vagaro, Square, Calendly)
//
// Invariants:
// - All providers must implement the adapter interface
// - Provider-specific API details are encapsulated within adapter implementations
// - Service ID mapping must handle unknown service types gracefully
// - Time slot mapping must handle unknown time slots gracefully
// - API failures must be logged but not block booking flow
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Multi-provider appointment scheduling
// - [FEAT:INTEGRATION] External API integration abstraction
// - [FEAT:ARCHITECTURE] Strategy pattern for provider abstraction
// - [FEAT:RELIABILITY] Error handling and fallback mechanisms

import type { BookingFormData } from './booking-schema';

/**
 * Booking provider types
 */
export type BookingProvider = 'mindbody' | 'vagaro' | 'square' | 'calendly';

/**
 * Booking provider response interface
 */
// [TRACE:INTERFACE=packages.features.booking.BookingProviderResponse]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Response interface - standardizes booking outcomes across different provider APIs.
export interface BookingProviderResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  providerUrl?: string;
}

/**
 * Provider configuration interface
 */
// [TRACE:INTERFACE=packages.features.booking.ProviderConfig]
// [FEAT:BOOKING] [FEAT:CONFIGURATION] [FEAT:SECURITY]
// NOTE: Configuration interface - defines secure provider setup with API credentials and endpoints.
export interface ProviderConfig {
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  businessId?: string;
  webhookUrl?: string;
}

/**
 * Adapter interface for booking providers
 * Implements Strategy pattern to abstract provider-specific implementations
 */
// [TRACE:INTERFACE=packages.features.booking.BookingProviderAdapter]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:ARCHITECTURE]
// NOTE: Adapter interface - defines contract for all booking provider implementations, enabling swappable providers.
export interface BookingProviderAdapter {
  /** Provider name (e.g., 'mindbody', 'vagaro') */
  readonly name: string;
  /** Provider API base URL */
  readonly apiBase: string;
  /** Provider configuration */
  readonly config: ProviderConfig;

  /**
   * Maps service type ID to provider-specific service ID
   */
  mapServiceId(serviceType: string): string;

  /**
   * Maps time slot value to provider-specific time format
   */
  mapTimeSlot(timeSlot: string): string;

  /**
   * Builds provider-specific request body from booking form data
   */
  buildRequestBody(data: BookingFormData): Record<string, unknown>;

  /**
   * Parses provider-specific response to standard BookingProviderResponse
   */
  parseResponse(json: unknown): BookingProviderResponse;

  /**
   * Creates booking with the provider
   */
  createBooking(data: BookingFormData): Promise<BookingProviderResponse>;
}

/**
 * Base implementation of BookingProviderAdapter
 * Provides common functionality and error handling
 */
// [TRACE:CLASS=packages.features.booking.BaseBookingProviderAdapter]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:ARCHITECTURE] [FEAT:RELIABILITY]
// NOTE: Base adapter - provides shared implementation for common provider operations, reducing duplication.
export abstract class BaseBookingProviderAdapter implements BookingProviderAdapter {
  abstract readonly name: string;
  abstract readonly apiBase: string;
  readonly config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Default service ID mapping (can be overridden)
   * Maps service type to a default ID - providers should override with their specific mapping
   */
  mapServiceId(serviceType: string): string {
    // Default: use service type as-is
    // Providers should override with their specific service ID mapping
    return serviceType;
  }

  /**
   * Default time slot mapping (can be overridden)
   * Maps time slot to a default time - providers should override with their specific mapping
   */
  mapTimeSlot(timeSlot: string): string {
    // Default time mapping
    const timeMap: Record<string, string> = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '16:00',
    };
    return timeMap[timeSlot] ?? '14:00';
  }

  /**
   * Builds request body (must be implemented by subclasses)
   */
  abstract buildRequestBody(data: BookingFormData): Record<string, unknown>;

  /**
   * Parses response (must be implemented by subclasses)
   */
  abstract parseResponse(json: unknown): BookingProviderResponse;

  /**
   * Common booking creation logic with error handling
   */
  async createBooking(data: BookingFormData): Promise<BookingProviderResponse> {
    if (!this.config.enabled || !this.config.apiKey) {
      return { success: false, error: `${this.name} not configured` };
    }

    try {
      const response = await fetch(this.apiBase, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...this.getAdditionalHeaders(),
        },
        body: JSON.stringify(this.buildRequestBody(data)),
      });

      if (!response.ok) {
        throw new Error(`${this.name} API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseResponse(result);
    } catch (error) {
      console.error(`${this.name} booking error:`, error);
      return { success: false, error: `Failed to create ${this.name} booking` };
    }
  }

  /**
   * Override to provide additional headers (e.g., API version)
   */
  protected getAdditionalHeaders(): Record<string, string> {
    return {};
  }
}
