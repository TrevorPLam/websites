import { CalendlyAdapter } from '../../calendly/src';
import { AcuityAdapter } from '../../acuity/src';
import { CalComAdapter } from '../../calcom/src';

describe('Scheduling Integrations', () => {
  describe('CalendlyAdapter', () => {
    const adapter = new CalendlyAdapter('test-user');

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://calendly.com/test-user');
    });

    it('should return available event types', async () => {
      const events = await adapter.getEventTypes();
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('AcuityAdapter', () => {
    const adapter = new AcuityAdapter('test-id');

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://app.acuityscheduling.com/schedule.php?owner=test-id');
    });
  });

  describe('CalComAdapter', () => {
    const adapter = new CalComAdapter('test-user');

    it('should generate a correct booking URL', () => {
      const url = adapter.getBookingUrl();
      expect(url).toBe('https://cal.com/test-user');
    });
  });
});
