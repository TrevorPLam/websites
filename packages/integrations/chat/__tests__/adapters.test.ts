import { IntercomAdapter } from '../../intercom/src';
import { CrispAdapter } from '../../crisp/src';
import { TidioAdapter } from '../../tidio/src';

describe('Chat Integrations', () => {
  describe('IntercomAdapter', () => {
    const adapter = new IntercomAdapter('test-app-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('intercom');
      expect(adapter.name).toBe('Intercom');
    });

    it('should return embed config with scriptUrl and config', () => {
      const config = adapter.getEmbedConfig();
      expect(config.scriptUrl).toContain('widget.intercom.io');
      expect(config.scriptUrl).toContain('test-app-id');
      expect(config.config?.appId).toBe('test-app-id');
    });
  });

  describe('CrispAdapter', () => {
    const adapter = new CrispAdapter('test-website-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('crisp');
      expect(adapter.name).toBe('Crisp');
    });

    it('should return embed config with scriptUrl and config', () => {
      const config = adapter.getEmbedConfig();
      expect(config.scriptUrl).toContain('crisp.chat');
      expect(config.config?.websiteId).toBe('test-website-id');
    });
  });

  describe('TidioAdapter', () => {
    const adapter = new TidioAdapter('test-public-key');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('tidio');
      expect(adapter.name).toBe('Tidio');
    });

    it('should return embed config with scriptUrl and config', () => {
      const config = adapter.getEmbedConfig();
      expect(config.scriptUrl).toContain('tidio.co');
      expect(config.config?.publicKey).toBe('test-public-key');
    });
  });
});
