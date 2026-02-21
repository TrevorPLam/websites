/**
 * @file packages/integrations/convertkit/src/index.ts
 * Task: [4.1] ConvertKit email marketing adapter
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import { fetchWithRetry } from '../../email/utils';

export class ConvertKitAdapter implements EmailAdapter {
  id = 'convertkit';

  constructor(private apiKey: string) {}

  async subscribe(subscriber: EmailSubscriber, formId?: string) {
    if (!formId) return { success: false, error: 'Form ID required' };

    try {
      const response = await fetchWithRetry(
        `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: this.apiKey,
            email: subscriber.email,
            first_name: subscriber.firstName,
            tags: subscriber.tags?.join(','),
          }),
        }
      );

      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async unsubscribe() {
    // ConvertKit unsubscribe requires the subscriber ID which we don't have.
    return { success: false, error: 'Unsubscribe not fully implemented for ConvertKit' };
  }

  async sendEvent() {
    return { success: false, error: 'Event sending not implemented for ConvertKit' };
  }
}
