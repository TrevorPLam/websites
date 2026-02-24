import { type NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

interface SanityWebhookBody {
  _type: string;
  slug?: { current?: string };
  tenantId?: string;
  secret?: string;
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 });
  }

  try {
    const body = (await req.json()) as SanityWebhookBody;

    if (body.secret !== secret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!body._type) {
      return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    if (body._type === 'post' && body.tenantId) {
      revalidateTag(`tenant:${body.tenantId}:blog`, 'max');
      revalidateTag(`tenant:${body.tenantId}:sitemap`, 'max');
      if (body.slug?.current) {
        revalidateTag(`tenant:${body.tenantId}:blog:${body.slug.current}`, 'max');
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), type: body._type });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
