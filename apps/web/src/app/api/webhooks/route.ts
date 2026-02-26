/**
 * @file apps/web/src/app/api/webhooks/route.ts
 * @summary Webhooks API route.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Webhooks API endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Webhooks POST endpoint' })
}
