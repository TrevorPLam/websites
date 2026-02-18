/**
 * @file packages/integrations/mailchimp/src/index.ts
 * Task: [4.1] Mailchimp email marketing adapter
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import { fetchWithRetry } from '../../email/utils';

export class MailchimpAdapter implements EmailAdapter {
  id = 'mailchimp';

  constructor(private apiKey: string, private server: string) {}

  async subscribe(subscriber: EmailSubscriber, listId?: string) {
    if (!listId) return { success: false, error: 'List ID required' };

    try {
      const response = await fetchWithRetry(`https://${this.server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: subscriber.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: subscriber.firstName,
            LNAME: subscriber.lastName,
          },
          tags: subscriber.tags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.detail || 'Subscription failed' };
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async unsubscribe(email: string, listId?: string) {
    if (!listId) return { success: false, error: 'List ID required' };

    try {
      const response = await fetchWithRetry(`https://${this.server}.api.mailchimp.com/3.0/lists/${listId}/members/${email}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'unsubscribed' }),
      });

      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, any>) {
    try {
      const response = await fetchWithRetry(`https://${this.server}.api.mailchimp.com/3.0/lists/members/${email}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: eventName,
          properties: data,
        }),
      });

      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
}
