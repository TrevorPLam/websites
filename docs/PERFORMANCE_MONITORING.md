# Performance Monitoring

This document describes the performance monitoring setup for Your Dedicated Marketer.

## Overview

The application uses Sentry for distributed tracing and performance monitoring. Key metrics are tracked for:
- Server actions (contact form submissions)
- Middleware execution
- Database operations
- External API calls (HubSpot)

## Architecture

### 1. Sentry Integration

**Configuration Files:**
- `sentry.server.config.ts` - Server-side Sentry configuration
- `sentry.client.config.ts` - Client-side Sentry configuration
- `sentry.edge.config.ts` - Edge runtime Sentry configuration

**Trace Sample Rate:**
- Development: 100% (all requests traced)
- Production: 10% (sampled for cost efficiency)

### 2. Performance Instrumentation

#### Server Actions (`lib/actions/submit.ts`)

Contact form submissions are automatically traced with Sentry spans:

```typescript
import { withServerSpan } from '../sentry-server'

export async function submitContactForm(data: ContactFormData) {
  return withServerSpan(
    {
      name: 'contact_form.submit',
      op: 'action',
      attributes: {
        request_id_hash: correlationIdHash,
      },
    },
    async () => {
      // Form submission logic
    },
  )
}
```

**Tracked Metrics:**
- Total submission duration
- Rate limiting check time
- Database insert time
- HubSpot sync time

#### Middleware (`middleware.ts`)

Middleware execution time is tracked using the `Server-Timing` header:

```typescript
const startTime = performance.now()
// ... middleware logic ...
const duration = performance.now() - startTime
response.headers.set('Server-Timing', `middleware;dur=${duration.toFixed(2)}`)
```

**Tracked Metrics:**
- Total middleware execution time
- Exposed via `Server-Timing` HTTP header
- Visible in browser DevTools Network tab

#### Database Operations (`lib/actions/supabase.ts`)

Database operations are wrapped with Sentry spans:

```typescript
export async function insertLeadWithSpan(
  sanitized: SanitizedContactData,
  isSuspicious: boolean,
): Promise<Lead> {
  return withServerSpan(
    {
      name: 'db.insert_lead',
      op: 'db',
      attributes: {
        suspicious: isSuspicious,
      },
    },
    async () => await insertLead(sanitized, isSuspicious),
  )
}
```

## Monitoring in Sentry

### Accessing Performance Data

1. Navigate to Sentry Dashboard: https://sentry.io
2. Select "Performance" tab
3. Filter by:
   - Transaction: `contact_form.submit`
   - Operation: `action`, `db`, `http`

### Key Metrics

**Contact Form Performance:**
- **P50 (Median)**: Target < 500ms
- **P95**: Target < 1000ms
- **P99**: Target < 2000ms

**Middleware Performance:**
- **P50**: Target < 5ms
- **P95**: Target < 10ms
- **P99**: Target < 20ms

### Alerts

Configure Sentry alerts for:
- P95 latency > 2000ms (contact form)
- P95 latency > 50ms (middleware)
- Error rate > 1%

## Local Development

### Viewing Performance Data

1. **Browser DevTools:**
   - Open Network tab
   - Look for `Server-Timing` header on responses
   - Shows middleware execution time

2. **Sentry (Optional):**
   - Set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`
   - Set `NEXT_PUBLIC_SENTRY_DEBUG=true` for verbose logging
   - Performance data sent to Sentry in dev mode

### Testing Performance

```bash
# Run with Sentry tracing enabled
NEXT_PUBLIC_SENTRY_DSN=your-dsn npm run dev

# Submit a test form
# Check Sentry for transaction traces
```

## Performance Utilities

### `withServerSpan` Helper

Located in `lib/sentry-server.ts`:

```typescript
/**
 * Wrap async operations with Sentry performance tracing.
 * 
 * @param options - Span configuration (name, op, attributes)
 * @param callback - Async operation to trace
 * @returns Result of callback
 */
export async function withServerSpan<T>(
  options: SpanOptions,
  callback: () => Promise<T>,
): Promise<T>
```

**Usage Example:**

```typescript
import { withServerSpan } from '@/lib/sentry-server'

async function expensiveOperation() {
  return withServerSpan(
    {
      name: 'my_operation',
      op: 'function',
      attributes: { key: 'value' },
    },
    async () => {
      // Your expensive operation here
      return result
    },
  )
}
```

## Best Practices

1. **Wrap Critical Paths:**
   - All server actions should use `withServerSpan`
   - Database queries should be traced
   - External API calls should be traced

2. **Use Descriptive Names:**
   - Format: `category.action` (e.g., `contact_form.submit`)
   - Use consistent naming across the codebase

3. **Add Relevant Attributes:**
   - Include context-specific data (hashed IDs, flags)
   - Avoid PII (use hashed values)

4. **Monitor Regularly:**
   - Review P95/P99 latencies weekly
   - Set up alerts for regressions
   - Investigate slow transactions

## Troubleshooting

### Performance Issues

**Slow Form Submissions:**
1. Check Sentry transaction waterfall
2. Identify slow operations (DB, HubSpot)
3. Optimize or add caching

**Slow Middleware:**
1. Review `Server-Timing` headers
2. Check CSP generation time
3. Consider caching security headers

### Missing Traces

**Sentry Not Receiving Data:**
1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check Sentry project settings
3. Verify sample rate (may be too low)

## Future Improvements

- [ ] Add custom performance metrics (Core Web Vitals)
- [ ] Set up Sentry dashboards for key metrics
- [ ] Add performance budgets to CI/CD
- [ ] Implement real user monitoring (RUM)
- [ ] Add database query performance tracking
- [ ] Monitor third-party script impact

## Related Documentation

- [Sentry Performance Documentation](https://docs.sentry.io/product/performance/)
- [Server-Timing Header Spec](https://www.w3.org/TR/server-timing/)
- [SECURITY.md](../SECURITY.md) - Security monitoring
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
