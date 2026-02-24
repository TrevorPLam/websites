import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processErasureRequest } from '@repo/privacy/erasure';

const ErasureSchema = z.object({
  email: z.string().email(),
  reason: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ErasureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const requestId = crypto.randomUUID();

  await processErasureRequest({
    requestId,
    tenantId: 'unknown',
    subjectEmail: parsed.data.email,
    requestedAt: new Date().toISOString(),
    requestedBy: 'subject',
    reason: parsed.data.reason,
  });

  return NextResponse.json({
    success: true,
    requestId,
    message: "Your request has been received. We'll process it within 30 days.",
  });
}
