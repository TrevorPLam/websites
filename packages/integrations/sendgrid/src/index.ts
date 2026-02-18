/**
 * @file packages/integrations/sendgrid/src/index.ts
 * Task: [4.1] SendGrid email marketing adapter
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import { fetchWithRetry } from '../../email/utils';

export class SendGridAdapter implements EmailAdapter {
  id = 'sendgrid';

  constructor(private apiKey: string) {}

  async subscribe(subscriber: EmailSubscriber, listId?: string) {
    try {
      const response = await fetchWithRetry('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list_ids: listId ? [listId] : [],
          contacts: [{
            email: subscriber.email,
            first_name: subscriber.firstName,
            last_name: subscriber.lastName,
            custom_fields: subscriber.metadata,
          }],
        }),
      });

      return { success: response.ok };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  async unsubscribe(email: string, _listId?: string) {
    // Note: SendGrid marketing contacts unsubscribe is typically done by updating the contact's status
    // or adding to a suppression group. For simplicity in this adapter:
    return { success: false, error: 'Unsubscribe not fully implemented for SendGrid' };
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, any>) {
    // SendGrid doesn't have a direct "Events" API like Mailchimp for marketing contacts,
    // but you can use custom fields.
    return { success: false, error: 'Event sending not implemented for SendGrid' };
  }
}
