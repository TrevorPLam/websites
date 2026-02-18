/**
 * @file packages/integrations/calcom/src/index.ts
 * Task: [4.2] Cal.com scheduling integration
 */

import { 
  SchedulingAdapter, 
  SchedulingEvent, 
  EmbedConfig 
} from '../../scheduling/contract';

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
}
