/**
 * @file apps/web/src/app/api/cron/route.ts
 * @summary Cron jobs API route.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Cron API endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Cron POST endpoint' })
}
