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
        json: async () => ({ id: 'subscriber-123' }),
      });

      const result = await adapter.subscribe(subscriber, 'form1');
      expect(result.success).toBe(true);

      // Should make two API calls for v4 two-step process
      expect(fetch).toHaveBeenCalledTimes(2);

      // First call: Create subscriber
      expect((fetch as jest.Mock).mock.calls[0]).toEqual([
        'https://api.kit.com/v4/subscribers',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': 'key',
          },
          body: expect.stringContaining('"email_address":"test@example.com"'),
        }),
      ]);

      // Second call: Add to form
      expect((fetch as jest.Mock).mock.calls[1]).toEqual([
        'https://api.kit.com/v4/forms/form1/subscribers',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': 'key',
          },
          body: expect.stringContaining('"email_address":"test@example.com"'),
        }),
      ]);
    });
  });
});
