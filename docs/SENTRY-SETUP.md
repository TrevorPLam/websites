# Sentry Setup Guide

> **Last Updated:** 2026-01-03  
> **Canonical Status:** Canonical  
> **Purpose:** Sentry error monitoring configuration guide  
> **See Also:** [DOCS_INDEX.md](./DOCS_INDEX.md), [SECURITY_REVIEW.md](../SECURITY_REVIEW.md)

This guide walks you through setting up Sentry for error monitoring in production.

## Why Sentry?

Sentry provides:
- Real-time error tracking
- Performance monitoring
- Release tracking
- User feedback
- Source map support

## Installation

### 1. Install Sentry SDK

```bash
npm install @sentry/nextjs --legacy-peer-deps
```

### 2. Initialize Sentry

Run the Sentry wizard:

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.mjs`
- Add environment variables to `.env.local`

### 3. Get Your DSN

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project (select Next.js)
3. Copy your DSN (Data Source Name)

### 4. Configure Environment Variables

Add to `.env.local`:

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name

# Environment
SENTRY_ENVIRONMENT=development # or production, staging
```

Add to `.env.example`:

```env
# Error Monitoring (Sentry)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_ENVIRONMENT=
```

### 5. Update Configuration Files

#### sentry.client.config.ts

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

#### sentry.server.config.ts

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
})
```

### 6. Update Logger to Send to Sentry

Update `lib/logger.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'
import { isDevelopment, isProduction } from './env'

export function logInfo(message: string, context?: LogContext) {
  if (isDevelopment) {
    console.info('[INFO]', message, context || '')
  }
  if (isProduction) {
    Sentry.captureMessage(message, { level: 'info', extra: context })
  }
}

export function logWarn(message: string, context?: LogContext) {
  if (isDevelopment) {
    console.warn('[WARN]', message, context || '')
  }
  if (isProduction) {
    Sentry.captureMessage(message, { level: 'warning', extra: context })
  }
}

export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  if (isDevelopment) {
    console.error('[ERROR]', message, error, context || '')
  }
  if (isProduction) {
    Sentry.captureException(error || new Error(message), { extra: { message, ...context } })
  }
}
```

### 7. Test Sentry

Create a test page to verify Sentry is working:

```typescript
// app/sentry-test/page.tsx
'use client'

export default function SentryTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sentry Test</h1>
      <button
        onClick={() => {
          throw new Error('Sentry Test Error')
        }}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Throw Test Error
      </button>
    </div>
  )
}
```

Visit `/sentry-test` and click the button. Check Sentry dashboard for the error.

### 8. Source Maps (Optional)

For better error tracking, enable source maps in production:

Update `next.config.mjs`:

```javascript
const nextConfig = {
  // ... other config
  productionBrowserSourceMaps: true,
}
```

Note: This increases bundle size but provides better debugging.

## Usage Examples

### Catching Errors in Components

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: { section: 'checkout' },
    extra: { userId: user.id },
  })
}
```

### Adding Context

```typescript
Sentry.setUser({ id: user.id, email: user.email })
Sentry.setTag('page', 'checkout')
Sentry.setContext('order', { orderId: '12345', total: 99.99 })
```

### Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs'

const transaction = Sentry.startTransaction({
  op: 'function',
  name: 'processPayment',
})

try {
  await processPayment()
} finally {
  transaction.finish()
}
```

## Best Practices

1. **Don't log sensitive data**
   - Filter PII before sending to Sentry
   - Use `beforeSend` to scrub data

2. **Use appropriate log levels**
   - Error: Unexpected errors
   - Warning: Degraded functionality
   - Info: Important events

3. **Add context**
   - User information
   - Request details
   - Custom tags

4. **Set up alerts**
   - Configure Sentry alerts for critical errors
   - Set up Slack/email notifications

5. **Release tracking**
   - Tag errors with release versions
   - Track deployment health

## Production Checklist

- [ ] Sentry DSN configured
- [ ] Auth token set (for source maps)
- [ ] Environment set to 'production'
- [ ] Sample rate configured (0.1 - 0.2 recommended)
- [ ] Source maps enabled and restricted to Sentry uploads
- [ ] Alerts configured
- [ ] Team members invited
- [ ] Test error submitted
- [ ] Verify errors appear in dashboard

## Monitoring

### Key Metrics to Watch

1. **Error Rate**
   - Errors per minute/hour
   - Error percentage vs total requests

2. **Performance**
   - Page load times
   - API response times
   - Database query duration

3. **User Impact**
   - Number of users affected
   - Error frequency per user

### Setting Up Dashboards

1. Go to Sentry > Dashboards
2. Create custom dashboards for:
   - Overview (errors, performance, releases)
   - User impact
   - API performance
   - Critical errors

## Troubleshooting

### Errors Not Appearing

1. Check DSN is correct
2. Verify environment variables are set
3. Check network tab for Sentry requests
4. Enable debug mode temporarily

### Too Many Events

1. Lower sample rate
2. Add filters in `beforeSend`
3. Ignore known errors
4. Set up rate limiting

### Missing Source Maps

1. Verify auth token is set
2. Check `productionBrowserSourceMaps: true`
3. Verify build completes successfully
4. Check Sentry release artifacts

## Cost Management

Sentry has usage limits on free tier:
- 5,000 errors/month
- 10,000 performance units/month

To stay within limits:
- Use appropriate sample rates
- Filter out noise (known errors)
- Monitor quota usage
- Upgrade if needed

## Alternative: LogRocket

If you prefer LogRocket:

```bash
npm install logrocket
npm install logrocket-react
```

```typescript
import LogRocket from 'logrocket'

LogRocket.init('your-app-id')
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
})
```

## Resources

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Handling Best Practices](https://docs.sentry.io/product/error-monitoring/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)

---

## Current Status

✅ **Sentry is now integrated!**

The following has been implemented:
- ✅ Sentry SDK installed (`@sentry/nextjs`)
- ✅ Client-side configuration (`sentry.client.config.ts`)
- ✅ Server-side configuration (`sentry.server.config.ts`)
- ✅ Edge runtime configuration (`sentry.edge.config.ts`)
- ✅ Logger integration with Sentry (`lib/logger.ts`)
- ✅ Environment variables added to `.env.example`
- ✅ Development mode filtering (only tracks in production unless debug enabled)

**To activate:**
1. Sign up at [sentry.io](https://sentry.io)
2. Create a new Next.js project
3. Copy your DSN to `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```
4. Deploy to production - errors will automatically be tracked!

**Note**: Sentry is disabled in development mode by default to avoid noise. Set `NEXT_PUBLIC_SENTRY_DEBUG=true` in your `.env.local` to test Sentry locally.

## Performance Instrumentation (Contact Submissions)

Client-side contact submissions are wrapped in a dedicated Sentry span for latency tracking. The span name is `contact_form.submit` with `op="ui.action"`.

To extend instrumentation:
1. Use `withSentrySpan()` in `lib/sentry-client.ts` for additional client-side flows.
2. Keep spans focused on user-visible actions (submit, search, navigation).

## Source Maps Safety

- `productionBrowserSourceMaps` is enabled so Sentry can map stack traces.
- Ensure Sentry auth token, org, and project are set in production builds so source maps are uploaded and **not** served publicly.
