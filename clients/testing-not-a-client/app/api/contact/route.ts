import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  return NextResponse.json({
    ok: true,
    received: Object.keys(payload).length > 0,
  });
}
