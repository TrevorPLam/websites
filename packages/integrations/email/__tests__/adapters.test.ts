import { MailchimpAdapter } from '../../mailchimp/src';
import { SendGridAdapter } from '../../sendgrid/src';
import { ConvertKitAdapter } from '../../convertkit/src';

// Mock fetch
global.fetch = jest.fn();

describe('Email Marketing Adapters', () => {
  const subscriber = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    tags: ['tag1'],
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('MailchimpAdapter', () => {
    const adapter = new MailchimpAdapter('key', 'us1');

    it('should subscribe successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await adapter.subscribe(subscriber, 'list1');
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('mailchimp.com'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should handle subscription error', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Error message' }),
      });

      const result = await adapter.subscribe(subscriber, 'list1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error message');
    });
  });

  describe('SendGridAdapter', () => {
    const adapter = new SendGridAdapter('key');

    it('should subscribe successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await adapter.subscribe(subscriber, 'list1');
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/marketing/contacts',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('ConvertKitAdapter', () => {
    const adapter = new ConvertKitAdapter('key');

    it('should subscribe successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await adapter.subscribe(subscriber, 'form1');
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/forms/form1/subscribe',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
