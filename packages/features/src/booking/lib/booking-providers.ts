// File: packages/features/src/booking/lib/booking-providers.ts  [TRACE:FILE=packages.features.booking.bookingProviders]
// Purpose: External booking provider integration system supporting multiple appointment scheduling platforms.

import { BookingFormData } from './booking-schema';
import { validateEnv } from '@repo/infra/env';

export type BookingProvider = 'mindbody' | 'vagaro' | 'square' | 'calendly';

export interface ProviderConfig {
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  businessId?: string;
  webhookUrl?: string;
}

export interface BookingProviderResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  providerUrl?: string;
}

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
    } as const;
    return serviceMap[serviceType as keyof typeof serviceMap] || '5';
  }

  private formatDateTime(date: string, timeSlot: string): string {
    const dateObj = new Date(date);
    const timeMap = {
      morning: 'T09:00:00',
      afternoon: 'T14:00:00',
      evening: 'T16:00:00',
    } as const;
    return (
      dateObj.toISOString().split('T')[0] + (timeMap[timeSlot as keyof typeof timeMap] ?? 'T14:00:00')
    );
  }

  private calculateEndTime(date: string, timeSlot: string): string {
    const start = new Date(this.formatDateTime(date, timeSlot));
    const duration = 60;
    const end = new Date(start.getTime() + duration * 60000);
    return end.toISOString();
  }
}

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
    } as const;
    return serviceMap[serviceType as keyof typeof serviceMap] || '105';
  }

  private getTimeSlot(timeSlot: string): string {
    const timeMap = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '16:00',
    } as const;
    return timeMap[timeSlot as keyof typeof timeMap] || '14:00';
  }
}

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
    return 'customer_id_placeholder';
  }

  private getServiceId(serviceType: string): string {
    const serviceMap = {
      'haircut-style': 'SVC001',
      'color-highlights': 'SVC002',
      treatment: 'SVC003',
      'special-occasion': 'SVC004',
      consultation: 'SVC005',
    } as const;
    return serviceMap[serviceType as keyof typeof serviceMap] || 'SVC005';
  }

  private formatDateTime(date: string, timeSlot: string): string {
    const dateObj = new Date(date);
    const timeMap = {
      morning: 'T09:00:00-05:00',
      afternoon: 'T14:00:00-05:00',
      evening: 'T16:00:00-05:00',
    } as const;
    return (
      dateObj.toISOString().split('T')[0] + (timeMap[timeSlot as keyof typeof timeMap] ?? 'T14:00:00-05:00')
    );
  }
}

export class BookingProviders {
  private mindbody: MindbodyProvider;
  private vagaro: VagaroProvider;
  private square: SquareProvider;
  private readonly env = validateEnv();

  constructor() {
    this.mindbody = new MindbodyProvider(this.getProviderConfig('mindbody'));
    this.vagaro = new VagaroProvider(this.getProviderConfig('vagaro'));
    this.square = new SquareProvider(this.getProviderConfig('square'));
  }

  private getProviderConfig(provider: BookingProvider): ProviderConfig {
    const prefix = provider.toUpperCase();

    return {
      enabled: this.env[`${prefix}_ENABLED` as keyof typeof this.env] === 'true',
      apiKey: String(this.env[`${prefix}_API_KEY` as keyof typeof this.env] || ''),
      apiSecret: String(this.env[`${prefix}_API_SECRET` as keyof typeof this.env] || ''),
      businessId: String(this.env[`${prefix}_BUSINESS_ID` as keyof typeof this.env] || ''),
      webhookUrl: String(this.env[`${prefix}_WEBHOOK_URL` as keyof typeof this.env] || ''),
    };
  }

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
        enabled: false,
        configured: false,
      },
    };
  }

  async createBookingWithAllProviders(data: BookingFormData): Promise<BookingProviderResponse[]> {
    const providers: BookingProvider[] = ['mindbody', 'vagaro', 'square'];
    const results = await Promise.allSettled(
      providers.map((provider) => this.createBookingWithProvider(provider, data))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return { success: false, error: `Provider ${providers[index]} failed` };
    });
  }
}

let _bookingProviders: BookingProviders | null = null;

export function getBookingProviders(): BookingProviders {
  if (!_bookingProviders) {
    _bookingProviders = new BookingProviders();
  }
  return _bookingProviders;
}
