/**
 * @file packages/integrations/scheduling/adapters/calendly.ts
 * Task: [4.2] Calendly scheduling integration
 */

import { SchedulingAdapter, SchedulingEvent, EmbedConfig } from '../contract';

/**
 * Calendly adapter implementation.
 * Supports generating booking URLs and embed configurations.
 */
export class CalendlyAdapter implements SchedulingAdapter {
  id = 'calendly';
  name = 'Calendly';

  constructor(private username: string) {}

  /**
   * Returns available event types.
   * Note: In this version, we return placeholder as per "no calendar sync" constraint.
   */
  async getEventTypes(): Promise<SchedulingEvent[]> {
    return [];
  }

  /**
   * Returns the Calendly booking URL.
   */
  getBookingUrl(eventTypeId?: string): string {
    const base = `https://calendly.com/${this.username}`;
    return eventTypeId ? `${base}/${eventTypeId}` : base;
  }

  /**
   * Returns the embed configuration for Calendly.
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
