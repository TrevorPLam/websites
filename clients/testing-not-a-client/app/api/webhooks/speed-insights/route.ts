import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface SpeedInsightsWebhookPayload {
  event: 'score_degraded' | 'score_recovered';
  metric: string;
  score: number;
  threshold: number;
  url: string;
  projectId: string;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-vercel-signature') ?? '';
  const secret = process.env.SPEED_INSIGHTS_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const expectedSignature = crypto.createHmac('sha1', secret).update(rawBody).digest('hex');

  const isValid =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as SpeedInsightsWebhookPayload;

  if (payload.event === 'score_degraded' && process.env.SLACK_WEBHOOK_PERF_ALERTS) {
    await fetch(process.env.SLACK_WEBHOOK_PERF_ALERTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text:
          `🚨 *Performance Regression Detected*\n` +
          `• Metric: \`${payload.metric}\`\n` +
          `• Score: ${payload.score} (threshold: ${payload.threshold})\n` +
          `• URL: ${payload.url}\n` +
          '• Action: Check Vercel Speed Insights dashboard',
      }),
    });
  }

  return NextResponse.json({ received: true });
}
