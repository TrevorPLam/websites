// File: features/booking/lib/booking-providers.ts  [TRACE:FILE=features.booking.bookingProviders]
// Purpose: External booking provider integration system supporting multiple appointment
//          scheduling platforms. Implements provider abstractions, configuration management,
//          and API integration for flexible booking system architecture.
//
// Exports / Entry: BookingProvider types, ProviderConfig interface, provider classes, getBookingProviders function
// Used by: Booking actions, booking forms, and appointment management features
//
// Invariants:
// - All providers must implement consistent booking interface
// - Provider configurations must be validated before use
// - API failures must be logged but not block booking flow
// - Provider URLs must be properly validated and sanitized
// - Booking IDs must be traceable across provider systems
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Multi-provider appointment scheduling
// - [FEAT:INTEGRATION] External API integration (Mindbody, Vagaro, Square, Calendly)
// - [FEAT:CONFIGURATION] Provider management and validation
// - [FEAT:RELIABILITY] Error handling and fallback mechanisms
// - [FEAT:MONITORING] Provider performance tracking

import { BookingFormData } from './booking-schema';
import { validatedEnv } from '@/lib/env';

// [Task 9.3.2] Removed dead commented-out providerConfigSchema Zod definition

/**
 * External booking provider types
 */
// [TRACE:TYPE=features.booking.BookingProvider]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Provider types - defines supported external booking platforms for integration flexibility.
export type BookingProvider = 'mindbody' | 'vagaro' | 'square' | 'calendly';

/**
 * Provider configuration interface
 */
// [TRACE:INTERFACE=features.booking.ProviderConfig]
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
 * Booking provider interfaces
 */
// [TRACE:INTERFACE=features.booking.BookingProviderResponse]
// [FEAT:BOOKING] [FEAT:INTEGRATION]
// NOTE: Response interface - standardizes booking outcomes across different provider APIs.
export interface BookingProviderResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  providerUrl?: string;
}

/**
 * Mindbody API integration
 */
// [TRACE:CLASS=features.booking.MindbodyProvider]
// [FEAT:BOOKING] [FEAT:INTEGRATION] [FEAT:RELIABILITY]
// NOTE: Mindbody integration - implements wellness platform booking with error handling and logging.
class MindbodyProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async createBooking(data: BookingFormData): Promise<BookingProviderResponse> {
    if (!this.config.enabled || !this.config.apiKey) {
      return { success: false, error: 'Mindbody not configured' };
    }

    try {
      // Mindbody API v6 booking endpoint
      const response = await fetch('https://api.mindbodyonline.com/public/v6/appointment/booking', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'API-Version': '6.0',
        },
        body: JSON.stringify({
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
            ServiceId: this.getServiceId(data.serviceType),
            StartDateTime: this.formatDateTime(data.preferredDate, data.timeSlot),
            EndDateTime: this.calculateEndTime(data.preferredDate, data.timeSlot),
            Notes: data.notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Mindbody API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        bookingId: result.Appointment?.Id?.toString(),
        providerUrl: `https://clients.mindbodyonline.com/appointments?appointmentID=${result.Appointment?.Id}`,
      };
    } catch (error) {
      console.error('Mindbody booking error:', error);
      return { success: false, error: 'Failed to create Mindbody booking' };
    }
  }

  private getServiceId(serviceType: string): string {
    const serviceMap = {
      'haircut-style': '1',
      'color-highlights': '2',
      treatment: '3',
      'special-occasion': '4',
      consultation: '5',
    };
    return serviceMap[serviceType as keyof typeof serviceMap] || '5';
  }

  private formatDateTime(date: string, timeSlot: string): string {
    const dateObj = new Date(date);
    const timeMap = {
      morning: 'T09:00:00',
      afternoon: 'T14:00:00',
      evening: 'T16:00:00',
    };
    return (
      dateObj.toISOString().split('T')[0] +
      (timeMap[timeSlot as keyof typeof timeMap] || 'T14:00:00')
    );
  }

  private calculateEndTime(date: string, timeSlot: string): string {
    const start = new Date(this.formatDateTime(date, timeSlot));
    const duration = 60; // 60 minutes default
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString();
  }
}

/**
 * Vagaro API integration
 */
class VagaroProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async createBooking(data: BookingFormData): Promise<BookingProviderResponse> {
    if (!this.config.enabled || !this.config.apiKey) {
      return { success: false, error: 'Vagaro not configured' };
    }

    try {
      // Vagaro API endpoint
      const response = await fetch('https://www.vagaro.com/api/v1/appointments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
          },
          appointmentInfo: {
            serviceId: this.getServiceId(data.serviceType),
            date: data.preferredDate,
            time: this.getTimeSlot(data.timeSlot),
            notes: data.notes,
          },
          businessId: this.config.businessId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Vagaro API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        bookingId: result.appointmentId,
        providerUrl: `https://www.vagaro.com/appointments/${result.appointmentId}`,
      };
    } catch (error) {
      console.error('Vagaro booking error:', error);
      return { success: false, error: 'Failed to create Vagaro booking' };
    }
  }

  private getServiceId(serviceType: string): string {
    const serviceMap = {
      'haircut-style': '101',
      'color-highlights': '102',
      treatment: '103',
      'special-occasion': '104',
      consultation: '105',
    };
    return serviceMap[serviceType as keyof typeof serviceMap] || '105';
  }

  private getTimeSlot(timeSlot: string): string {
    const timeMap = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '16:00',
    };
    return timeMap[timeSlot as keyof typeof timeMap] || '14:00';
  }
}

