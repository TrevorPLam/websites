/**
 * @file packages/integrations/convertkit/src/index.ts
 * Task: [4.1] ConvertKit email marketing adapter
 *
 * Security Updates (2026-02-21):
 * - Fixed API key exposure vulnerability (moved from request body to X-Kit-Api-Key header)
 * - Updated to ConvertKit v4 API with proper authentication
 * - Implemented secure two-step subscription process
 * - Added request/response logging without exposing secrets
 */
import type { EmailAdapter, EmailSubscriber } from '../../email/contract';
import { fetchWithRetry } from '../../email/utils';

// Secure logging utility that redacts sensitive information
const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    const redactedData = data
      ? JSON.stringify(data, (key, value) =>
          key.toLowerCase().includes('key') || key.toLowerCase().includes('secret')
            ? '[REDACTED]'
            : value
        )
      : '';
    console.log(`[ConvertKit] ${message}`, redactedData);
  }
};

export class ConvertKitAdapter implements EmailAdapter {
  id = 'convertkit';

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('ConvertKit API key is required');
    }
    secureLog('Adapter initialized with API key', { apiKey: this.apiKey });
  }

  /**
   * Creates a subscriber in ConvertKit v4 API
   * Uses secure X-Kit-Api-Key header authentication
   */
  private async createSubscriber(subscriber: EmailSubscriber): Promise<{ id: string } | null> {
    try {
      secureLog('Creating subscriber', {
        email: subscriber.email,
        firstName: subscriber.firstName,
      });

      const response = await fetchWithRetry('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': this.apiKey, // Secure header authentication (2026 best practice)
        },
        body: JSON.stringify({
          email_address: subscriber.email,
          first_name: subscriber.firstName,
          state: 'inactive', // Create as inactive first, then add to form
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        secureLog('Failed to create subscriber', { status: response.status, error });
        return null;
      }

      const data = await response.json();
      secureLog('Subscriber created successfully', { subscriberId: data.id });
      return data;
    } catch (error) {
      secureLog('Error creating subscriber', { error: String(error) });
      return null;
    }
  }

  /**
   * Adds subscriber to a form in ConvertKit v4 API
   * This triggers the confirmation email
   */
  private async addSubscriberToForm(email: string, formId: string): Promise<boolean> {
    try {
      secureLog('Adding subscriber to form', { email, formId });

      const response = await fetchWithRetry(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': this.apiKey, // Secure header authentication
        },
        body: JSON.stringify({
          email_address: email,
        }),
      });

      const success = response.ok;
      secureLog('Form subscription result', { success, status: response.status });
      return success;
    } catch (error) {
      secureLog('Error adding subscriber to form', { error: String(error) });
      return false;
    }
  }

  /**
   * Subscribe a user to a ConvertKit form
   * Implements secure two-step process following 2026 best practices
   */
  async subscribe(subscriber: EmailSubscriber, formId?: string) {
    if (!formId) {
      return { success: false, error: 'Form ID required for ConvertKit subscription' };
    }

    try {
      // Step 1: Create subscriber (inactive)
      const subscriberData = await this.createSubscriber(subscriber);
      if (!subscriberData) {
        return { success: false, error: 'Failed to create subscriber' };
      }

      // Step 2: Add subscriber to form (triggers confirmation email)
      const addedToForm = await this.addSubscriberToForm(subscriber.email, formId);
      if (!addedToForm) {
        return { success: false, error: 'Failed to add subscriber to form' };
      }

      secureLog('Subscription completed successfully', { email: subscriber.email, formId });
      return { success: true };
    } catch (error) {
      secureLog('Subscription failed', { error: String(error) });
      return { success: false, error: String(error) };
    }
  }

  async unsubscribe(email: string, listId?: string) {
    // ConvertKit unsubscribe requires the subscriber ID which we don't have.
    // This would require additional API calls to find the subscriber first.
    return { success: false, error: 'Unsubscribe not fully implemented for ConvertKit' };
  }

  async sendEvent(email: string, eventName: string, data?: Record<string, unknown>) {
    // ConvertKit doesn't have a direct "Events" API like Mailchimp.
    // Events would need to be implemented using tags or custom fields.
    return { success: false, error: 'Event sending not implemented for ConvertKit' };
  }
}
