// File: app/api/og/route.tsx  [TRACE:FILE=app.api.og.route]
// Purpose: OpenGraph image generation API route creating dynamic social sharing images.
//          Generates branded OG images with customizable title and description for social media
//          previews and SEO optimization using Next.js ImageResponse.
//
// Exports / Entry: GET function for /api/og route
// Used by: Social media platforms, search engines, and link preview services
//
// Invariants:
// - Must validate all query parameters to prevent XSS attacks
// - Must escape HTML content before rendering in images
// - Must run at edge runtime for optimal performance
// - Must return consistent 1200x630 image dimensions
// - Must handle missing parameters gracefully with defaults
//
// Status: @public
// Features:
// - [FEAT:SEO] Dynamic OpenGraph image generation
// - [FEAT:SECURITY] Input validation and HTML escaping
// - [FEAT:PERFORMANCE] Edge runtime optimization
// - [FEAT:BRANDING] Consistent visual identity across social shares

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { escapeHtml } from '@repo/infra';
import siteConfig from '@/site.config';

export const runtime = 'edge';

// [TRACE:BLOCK=app.api.og.schema]
// [FEAT:SECURITY]
// NOTE: Zod schema for validating OG image query parameters - prevents XSS and ensures data integrity.
const ogQuerySchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
});

// [TRACE:FUNC=app.api.og.GET]
// [FEAT:SEO] [FEAT:SECURITY] [FEAT:PERFORMANCE]
// NOTE: Main OG image generation handler - validates input, escapes content, and renders branded social images.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // [TRACE:BLOCK=app.api.og.validation]
  // [FEAT:SECURITY]
  // NOTE: Input validation using Zod schema - prevents XSS attacks and ensures parameter constraints.
  const parseResult = ogQuerySchema.safeParse({
    title: searchParams.get('title') ?? undefined,
    description: searchParams.get('description') ?? undefined,
  });

  if (!parseResult.success) {
    return new Response('Invalid query parameters', { status: 400 });
  }

  // [TRACE:BLOCK=app.api.og.contentPreparation]
  // [FEAT:SECURITY]
  // NOTE: HTML escaping and content preparation - sanitizes user input before rendering in image.
  const title = escapeHtml(parseResult.data.title ?? siteConfig.name);
  const description = escapeHtml(parseResult.data.description ?? siteConfig.seo.defaultDescription);

  // [TRACE:BLOCK=app.api.og.imageGeneration]
  // [FEAT:BRANDING] [FEAT:SEO]
  // NOTE: ImageResponse generation - creates branded OG image with salon colors, logo, and content.
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
            ✂️
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{siteConfig.name}</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)' }}>
              Professional Hair Care
            </div>
          </div>
        </div>

        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', maxWidth: 900 }}>
          {description}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 18, color: 'rgba(255,255,255,0.75)' }}>
          <span>Haircuts</span>
          <span>•</span>
          <span>Color Services</span>
          <span>•</span>
          <span>Treatments</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