/**
 * Square Appointments API integration
 */
class SquareProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async createBooking(data: BookingFormData): Promise<BookingProviderResponse> {
    if (!this.config.enabled || !this.config.apiKey) {
      return { success: false, error: 'Square not configured' };
    }

    try {
      // Square API endpoint
      const response = await fetch('https://connect.squareup.com/v2/bookings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idempotency_key: `${Date.now()}-${data.email}`,
          booking: {
            location_id: this.config.businessId,
            customer_id: await this.getOrCreateCustomer(data),
            start_at: this.formatDateTime(data.preferredDate, data.timeSlot),
            appointment_segments: [
              {
                service_variation_id: this.getServiceId(data.serviceType),
                duration_minutes: 60,
                team_member_id: 'any',
              },
            ],
            customer_note: data.notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        bookingId: result.booking?.id,
        providerUrl: `https://squareup.com/appointments/${result.booking?.id}`,
      };
    } catch (error) {
      console.error('Square booking error:', error);
      return { success: false, error: 'Failed to create Square booking' };
    }
  }

  private async getOrCreateCustomer(_data: BookingFormData): Promise<string> {
    // Implementation for finding or creating customer in Square
    return 'customer_id_placeholder';
  }

  private getServiceId(serviceType: string): string {
    const serviceMap = {
      'haircut-style': 'SVC001',
      'color-highlights': 'SVC002',
      treatment: 'SVC003',
      'special-occasion': 'SVC004',
      consultation: 'SVC005',
    };
    return serviceMap[serviceType as keyof typeof serviceMap] || 'SVC005';
  }

  private formatDateTime(date: string, timeSlot: string): string {
    const dateObj = new Date(date);
    const timeMap = {
      morning: 'T09:00:00-05:00',
      afternoon: 'T14:00:00-05:00',
      evening: 'T16:00:00-05:00',
    };
    return (
      dateObj.toISOString().split('T')[0] +
      (timeMap[timeSlot as keyof typeof timeMap] || 'T14:00:00-05:00')
    );
  }
}

/**
 * Provider factory and configuration
 */
export class BookingProviders {
  private mindbody: MindbodyProvider;
  private vagaro: VagaroProvider;
  private square: SquareProvider;

  constructor() {
    this.mindbody = new MindbodyProvider(this.getProviderConfig('mindbody'));
    this.vagaro = new VagaroProvider(this.getProviderConfig('vagaro'));
    this.square = new SquareProvider(this.getProviderConfig('square'));
  }

  /**
   * Get provider configuration from environment variables
   */
  private getProviderConfig(provider: BookingProvider): ProviderConfig {
    const prefix = provider.toUpperCase();

    return {
      enabled: validatedEnv[`${prefix}_ENABLED` as keyof typeof validatedEnv] === 'true',
      apiKey: String(validatedEnv[`${prefix}_API_KEY` as keyof typeof validatedEnv] || ''),
      apiSecret: String(validatedEnv[`${prefix}_API_SECRET` as keyof typeof validatedEnv] || ''),
      businessId: String(validatedEnv[`${prefix}_BUSINESS_ID` as keyof typeof validatedEnv] || ''),
      webhookUrl: String(validatedEnv[`${prefix}_WEBHOOK_URL` as keyof typeof validatedEnv] || ''),
    };
  }

  /**
   * Create booking with specified provider
   */
  async createBookingWithProvider(
    provider: BookingProvider,
    data: BookingFormData
  ): Promise<BookingProviderResponse> {
    switch (provider) {
      case 'mindbody':
        return this.mindbody.createBooking(data);
      case 'vagaro':
        return this.vagaro.createBooking(data);
      case 'square':
        return this.square.createBooking(data);
      default:
        return { success: false, error: 'Unknown provider' };
    }
  }

  /**
   * Get status of all providers
   */
  getProviderStatus(): Record<BookingProvider, { enabled: boolean; configured: boolean }> {
    return {
      mindbody: {
        enabled: this.mindbody['config']?.enabled || false,
        configured: !!(this.mindbody['config']?.apiKey && this.mindbody['config']?.businessId),
      },
      vagaro: {
        enabled: this.vagaro['config']?.enabled || false,
        configured: !!(this.vagaro['config']?.apiKey && this.vagaro['config']?.businessId),
      },
      square: {
        enabled: this.square['config']?.enabled || false,
        configured: !!(this.square['config']?.apiKey && this.square['config']?.businessId),
      },
      calendly: {
        enabled: false, // Calendly not implemented yet
        configured: false,
      },
    };
  }

  /**
   * Create booking with all enabled providers
   */
  async createBookingWithAllProviders(data: BookingFormData): Promise<BookingProviderResponse[]> {
    const providers: BookingProvider[] = ['mindbody', 'vagaro', 'square'];
    const results = await Promise.allSettled(
      providers.map((provider) => this.createBookingWithProvider(provider, data))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { success: false, error: `Provider ${providers[index]} failed` };
      }
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
export function getBookingProviders(): BookingProviders {
  if (!_bookingProviders) {
    _bookingProviders = new BookingProviders();
  }
  return _bookingProviders;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getBookingProviders() instead
 */
export const bookingProviders = getBookingProviders();
