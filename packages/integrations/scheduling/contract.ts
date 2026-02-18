/**
 * @file packages/integrations/scheduling/contract.ts
 * Task: [4.2] Scheduling integration contract
 * 
 * Purpose: Defines the shared interface for scheduling adapters.
 * Supports Calendly, Acuity, Cal.com.
 */

export interface SchedulingEvent {
  id: string;
  name: string;
  duration?: number;
  description?: string;
}

export interface EmbedConfig {
  url: string;
  prefill?: Record<string, string>;
  utm?: Record<string, string>;
}

export interface SchedulingAdapter {
  id: string;
  name: string;
  
  /**
   * Returns the list of available event types.
   */
  getEventTypes(): Promise<SchedulingEvent[]>;
  
  /**
   * Returns the booking URL for a specific event type.
   */
  getBookingUrl(eventTypeId?: string): string;
  
  /**
   * Returns the configuration for the embed widget.
   */
  getEmbedConfig(eventTypeId?: string): EmbedConfig;
  
  /**
   * Generates a JSON-LD schema for the scheduling service.
   */
  generateJsonLd(eventTypeId?: string): string;
}
