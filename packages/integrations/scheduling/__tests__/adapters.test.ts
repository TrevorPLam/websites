import { CalendlyAdapter } from '../../calendly/src';
import { AcuityAdapter } from '../../acuity/src';
import { CalComAdapter } from '../../calcom/src';

describe('Scheduling Integrations', () => {
  describe('CalendlyAdapter', () => {
    const adapter = new CalendlyAdapter('test-user');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('calendly');
      expect(adapter.name).toBe('Calendly');
    });

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://calendly.com/test-user');
    });

    it('should generate a correct booking URL with event type', () => {
      const url = adapter.getBookingUrl('15min');
      expect(url).toBe('https://calendly.com/test-user/15min');
    });

    it('should return available event types', async () => {
      const events = await adapter.getEventTypes();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should return correct embed configuration', () => {
      const config = adapter.getEmbedConfig();
      expect(config.url).toBe('https://calendly.com/test-user');
    });

    it('should generate a valid JSON-LD schema', () => {
      const jsonLd = adapter.generateJsonLd();
      const schema = JSON.parse(jsonLd);
      expect(schema['@type']).toBe('Service');
      expect(schema.name).toBe('Calendly');
    });
  });

  describe('AcuityAdapter', () => {
    const adapter = new AcuityAdapter('test-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('acuity');
      expect(adapter.name).toBe('Acuity');
    });

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://app.acuityscheduling.com/schedule.php?owner=test-id');
    });

    it('should generate a correct booking URL with appointment type', () => {
      const url = adapter.getBookingUrl('123');
      expect(url).toContain('appointmentType=123');
    });

    it('should return correct embed configuration', () => {
      const config = adapter.getEmbedConfig();
      expect(config.url).toBe('https://app.acuityscheduling.com/schedule.php?owner=test-id');
    });

    it('should generate a valid JSON-LD schema', () => {
      const jsonLd = adapter.generateJsonLd();
      const schema = JSON.parse(jsonLd);
      expect(schema['@type']).toBe('Service');
      expect(schema.name).toBe('Acuity');
    });
  });

  describe('CalComAdapter', () => {
    const adapter = new CalComAdapter('test-user');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('calcom');
      expect(adapter.name).toBe('Cal.com');
    });

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://cal.com/test-user');
    });

    it('should generate a correct booking URL with event type', () => {
      const url = adapter.getBookingUrl('15-min');
      expect(url).toBe('https://cal.com/test-user/15-min');
    });

    it('should return correct embed configuration', () => {
      const config = adapter.getEmbedConfig();
      expect(config.url).toBe('https://cal.com/test-user');
    });

    it('should generate a valid JSON-LD schema', () => {
      const jsonLd = adapter.generateJsonLd();
      const schema = JSON.parse(jsonLd);
      expect(schema['@type']).toBe('Service');
      expect(schema.name).toBe('Cal.com');
    });
  });
});
