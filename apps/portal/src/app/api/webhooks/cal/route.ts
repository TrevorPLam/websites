import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { createSupabaseServerClient } from '@repo/integrations/supabase';
import { classifyLead } from '@repo/lead-capture';

// ============================================================================
// CAL.COM WEBHOOK HANDLER (API v2)
// Events: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED,
//         BOOKING_CONFIRMED, BOOKING_COMPLETED, BOOKING_NO_SHOW
// Reference: https://cal.com/docs/api-reference/v2/event-types-webhooks
// ============================================================================

export const dynamic = 'force-dynamic';

// Idempotent signature verification (same pattern as Stripe)
function verifyCalWebhook(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-cal-signature-256');

  // Tenant ID is passed in the webhook URL: /api/webhooks/cal?tenant=abc123
  const tenantId = req.nextUrl.searchParams.get('tenant');
  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant' }, { status: 400 });
  }

  // Create database client with tenant context
  const db = createSupabaseServerClient();

  // Fetch per-tenant Cal.com webhook secret from secrets manager
  const { getTenantSecret } = await import('@repo/infrastructure/security');
  const webhookSecret = await getTenantSecret(tenantId, 'CAL_WEBHOOK_SECRET');

  if (!webhookSecret) {
    // Cal.com not configured for this tenant — silently accept (not an error)
    return NextResponse.json({ received: true });
  }

  if (!verifyCalWebhook(body, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Idempotency: parse event ID from payload
  let event: CalWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Cal.com doesn't provide a unique event ID on the envelope —
  // construct one from booking UID + trigger type
  const eventId = `cal:${event.triggerEvent}:${event.payload?.uid}`;

  const { data: existing } = await db
    .from('processed_webhooks')
    .select('id')
    .eq('provider', 'cal')
    .eq('event_id', eventId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await db.from('processed_webhooks').insert({
    provider: 'cal',
    event_id: eventId,
    event_type: event.triggerEvent,
  });

  try {
    await handleCalEvent(event, tenantId, db);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Cal.com Webhook] Handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

async function handleCalEvent(event: CalWebhookEvent, tenantId: string, db: any): Promise<void> {
  switch (event.triggerEvent) {
    case 'BOOKING_CREATED':
      await handleBookingCreated(event.payload, tenantId, db);
      break;
    case 'BOOKING_RESCHEDULED':
      await handleBookingRescheduled(event.payload, tenantId, db);
      break;
    case 'BOOKING_CANCELLED':
      await handleBookingCancelled(event.payload, tenantId, db);
      break;
    case 'BOOKING_CONFIRMED':
      await handleBookingConfirmed(event.payload, tenantId, db);
      break;
    case 'BOOKING_COMPLETED':
      await handleBookingCompleted(event.payload, tenantId, db);
      break;
    case 'BOOKING_NO_SHOW':
      await handleBookingNoShow(event.payload, tenantId, db);
      break;
    default:
      console.log(`[Cal.com] Unhandled event: ${event.triggerEvent}`);
  }
}

async function handleBookingCreated(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  const attendee = payload.attendees?.[0];
  if (!attendee) return;

  // Upsert booking record
  const { data: booking, error } = await db
    .from('bookings')
    .upsert(
      {
        tenant_id: tenantId,
        cal_uid: payload.uid,
        cal_booking_id: payload.bookingId,
        status: 'confirmed',
        attendee_name: attendee.name,
        attendee_email: attendee.email,
        attendee_phone: attendee.phoneNumber ?? null,
        event_type: payload.type,
        event_title: payload.title,
        start_time: payload.startTime,
        end_time: payload.endTime,
        metadata: {
          responses: payload.responses,
          location: payload.location,
          organizer: payload.organizer,
          videoCallUrl: payload.videoCallUrl,
        },
        created_at: new Date().toISOString(),
      },
      { onConflict: 'cal_uid' }
    )
    .select()
    .single();

  if (error || !booking) {
    throw new Error(`Failed to upsert booking: ${error?.message}`);
  }

  // Auto-create or update lead from booking attendee (bookings = high-intent)
  const existingLead = await db
    .from('leads')
    .select('id, score')
    .eq('tenant_id', tenantId)
    .eq('email', attendee.email.toLowerCase())
    .maybeSingle();

  if (existingLead.data) {
    // Boost score: booking = +20 points
    const newScore = Math.min(100, (existingLead.data.score ?? 50) + 20);
    await db
      .from('leads')
      .update({
        score: newScore,
        status: 'booking_confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingLead.data.id);
  } else {
    // Create new lead from booking (score starts at 70 — bookings are qualified)
    const score = 70; // Bookings always start qualified

    await db.from('leads').insert({
      tenant_id: tenantId,
      name: attendee.name,
      email: attendee.email.toLowerCase(),
      phone: attendee.phoneNumber ?? null,
      source: 'booking',
      status: 'booking_confirmed',
      score: score,
      booking_id: booking.id,
    });
  }

  console.log(`[Cal.com] Booking created: ${booking.id} for tenant ${tenantId}`);
}

async function handleBookingRescheduled(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  await db
    .from('bookings')
    .update({
      status: 'rescheduled',
      start_time: payload.startTime,
      end_time: payload.endTime,
      updated_at: new Date().toISOString(),
    })
    .eq('cal_uid', payload.uid)
    .eq('tenant_id', tenantId);
}

async function handleBookingCancelled(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  await db
    .from('bookings')
    .update({
      status: 'cancelled',
      metadata: payload.cancellationReason
        ? `{ "cancellationReason": "${payload.cancellationReason}" }`
        : '{ "cancellationReason": "unspecified" }',
      updated_at: new Date().toISOString(),
    })
    .eq('cal_uid', payload.uid)
    .eq('tenant_id', tenantId);
}

async function handleBookingConfirmed(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  await db
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('cal_uid', payload.uid)
    .eq('tenant_id', tenantId);
}

async function handleBookingCompleted(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  await db
    .from('bookings')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('cal_uid', payload.uid)
    .eq('tenant_id', tenantId);

  // Update lead status to converted
  const { data: booking } = await db
    .from('bookings')
    .select('attendee_email')
    .eq('cal_uid', payload.uid)
    .single();

  if (booking) {
    await db
      .from('leads')
      .update({ status: 'converted', updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('email', booking.attendee_email.toLowerCase());
  }
}

async function handleBookingNoShow(
  payload: CalBookingPayload,
  tenantId: string,
  db: any
): Promise<void> {
  await db
    .from('bookings')
    .update({ status: 'no_show', updated_at: new Date().toISOString() })
    .eq('cal_uid', payload.uid)
    .eq('tenant_id', tenantId);
}

// ============================================================================
// CAL.COM API v2 TYPES
// ============================================================================

interface CalWebhookEvent {
  triggerEvent:
    | 'BOOKING_CREATED'
    | 'BOOKING_RESCHEDULED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_COMPLETED'
    | 'BOOKING_NO_SHOW'
    | 'MEETING_STARTED'
    | 'MEETING_ENDED';
  createdAt: string;
  payload: CalBookingPayload;
}

interface CalBookingPayload {
  uid: string;
  bookingId: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  videoCallUrl?: string;
  cancellationReason?: string;
  responses?: Record<string, unknown>;
  organizer: { name: string; email: string; timeZone: string };
  attendees: Array<{ name: string; email: string; phoneNumber?: string; timeZone: string }>;
  metadata?: Record<string, unknown>;
}
