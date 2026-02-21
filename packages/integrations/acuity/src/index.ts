/**
 * @file packages/integrations/acuity/src/index.ts
 * Task: [4.2] Acuity scheduling integration
 */

import { SchedulingAdapter, SchedulingEvent, EmbedConfig } from '../../scheduling/contract';

/**
 * Acuity Scheduling adapter implementation.
 */
export class AcuityAdapter implements SchedulingAdapter {
  id = 'acuity';
  name = 'Acuity';

  constructor(private businessId: string) {}

  /**
   * Returns available event types.
   */
  async getEventTypes(): Promise<SchedulingEvent[]> {
    return [];
  }

  /**
   * Returns the Acuity booking URL.
   */
  getBookingUrl(eventTypeId?: string): string {
    const base = `https://app.acuityscheduling.com/schedule.php?owner=${this.businessId}`;
    return eventTypeId ? `${base}&appointmentType=${eventTypeId}` : base;
  }

  /**
   * Returns the embed configuration for Acuity.
   */
  getEmbedConfig(eventTypeId?: string): EmbedConfig {
    return {
      url: this.getBookingUrl(eventTypeId),
    };
  }

  /**
   * Generates a JSON-LD schema for the scheduling service.
   */
  generateJsonLd(eventTypeId?: string): string {
    const url = this.getBookingUrl(eventTypeId);
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: this.name,
      provider: {
        '@type': 'Organization',
        name: this.name,
      },
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: url,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Reservation',
          name: 'Booking',
        },
      },
    };
    return JSON.stringify(schema, null, 2);
  }
}
