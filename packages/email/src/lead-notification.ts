import { Resend } from 'resend';
import { classifyLead } from '@repo/lead-capture/scoring';
import { db } from '@repo/db';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY!);
const redis = Redis.fromEnv();

export type LeadNotificationPayload = {
  tenantId: string;
  leadId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  score: number;
  attribution: {
    firstTouch: { utmSource?: string; utmCampaign?: string; landingPage: string } | null;
    lastTouch: { utmSource?: string; utmCampaign?: string; landingPage: string } | null;
  };
};

export async function sendLeadNotification(tenantId: string, leadId: string): Promise<void> {
  // Fetch full lead data
  const { data: lead } = await db
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('tenant_id', tenantId)
    .single();

  if (!lead) return;

  // Fetch tenant notification config
  const { data: tenant } = await db.from('tenants').select('config').eq('id', tenantId).single();

  const config = tenant?.config as any;
  const notificationEmail = config?.notifications?.leadEmail ?? config?.identity?.contact?.email;

  if (!notificationEmail) return;

  const tier = classifyLead(lead.score);

  // Qualified leads: immediate notification
  // Warm leads: batched in daily digest (see §9.6)
  // Cold leads: weekly report only
  if (tier !== 'qualified') return;

  const scoreEmoji = lead.score >= 80 ? '🔥' : lead.score >= 60 ? '⚡' : '📋';
  const tierLabel = tier === 'qualified' ? '🎯 Qualified Lead' : '🔵 New Lead';

  await resend.emails.send({
    from: `Lead Alerts <leads@mail.youragency.com>`,
    to: [notificationEmail],
    replyTo: lead.email,
    subject: `${scoreEmoji} ${tierLabel}: ${lead.name} — Score ${lead.score}/100`,
    html: buildLeadEmailHTML({ lead, config }),
    text: buildLeadEmailText({ lead }),
    tags: [
      { name: 'tenant_id', value: tenantId },
      { name: 'lead_tier', value: tier },
      { name: 'lead_score', value: String(lead.score) },
    ],
  });

  // Record notification sent
  await db.from('audit_logs').insert({
    tenant_id: tenantId,
    action: 'lead.notification_sent',
    table_name: 'leads',
    record_id: leadId,
    new_data: { notificationEmail, tier, score: lead.score },
  });
}

function buildLeadEmailHTML({ lead, config }: { lead: any; config: any }): string {
  const tier = classifyLead(lead.score);
  const tierColor = tier === 'qualified' ? '#059669' : tier === 'warm' ? '#d97706' : '#6b7280';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">

    <!-- Header -->
    <div style="background: ${tierColor}; border-radius: 12px 12px 0 0; padding: 24px; text-align: center;">
      <p style="margin: 0; color: white; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        ${tier === 'qualified' ? '🎯 Qualified Lead Alert' : '📋 New Lead'}
      </p>
      <h1 style="margin: 8px 0 0; color: white; font-size: 28px; font-weight: 700;">${lead.name}</h1>
    </div>

    <!-- Score Card -->
    <div style="background: white; border: 1px solid #e5e7eb; padding: 24px; display: flex; align-items: center; gap: 24px;">
      <div style="text-align: center;">
        <div style="font-size: 48px; font-weight: 800; color: ${tierColor}; line-height: 1;">${lead.score}</div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Lead Score</div>
      </div>
      <div style="flex: 1;">
        <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Contact</p>
        <p style="margin: 0; font-weight: 600;"><a href="mailto:${lead.email}" style="color: #2563eb;">${lead.email}</a></p>
        ${lead.phone ? `<p style="margin: 4px 0 0;"><a href="tel:${lead.phone}" style="color: #2563eb; font-weight: 600;">${lead.phone}</a></p>` : ''}
      </div>
    </div>

    <!-- Message -->
    <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 24px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Message</p>
      <p style="margin: 0; color: #111827; line-height: 1.6; white-space: pre-wrap;">${lead.message}</p>
    </div>

    <!-- Attribution -->
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 12px 12px;">
      <p style="margin: 0 0 12px; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Attribution</p>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #6b7280; white-space: nowrap;">First Touch</td>
          <td style="padding: 4px 0; color: #111827;">${lead.utm_source_first ?? 'Direct'} ${lead.utm_campaign_first ? `/ ${lead.utm_campaign_first}` : ''}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #6b7280; white-space: nowrap;">Last Touch</td>
          <td style="padding: 4px 0; color: #111827;">${lead.utm_source ?? 'Direct'} ${lead.utm_campaign ? `/ ${lead.utm_campaign}` : ''}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #6b7280; white-space: nowrap;">Landing Page</td>
          <td style="padding: 4px 0; color: #111827;">${lead.landing_page ?? '/'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #6b7280; white-space: nowrap;">Source</td>
          <td style="padding: 4px 0; color: #111827;">${lead.source ?? 'contact_form'}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-top: 24px;">
      <a
        href="${process.env.NEXT_PUBLIC_PORTAL_URL}/leads/${lead.id}"
        style="display: inline-block; background: ${tierColor}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
      >
        View Lead in Portal →
      </a>
    </div>

    <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
      ${config?.identity?.siteName} · Powered by YourAgency
    </p>
  </div>
</body>
</html>
  `.trim();
}

function buildLeadEmailText({ lead }: { lead: any }): string {
  return `
New Lead: ${lead.name}
Score: ${lead.score}/100

Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ''}

Message:
${lead.message}

Attribution:
- First Touch: ${lead.utm_source_first ?? 'Direct'} / ${lead.utm_campaign_first ?? 'n/a'}
- Last Touch: ${lead.utm_source ?? 'Direct'} / ${lead.utm_campaign ?? 'n/a'}
- Landing Page: ${lead.landing_page ?? '/'}
  `.trim();
}
