/**
 * @file packages/integrations/google-maps/src/index.ts
 * Task: [4.5] Google Maps integration (static + interactive)
 */

import type {
  MapsAdapter,
  StaticMapOptions,
  MapsEmbedConfig,
} from '../../maps/contract';

/**
 * Google Maps adapter. Static map via image URL; interactive via JS (load only when hasMapsConsent()).
 */
export class GoogleMapsAdapter implements MapsAdapter {
  id = 'google';
  name = 'Google Maps';

  constructor(private apiKey: string) {}

  getStaticMapUrl(address: string, options?: StaticMapOptions): string {
    const width = options?.width ?? 600;
    const height = options?.height ?? 400;
    const zoom = options?.zoom ?? 15;
    const scale = options?.scale ?? 2;
    const params = new URLSearchParams({
      center: address,
      zoom: String(zoom),
      size: `${width}x${height}`,
      scale: String(scale),
      key: this.apiKey,
    });
    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
  }

  getEmbedConfig(address: string): MapsEmbedConfig {
    return {
      scriptUrl: 'https://maps.googleapis.com/maps/api/js',
      apiKey: this.apiKey,
      config: { address },
    };
  }
}
