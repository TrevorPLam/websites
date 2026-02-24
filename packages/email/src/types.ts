/**
 * Email System Types
 * Multi-tenant email configuration and template types
 */

import type { ReactElement } from 'react';

export interface TenantEmailConfig {
  fromEmail: string; // e.g. "leads@johnsplumbing.com"
  fromName: string; // e.g. "John's Plumbing"
  replyTo: string | null; // Owner's personal email
  resendApiKey: string; // Resend API key
}

export type EmailType =
  | 'lead_notification'
  | 'lead_digest'
  | 'billing_receipt'
  | 'billing_failed'
  | 'billing_cancelled'
  | 'upcoming_invoice'
  | 'booking_confirmation'
  | 'booking_reminder_24h'
  | 'booking_reminder_1h'
  | 'booking_followup'
  | 'welcome_agency'
  | 'welcome_client'
  | 'account_suspended'
  | 'plan_changed'
  | 'subscription_started'
  | 'subscription_cancelled';

export interface SendEmailOptions {
  tenantId: string;
  to: string | string[]; // Recipient(s)
  toName?: string;
  template: ReactElement; // React Email component
  subject: string;
  emailType: EmailType;
  idempotencyKey?: string; // Resend idempotency key (prevents duplicates)
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{ filename: string; content: Buffer }>;
}

export interface LeadNotificationProps {
  lead: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    score: number;
    source?: string;
    utmSource?: string;
    utmCampaign?: string;
    landingPage?: string;
  };
}

export interface LeadDigestProps {
  leads: any[];
  date: string;
  tenantName: string;
}

export interface BillingReceiptProps {
  tenantName: string;
  amount: number;
  invoiceId: string;
  date: string;
}

export interface BillingFailedProps {
  tenantName: string;
  amount: number;
  lastAttempt: string;
  nextAttempt: string;
}

export interface AccountSuspendedProps {
  tenantName: string;
  reason: string;
  suspendedDate: string;
}

export interface BookingReminderProps {
  booking: any;
  reminderType: '24h' | '1h';
  businessName: string;
}

export interface WelcomeClientProps {
  tenantName: string;
}

export interface WelcomeAgencyProps {
  tenantName: string;
  clientEmail: string;
  plan: string;
}

export interface UpcomingInvoiceProps {
  tenantName: string;
  amount: number;
  dueDate: string;
}

export interface PlanChangedProps {
  tenantName: string;
  oldPlan: string;
  newPlan: string;
  effectiveDate: string;
}

export interface BillingCancelledProps {
  tenantName: string;
  finalDate: string;
  reason?: string;
}
