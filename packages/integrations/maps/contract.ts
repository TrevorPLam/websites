/**
 * @file packages/integrations/maps/contract.ts
 * Task: [4.5] Maps integration contract
 *
 * Purpose: Static map image URL and interactive embed config.
 * Google Maps: static via image URL; interactive script load only after consent.
 */

/** Options for generating a static map image URL. */
export interface StaticMapOptions {
  width?: number;
  height?: number;
  zoom?: number;
  scale?: 1 | 2;
}

/** Config for interactive map embed; script should load only when hasMapsConsent(). */
export interface MapsEmbedConfig {
  scriptUrl?: string;
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  config?: Record<string, unknown>;
}

export interface MapsAdapter {
  id: string;
  name: string;

  /**
   * Returns a URL for a static map image (no JavaScript).
   */
  getStaticMapUrl(address: string, options?: StaticMapOptions): string;

  /**
   * Returns config for interactive map. Caller should load script only when consent granted.
   */
  getEmbedConfig(address: string): MapsEmbedConfig;
}
