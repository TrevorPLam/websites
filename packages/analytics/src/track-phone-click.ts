// packages/analytics/src/track-phone-click.ts
'use server';

import { z } from 'zod';
import { createServerAction } from '@repo/auth/server-action-wrapper';
import { db } from '@repo/db';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const PhoneClickSchema = z.object({
  sessionId: z.string().min(1).max(100),
  phoneNumber: z.string().max(20),
  pagePath: z.string().max(200),
});

export const trackPhoneClick = createServerAction(PhoneClickSchema, async (input, ctx) => {
  // 1. Store in DB for reporting
  await db.from('phone_click_events').insert({
    tenant_id: ctx.tenantId,
    session_id: input.sessionId,
    phone_number: input.phoneNumber,
    page_path: input.pagePath,
  });

  // 2. Update session behavioral data in Redis (feeds lead scoring)
  await redis.hset(`session:${input.sessionId}`, {
    hasPhoneClick: 'true',
  });

  // 3. Tinybird event (real-time analytics)
  const tbToken = process.env.TINYBIRD_TOKEN;
  if (tbToken) {
    await fetch(`https://api.tinybird.co/v0/events?name=phone_clicks&token=${tbToken}`, {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: ctx.tenantId,
        session_id: input.sessionId,
        page_path: input.pagePath,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  return { tracked: true };
});
