/**
 * @file packages/integrations/sendgrid/src/index.ts
 * Task: [4.1] SendGrid email marketing adapter
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';

export class SendGridAdapter implements EmailAdapter {
  id = 'sendgrid';

  constructor(private apiKey: string) {}

  async subscribe(subscriber: EmailSubscriber, listId?: string) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
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

  async unsubscribe(email: string, listId?: string) {
    return { success: false, error: 'Unsubscribe not implemented for SendGrid Marketing API via email only' };
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, any>) {
    return { success: false, error: 'SendEvent not implemented for SendGrid' };
  }
}
