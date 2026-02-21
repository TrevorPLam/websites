/**
 * @file packages/integrations/email/contract.ts
 * Task: [4.1] Email marketing integration contract
 *
 * Purpose: Defines the shared interface for email marketing adapters.
 * Supports Mailchimp, SendGrid, ConvertKit.
 * Features: subscribe, unsubscribe, getLists, sendEvent.
 */

export interface EmailSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface EmailAdapter {
  id: string;
  subscribe: (
    subscriber: EmailSubscriber,
    listId?: string
  ) => Promise<{ success: boolean; error?: string }>;
  unsubscribe: (email: string, listId?: string) => Promise<{ success: boolean; error?: string }>;
  sendEvent: (
    email: string,
    eventName: string,
    data?: Record<string, unknown>
  ) => Promise<{ success: boolean; error?: string }>;
}

export interface EmailIntegrationConfig {
  retryCount?: number;
  timeoutMs?: number;
  useOAuth?: boolean;
}

export const EMAIL_DEFAULT_CONFIG: EmailIntegrationConfig = {
  retryCount: 3,
  timeoutMs: 10000,
};
