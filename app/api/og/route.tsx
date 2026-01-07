import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { z } from 'zod'

import { escapeHtml } from '@/lib/sanitize'

export const runtime = 'edge'

const ogQuerySchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const parseResult = ogQuerySchema.safeParse({
    title: searchParams.get('title') ?? undefined,
    description: searchParams.get('description') ?? undefined,
  })

  if (!parseResult.success) {
    return new Response('Invalid query parameters', { status: 400 })
  }

  const title = escapeHtml(parseResult.data.title ?? 'Your Dedicated Marketer')
  const description = escapeHtml(
    parseResult.data.description ??
      'Digital marketing services that drive growth through SEO, content, and performance campaigns.'
  )

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '48px',
          background: 'linear-gradient(135deg, #0F1115 0%, #0EA5A4 80%)',
          color: 'white',
          fontFamily: 'Inter, Arial, sans-serif',
          gap: '24px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.1)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 32,
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Your Dedicated Marketer</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)' }}>
              ROI-Obsessed Marketing Partners
            </div>
          </div>
        </div>

        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', maxWidth: 900 }}>{description}</div>

        <div style={{ display: 'flex', gap: 16, fontSize: 18, color: 'rgba(255,255,255,0.75)' }}>
          <span>Performance Marketing</span>
          <span>•</span>
          <span>SEO & Content</span>
          <span>•</span>
          <span>Lifecycle Campaigns</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
