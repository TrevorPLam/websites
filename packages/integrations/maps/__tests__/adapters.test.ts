import { GoogleMapsAdapter } from '../../google-maps/src';

describe('Maps Integrations', () => {
  describe('GoogleMapsAdapter', () => {
    const adapter = new GoogleMapsAdapter('test-api-key');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('google');
      expect(adapter.name).toBe('Google Maps');
    });

    it('should return static map URL with address and key', () => {
      const url = adapter.getStaticMapUrl('123 Main St, City');
      expect(url).toContain('maps.googleapis.com');
      expect(url).toContain('staticmap');
      expect(url).toContain('123+Main+St');
      expect(url).toContain('test-api-key');
    });

    it('should accept static map options', () => {
      const url = adapter.getStaticMapUrl('Address', {
        width: 400,
        height: 300,
        zoom: 12,
      });
      expect(url).toContain('400x300');
      expect(url).toContain('zoom=12');
    });

    it('should return embed config with scriptUrl and apiKey', () => {
      const config = adapter.getEmbedConfig('123 Main St');
      expect(config.scriptUrl).toContain('maps.googleapis.com');
      expect(config.apiKey).toBe('test-api-key');
      expect(config.config?.address).toBe('123 Main St');
    });
  });
});
