import { getTenantSecret, setTenantSecret } from '@repo/infrastructure/security';

const CAL_API_BASE = 'https://api.cal.com/v2';

interface CalManagedUser {
  id: number;
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
}

export async function provisionCalManagedUser(
  tenantId: string,
  email: string,
  name: string,
  timeZone: string = 'America/Chicago'
): Promise<CalManagedUser> {
  // Agency-level OAuth token (used for managed user provisioning)
  const agencyToken = process.env.CAL_COM_AGENCY_ACCESS_TOKEN!;
  const clientId = process.env.CAL_COM_CLIENT_ID!;

  // Create managed user
  const response = await fetch(`${CAL_API_BASE}/oauth-clients/${clientId}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${agencyToken}`,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-09-04',
    },
    body: JSON.stringify({
      email,
      name,
      timeFormat: 12,
      weekStart: 'Sunday',
      timeZone,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cal.com user provisioning failed: ${response.status} — ${error}`);
  }

  const { data: user } = (await response.json()) as { data: CalManagedUser };

  // Store access tokens in secrets manager (never in DB plaintext)
  await setTenantSecret(tenantId, 'CAL_USER_ID', String(user.id));
  await setTenantSecret(tenantId, 'CAL_ACCESS_TOKEN', user.accessToken);
  await setTenantSecret(tenantId, 'CAL_REFRESH_TOKEN', user.refreshToken);
  await setTenantSecret(tenantId, 'CAL_USERNAME', user.username);

  return user;
}

export async function createDefaultEventTypes(
  tenantId: string,
  businessName: string,
  services: Array<{ name: string; slug: string; durationMinutes?: number }>
): Promise<void> {
  const accessToken = await getTenantSecret(tenantId, 'CAL_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Cal.com not provisioned for this tenant');

  for (const service of services) {
    const response = await fetch(`${CAL_API_BASE}/event-types`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'cal-api-version': '2024-06-14',
      },
      body: JSON.stringify({
        title: service.name,
        slug: service.slug,
        lengthInMinutes: service.durationMinutes ?? 30,
        description: `Book a ${service.name} with ${businessName}`,
        locations: [{ type: 'phone' }], // Default to phone; client can change
        requiresConfirmation: false,
        disableGuests: true,
        metadata: { tenantId, serviceSlug: service.slug },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create event type ${service.slug}: ${response.status} — ${error}`);
    }
  }
}

export async function registerCalWebhook(
  tenantId: string,
  webhookUrl: string,
  webhookSecret: string
): Promise<void> {
  const accessToken = await getTenantSecret(tenantId, 'CAL_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Cal.com not provisioned for this tenant');

  await setTenantSecret(tenantId, 'CAL_WEBHOOK_SECRET', webhookSecret);

  const response = await fetch(`${CAL_API_BASE}/webhooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-06-14',
    },
    body: JSON.stringify({
      subscriberUrl: webhookUrl,
      triggers: [
        'BOOKING_CREATED',
        'BOOKING_RESCHEDULED',
        'BOOKING_CANCELLED',
        'BOOKING_CONFIRMED',
        'BOOKING_COMPLETED',
        'BOOKING_NO_SHOW',
      ],
      secret: webhookSecret,
      active: true,
      payloadTemplate: null, // Use default (full payload)
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to register webhook: ${response.status} — ${error}`);
  }
}
