import { Resend } from 'resend';
import { render } from '@react-email/render';
import { createElement } from 'react';
import { getTenantEmailConfig } from './client';
import type { ReactElement } from 'react';
import type { SendEmailOptions, EmailType } from './types';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { tenantId, to, template, subject, emailType, idempotencyKey, cc, bcc, attachments } =
    options;

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

  const { LeadDigest } = await import('./templates/LeadDigest');

  await sendEmail({
    tenantId,
    to: config.replyTo,
    subject: `📊 ${leads.length} new lead${leads.length !== 1 ? 's' : ''} on ${date}`,
    template: createElement(LeadDigest, {
      tenantName: config.fromName,
      leads,
      period: date,
    }),
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
      const { BillingReceipt } = await import('./templates/BillingReceipt');
      return createElement(BillingReceipt, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        amount: (data.amount as number) || 100,
        currency: (data.currency as string) || 'USD',
        planName: (data.planName as string) || 'Basic',
        billingDate: (data.billingDate as string) || new Date().toISOString(),
        nextBillingDate:
          (data.nextBillingDate as string) ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        invoiceNumber: (data.invoiceNumber as string) || 'INV-001',
      });
    },
    billing_failed: async () => {
      const { BillingFailed } = await import('./templates/BillingFailed');
      return createElement(BillingFailed, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        amount: (data.amount as number) || 100,
        currency: (data.currency as string) || 'USD',
        planName: (data.planName as string) || 'Basic',
        billingDate: (data.billingDate as string) || new Date().toISOString(),
        errorMessage: (data.errorMessage as string) || 'Payment failed',
      });
    },
    account_suspended: async () => {
      const { AccountSuspended } = await import('./templates/AccountSuspended');
      return createElement(AccountSuspended, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        suspensionDate: (data.suspensionDate as string) || new Date().toISOString(),
        reason: (data.reason as string) || 'Payment overdue',
        outstandingAmount: data.outstandingAmount as number | undefined,
        currency: data.currency as string | undefined,
      });
    },
    subscription_started: async () => {
      const { WelcomeClient } = await import('./templates/WelcomeClient');
      return createElement(WelcomeClient, {
        tenantName: config.fromName,
        clientName: (data.clientName as string) || 'John Doe',
        planName: (data.planName as string) || 'Basic',
        setupUrl: (data.setupUrl as string) || 'https://example.com/setup',
        supportEmail: (data.supportEmail as string) || 'support@example.com',
      });
    },
    subscription_cancelled: async () => {
      const { BillingCancelled } = await import('./templates/BillingCancelled');
      return createElement(BillingCancelled, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        cancellationDate: (data.cancellationDate as string) || new Date().toISOString(),
        planName: (data.planName as string) || 'Basic',
        reason: data.reason as string | undefined,
        refundAmount: data.refundAmount as number | undefined,
        currency: data.currency as string | undefined,
      });
    },
    plan_changed: async () => {
      const { PlanChanged } = await import('./templates/PlanChanged');
      return createElement(PlanChanged, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        oldPlanName: (data.oldPlanName as string) || 'Basic',
        newPlanName: (data.newPlanName as string) || 'Pro',
        effectiveDate: (data.effectiveDate as string) || new Date().toISOString(),
        priceChange: data.priceChange as number | undefined,
        currency: data.currency as string | undefined,
        isUpgrade: (data.isUpgrade as boolean) || true,
      });
    },
    upcoming_invoice: async () => {
      const { UpcomingInvoice } = await import('./templates/UpcomingInvoice');
      return createElement(UpcomingInvoice, {
        tenantName: config.fromName,
        customerName: (data.customerName as string) || 'John Doe',
        amount: (data.amount as number) || 100,
        currency: (data.currency as string) || 'USD',
        planName: (data.planName as string) || 'Basic',
        billingDate: (data.billingDate as string) || new Date().toISOString(),
        paymentMethod: (data.paymentMethod as string) || 'Credit Card',
        invoiceUrl: (data.invoiceUrl as string) || 'https://example.com/invoice',
      });
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
  const { BookingReminder } = await import('./templates/BookingReminder');

  const config = await getTenantEmailConfig(tenantId);

  await sendEmail({
    tenantId,
    to: booking.attendee_email,
    subject: `📅 Reminder: ${reminderType === '24h' ? 'Tomorrow' : 'In 1 hour'} — ${booking.service_name}`,
    template: createElement(BookingReminder, {
      tenantName: config.fromName,
      customerName: booking.attendee_name,
      bookingDate: booking.date,
      bookingTime: booking.time,
      serviceType: booking.service_name,
      location: booking.location,
      staffName: booking.staff_name,
      notes: booking.notes,
      cancellationUrl: booking.cancellation_url,
      rescheduleUrl: booking.reschedule_url,
    }),
    emailType: `booking_reminder_${reminderType}` as EmailType,
    idempotencyKey: `booking-reminder-${booking.id}-${reminderType}`,
  });
}
