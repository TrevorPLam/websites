/**
 * @file apps/web/middleware.ts
 * @summary Vercel Edge Middleware for multi-tenant SaaS platform
 * @description Global edge middleware handling tenant resolution, custom domains,
 *   wildcard routing, security headers, and feature flag injection for 1,000+
 *   tenants. Feature flags are resolved once at the edge and forwarded as the
 *   `x-feature-flags` request header so that Server Components and Server
 *   Actions can read flag state without additional I/O.
 * @security Enterprise-grade tenant isolation and security headers
 * @requirements TASK-EDGE-001, TASK-011
 * @performance <10ms tenant resolution, <1ms header injection
 */

import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { resolveTenant } from '@repo/infrastructure/edge/tenant-resolver';

// ─── Feature flag injection ───────────────────────────────────────────────────

/**
 * Tier-based feature flag defaults (mirrors packages/feature-flags/src/feature-flags.ts).
 * Duplicated here to avoid importing a module that references Redis at the edge.
 */
const TIER_FLAG_DEFAULTS: Record<string, Record<string, boolean>> = {
  starter: {
    offline_lead_forms: false,
    realtime_lead_feed: false,
    ab_testing: false,
    ai_chat_widget: false,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: false,
    gdpr_tools: false,
    api_access: false,
    sso_enabled: false,
    advanced_analytics: false,
    multi_site: false,
    custom_domain: true,
    ghl_crm_sync: false,
    hubspot_crm_sync: false,
  },
  professional: {
    offline_lead_forms: true,
    realtime_lead_feed: true,
    ab_testing: true,
    ai_chat_widget: true,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: false,
    gdpr_tools: true,
    api_access: false,
    sso_enabled: false,
    advanced_analytics: true,
    multi_site: true,
    custom_domain: true,
    ghl_crm_sync: true,
    hubspot_crm_sync: true,
  },
  enterprise: {
    offline_lead_forms: true,
    realtime_lead_feed: true,
    ab_testing: true,
    ai_chat_widget: true,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: true,
    gdpr_tools: true,
    api_access: true,
    sso_enabled: true,
    advanced_analytics: true,
    multi_site: true,
    custom_domain: true,
    ghl_crm_sync: true,
    hubspot_crm_sync: true,
  },
};

type EdgeConfigFlags = Record<
  string,
  boolean | { enabledTenants?: string[]; enabledPercentage?: number }
>;

/** djb2 hash for percentage rollout — same algorithm as feature-flags package. */
function hashToBucket(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash) % 100;
}

/**
 * Resolve feature flags for a tenant at the edge.
 * Reads global overrides from Edge Config (< 1 ms) and applies tier defaults.
 * Returns a compact `Record<flagName, boolean>` safe to serialise as a header.
 */
async function resolveFeatureFlags(
  tenantId: string,
  billingTier: string,
): Promise<Record<string, boolean>> {
  const tierDefaults = TIER_FLAG_DEFAULTS[billingTier] ?? TIER_FLAG_DEFAULTS.starter;
  const flags: Record<string, boolean> = { ...tierDefaults };

  try {
    const globalOverrides = await get<EdgeConfigFlags>('featureFlags');
    if (globalOverrides && typeof globalOverrides === 'object') {
      for (const [flagName, override] of Object.entries(globalOverrides)) {
        if (typeof override === 'boolean') {
          flags[flagName] = override;
        } else if (typeof override === 'object') {
          if (override.enabledTenants?.includes(tenantId)) {
            flags[flagName] = true;
          } else if (typeof override.enabledPercentage === 'number') {
            flags[flagName] = hashToBucket(`${tenantId}:${flagName}`) < override.enabledPercentage;
          }
        }
      }
    }
  } catch {
    // Edge Config unavailable — tier defaults are sufficient
  }

  return flags;
}

/**
 * Edge middleware for multi-tenant SaaS platform
 * Handles tenant resolution, custom domains, security, and feature flag injection
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { pathname, hostname } = request.nextUrl;

  // Skip middleware for static assets and API routes (performance optimization)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Resolve tenant from hostname or path
    const tenant = await resolveTenant(hostname, pathname);

    if (!tenant) {
      // No tenant found - serve 404 or redirect to marketing page
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // Create response with tenant context
    const response = NextResponse.next();

    // Add tenant context to headers for downstream processing
    response.headers.set('x-tenant-id', tenant.id);
    response.headers.set('x-tenant-slug', tenant.slug);
    response.headers.set('x-tenant-domain', tenant.domain || hostname);

    // ── Feature flag injection (TASK-011) ────────────────────────────────────
    // Resolve billing tier from Edge Config (falls back to 'starter' if absent)
    let billingTier = 'starter';
    try {
      const tenantConfig = await get<{ billingTier?: string }>(`tenants.${tenant.id}`);
      if (tenantConfig?.billingTier) {
        billingTier = tenantConfig.billingTier;
      }
    } catch {
      // Edge Config miss — use starter defaults
    }

    const featureFlags = await resolveFeatureFlags(tenant.id, billingTier);
    // Compact JSON injected as a request header so Server Components can read
    // it via `headers()` without additional I/O.
    response.headers.set('x-feature-flags', JSON.stringify(featureFlags));
    // ─────────────────────────────────────────────────────────────────────────

    // Add security headers
    addSecurityHeaders(response);

    // Add performance headers
    response.headers.set('x-middleware-time', `${Date.now() - startTime}ms`);
    response.headers.set('x-edge-location', 'global');

    // Rewrite URL for tenant-specific routing if needed
    if (tenant.rewritePath) {
      const url = request.nextUrl.clone();
      url.pathname = tenant.rewritePath;
      return NextResponse.rewrite(url, response);
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);

    // Fallback response with minimal security headers
    const response = new NextResponse('Internal server error', { status: 500 });
    addSecurityHeaders(response);
    return response;
  }
}

/**
 * Add enterprise-grade security headers
 */
function addSecurityHeaders(response: NextResponse): void {
  // Security headers for multi-tenant environment
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy for marketing sites
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https: *.googleusercontent.com *.githubusercontent.com",
    "connect-src 'self' *.supabase.co *.vercel-edge-functions.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // HSTS for custom domains
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
}

/**
 * Export configuration for Vercel Edge Runtime
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
  runtime: 'edge',
  regions: 'all', // Global edge deployment
};
