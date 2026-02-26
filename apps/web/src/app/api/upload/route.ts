/**
 * @file apps/web/src/app/api/upload/route.ts
 * @summary Upload API route.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Upload API endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Upload POST endpoint' })
}
