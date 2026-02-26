/**
 * @file apps/web/src/app/api/trpc/route.ts
 * @summary tRPC API route.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'tRPC API endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'tRPC POST endpoint' })
}
