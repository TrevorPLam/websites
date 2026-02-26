/**
 * @file apps/web/src/app/api/auth/route.ts
 * @summary Authentication API route.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Auth API endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Auth POST endpoint' })
}
