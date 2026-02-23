/**
 * @file packages/integrations/scheduling/adapters/calcom.ts
 * Task: [4.2] Cal.com scheduling integration
 */

import { SchedulingAdapter, SchedulingEvent, EmbedConfig } from '../contract';

/**
 * Cal.com (formerly Calendso) adapter implementation.
 */
export class CalComAdapter implements SchedulingAdapter {
  id = 'calcom';
  name = 'Cal.com';

  constructor(private username: string) {}

  /**
   * Returns available event types.
   */
  async getEventTypes(): Promise<SchedulingEvent[]> {
    return [];
  }

  /**
   * Returns the Cal.com booking URL.
   */
  getBookingUrl(eventTypeId?: string): string {
    const base = `https://cal.com/${this.username}`;
    return eventTypeId ? `${base}/${eventTypeId}` : base;
  }

  /**
   * Returns the embed configuration for Cal.com.
   */
  getEmbedConfig(eventTypeId?: string): EmbedConfig {
    return {
      url: this.getBookingUrl(eventTypeId),
    };
  }

  /**
   * Generates JSON-LD for the scheduling page.
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
        url: 'https://cal.com',
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
