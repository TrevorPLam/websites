/**
 * @file packages/integrations/convertkit/src/index.ts
 * Task: [4.1] ConvertKit email marketing adapter
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';

export class ConvertKitAdapter implements EmailAdapter {
  id = 'convertkit';

  constructor(private apiKey: string) {}

  async subscribe(subscriber: EmailSubscriber, formId?: string) {
    if (!formId) return { success: false, error: 'Form ID required' };
    try {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email: subscriber.email,
          first_name: subscriber.firstName,
          tags: subscriber.tags?.join(','),
          fields: subscriber.metadata,
        }),
      });
      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async unsubscribe(email: string) {
    try {
      const response = await fetch('https://api.convertkit.com/v3/unsubscribe', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email,
        }),
      });
      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, any>) {
    return { success: false, error: 'SendEvent not implemented for ConvertKit' };
  }
}
