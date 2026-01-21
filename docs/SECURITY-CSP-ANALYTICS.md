# CSP Updates for Analytics Integration

**Created:** 2026-01-09  
**Related Task:** T-100 (Security cleanup after launch integrations)  
**Status:** GA4 integrated; CSP updated to allow GA4 domains

## Overview

GA4 is integrated (T-098 completed). The Content Security Policy (CSP) in `middleware.ts` now allowlists
Google Analytics script and connect domains.

## Current CSP Restrictions

The current CSP blocks external connections:
- `connect-src 'self'` - Only allows same-origin API calls
- `script-src 'self' 'nonce-<value>'` - Only allows same-origin scripts with a nonce

## Required CSP Updates

### Google Analytics 4 (GA4)

GA4 CSP allowlist now includes:

```typescript
"script-src 'self' 'nonce-<value>' https://www.googletagmanager.com",
"connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
```

**Domains needed:**
- `https://www.googletagmanager.com` - For gtag.js script
- `https://www.google-analytics.com` - For analytics data collection

### Plausible Analytics

If using Plausible, add to CSP:

```typescript
// In middleware.ts, update CSP:
"script-src 'self' 'nonce-<value>' https://plausible.io",
"connect-src 'self' https://plausible.io",
```

**Domain needed:**
- `https://plausible.io` - For Plausible script and data collection

## Implementation Steps

1. ✅ **Choose analytics provider** (T-064 complete)
2. ✅ **Install analytics** (T-098 complete)
3. ✅ **Update CSP in middleware.ts** with GA4 domains
4. ✅ **Add per-request CSP nonces** for inline scripts
5. **Test CSP** - Check browser console for violations
6. **Verify analytics tracking** works correctly

## Testing CSP Changes

After updating CSP:

1. Open browser DevTools → Console
2. Look for CSP violation errors
3. Test analytics events (form submissions, page views)
4. Verify analytics dashboard receives data

## Security Notes

- Only add specific domains (not wildcards like `https://*`)
- Test in production-like environment before deploying
- Monitor CSP violations in Sentry (if enabled)
- CSP nonces are generated per request in `middleware.ts` and passed to `app/layout.tsx`
- Inline scripts (JSON-LD + GA4 init) must include the `nonce` attribute

## Nonce Flow (Current)

1. `middleware.ts` generates a nonce and sets the `x-csp-nonce` request header.
2. `app/layout.tsx` reads the nonce via `headers()` and assigns it to inline scripts.
3. `components/AnalyticsConsentBanner.tsx` receives the nonce and applies it to GA4 scripts.
4. `Content-Security-Policy` header includes the matching `nonce-<value>` source.

### Fallback Behavior

- If the `x-csp-nonce` header is missing, `app/layout.tsx` logs a warning and generates a fallback nonce.
- If nonce generation fails (missing crypto), the layout logs an error and uses a static nonce to avoid a hard crash.

## References

- Current CSP: `middleware.ts` lines 160-173
- Analytics implementation: `lib/analytics.ts`
- Task tracking: T-098 (completed)
