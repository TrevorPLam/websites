import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getTenantEmailConfig } from './client';
import type { ReactElement } from 'react';
import type { SendEmailOptions, EmailType } from './types';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const {
    tenantId,
    to,
    toName,
    template,
    subject,
    emailType,
    idempotencyKey,
    cc,
    bcc,
    attachments,
  } = options;

  // Get tenant email configuration (with fallback to agency domain)
  const config = await getTenantEmailConfig(tenantId);

  // Render React Email template to HTML + plain text
  const html = await render(template);
  const text = await render(template, { plainText: true });

  const recipients = Array.isArray(to)
    ? to.map((email) => email.toLowerCase())
    : [to.toLowerCase()];

  const { data, error } = await resend.emails.send({
    from: `${config.fromName} <${config.fromEmail}>`,
    to: recipients,
    subject,
    html,
    text,
    ...(config.replyTo ? { replyTo: config.replyTo } : {}),
    ...(cc?.length ? { cc } : {}),
    ...(bcc?.length ? { bcc } : {}),
    ...(attachments?.length
      ? {
          attachments: attachments.map((a) => ({
            filename: a.filename,
            content: a.content.toString('base64'),
          })),
        }
      : {}),
    headers: {
      'X-Tenant-Id': tenantId,
      'X-Email-Type': emailType,
      // Unsubscribe header (CAN-SPAM / GDPR compliance)
      'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?tenant=${tenantId}&email=${recipients[0]}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    ...(idempotencyKey ? { idempotencyKey } : {}),
    tags: [
      { name: 'tenant_id', value: tenantId },
      { name: 'email_type', value: emailType },
    ],
  });

  if (error) {
    console.error(`[Email] Send failed (${emailType}, tenant=${tenantId}):`, error);
    throw new Error(`Email send failed: ${error.message}`);
  }

  console.log(`[Email] Sent: ${emailType} → ${recipients.join(', ')} (id=${data?.id})`);
}

// ============================================================================
// CONVENIENCE WRAPPERS — per email type
// ============================================================================

export async function sendLeadNotificationEmail(
  tenantId: string,
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
  },
  ownerEmail: string
): Promise<void> {
  const { LeadNotificationEmail } = await import('./templates/LeadNotification');

  await sendEmail({
    tenantId,
    to: ownerEmail,
    subject: `🔥 New ${lead.score >= 70 ? 'qualified ' : ''}lead: ${lead.name}`,
    template: LeadNotificationEmail({ lead }),
    emailType: 'lead_notification',
    idempotencyKey: `lead-notification-${tenantId}-${lead.email}-${Date.now()}`,
  });
}

export async function sendLeadDigestEmail(
  tenantId: string,
  leads: any[],
  date: string
): Promise<void> {
  const config = await getTenantEmailConfig(tenantId);
  if (!config.replyTo) return; // No owner email configured

  const { LeadDigestEmail } = await import('./templates/LeadDigest');

  await sendEmail({
    tenantId,
    to: config.replyTo,
    subject: `📊 ${leads.length} new lead${leads.length !== 1 ? 's' : ''} on ${date}`,
    template: LeadDigestEmail({ leads, date, tenantName: config.fromName }),
    emailType: 'lead_digest',
    idempotencyKey: `lead-digest-${tenantId}-${date}`,
  });
}

export async function sendBillingEmail(
  type: Extract<
    EmailType,
    | 'billing_receipt'
    | 'billing_failed'
    | 'account_suspended'
    | 'upcoming_invoice'
    | 'plan_changed'
    | 'subscription_started'
    | 'subscription_cancelled'
  >,
  tenantId: string,
  data: Record<string, unknown>
): Promise<void> {
  const config = await getTenantEmailConfig(tenantId);
  if (!config.replyTo) return;

  const templates: Record<string, () => Promise<ReactElement>> = {
    billing_receipt: async () => {
      const { BillingReceiptEmail } = await import('./templates/BillingReceipt');
      return BillingReceiptEmail({ tenantName: config.fromName, ...data });
    },
    billing_failed: async () => {
      const { BillingFailedEmail } = await import('./templates/BillingFailed');
      return BillingFailedEmail({ tenantName: config.fromName, ...data });
    },
    account_suspended: async () => {
      const { AccountSuspendedEmail } = await import('./templates/AccountSuspended');
      return AccountSuspendedEmail({ tenantName: config.fromName, ...data });
    },
    subscription_started: async () => {
      const { WelcomeClientEmail } = await import('./templates/WelcomeClient');
      return WelcomeClientEmail({ tenantName: config.fromName });
    },
    subscription_cancelled: async () => {
      const { BillingCancelledEmail } = await import('./templates/BillingCancelled');
      return BillingCancelledEmail({ tenantName: config.fromName, ...data });
    },
    plan_changed: async () => {
      const { PlanChangedEmail } = await import('./templates/PlanChanged');
      return PlanChangedEmail({ tenantName: config.fromName, ...data });
    },
    upcoming_invoice: async () => {
      const { UpcomingInvoiceEmail } = await import('./templates/UpcomingInvoice');
      return UpcomingInvoiceEmail({ tenantName: config.fromName, ...data });
    },
  };

  const templateFn = templates[type];
  if (!templateFn) return;

  const template = await templateFn();
  const subjects: Record<string, string> = {
    billing_receipt: `Your receipt from ${config.fromName}`,
    billing_failed: `Payment failed — action required`,
    account_suspended: `Your account has been suspended`,
    subscription_started: `Welcome to the platform, ${config.fromName}!`,
    subscription_cancelled: `Subscription cancelled`,
    plan_changed: `Your plan has been updated`,
    upcoming_invoice: `Upcoming charge for ${config.fromName}`,
  };

  await sendEmail({
    tenantId,
    to: config.replyTo,
    subject: subjects[type] ?? 'Account notification',
    template,
    emailType: type,
    idempotencyKey: `billing-${type}-${tenantId}-${Date.now()}`,
  });
}

export async function sendBookingReminderEmail(options: {
  tenantId: string;
  booking: any;
  reminderType: '24h' | '1h';
}): Promise<void> {
  const { tenantId, booking, reminderType } = options;
  const { BookingReminderEmail } = await import('./templates/BookingReminder');

  const config = await getTenantEmailConfig(tenantId);

  await sendEmail({
    tenantId,
    to: booking.attendee_email,
    toName: booking.attendee_name,
    subject:
      reminderType === '24h'
        ? `Reminder: Your appointment tomorrow with ${config.fromName}`
        : `Your appointment is in 1 hour — ${config.fromName}`,
    template: BookingReminderEmail({ booking, reminderType, businessName: config.fromName }),
    emailType: `booking_reminder_${reminderType}` as EmailType,
    idempotencyKey: `booking-reminder-${booking.id}-${reminderType}`,
  });
}
