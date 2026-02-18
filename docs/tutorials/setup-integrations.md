<!--
/**
 * @file docs/tutorials/setup-integrations.md
 * @role docs
 * @summary Tutorial for setting up third-party service integrations.
 *
 * @entrypoints
 * - Referenced from learning paths
 * - Integration documentation
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/integrations/overview.md (integration concepts)
 * - docs/getting-started/onboarding.md (setup)
 *
 * @used_by
 * - Developers setting up integrations
 * - Administrators configuring services
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: tutorial instructions
 * - outputs: configured integration
 *
 * @invariants
 * - Integration setup must be secure
 * - API keys must not be committed
 *
 * @gotchas
 * - Different integrations have different requirements
 * - Some integrations require server-side setup
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add integration-specific guides
 * - Create video walkthroughs
 *
 * @verification
 * - ✅ Steps verified against integration patterns
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Set Up Integrations

**Last Updated:** 2026-02-18  
**Status:** Active Tutorial  
**Estimated Time:** 30-60 minutes per integration  
**Difficulty:** Intermediate  
**Prerequisites:** Understanding of APIs, environment variables, authentication

---

This tutorial guides you through setting up third-party service integrations for your client website. You'll learn to configure analytics, CRM, payment processors, and other services.

## Overview

In this tutorial, you will:

1. Understand integration architecture
2. Choose integration package
3. Configure API credentials
4. Set up in site configuration
5. Test integration
6. Handle errors

## Prerequisites

- ✅ Client website created
- ✅ Environment variables configured
- ✅ API accounts created (for services you're integrating)
- ✅ API keys/credentials obtained

## Integration Types

### Available Integrations

- **Analytics**: Google Analytics, Plausible
- **CRM**: HubSpot, Salesforce
- **Email**: SendGrid, Mailchimp
- **Payments**: Stripe, PayPal
- **Forms**: Typeform, Formspree
- **CMS**: Contentful, Sanity

## Step 1: Choose Integration Package (5 minutes)

Check available integrations:

```bash
# List integration packages
ls packages/integrations/
```

Or check `packages/integrations/` directory in your editor.

Each integration has:
- Package: `@repo/integrations-[name]`
- Configuration: In `site.config.ts`
- Environment variables: In `.env.local`

## Step 2: Install Integration Package (5 minutes)

If the integration package doesn't exist, you may need to create it. For existing packages:

```bash
# Integration packages are workspace dependencies
# They're already available if in the workspace
# Just import and use them
```

## Step 3: Configure Environment Variables (10 minutes)

Add integration credentials to `.env.local`:

```env
# Example: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Example: HubSpot
HUBSPOT_API_KEY=your_hubspot_api_key
HUBSPOT_PORTAL_ID=your_portal_id

# Example: Stripe (server-side)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Security:**
- ✅ Never commit `.env.local`
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Use environment-specific variables

## Step 4: Configure in site.config.ts (10 minutes)

Add integration configuration:

```typescript
// site.config.ts
import { defineConfig } from '@repo/types'

export default defineConfig({
  // ... other config
  
  integrations: {
    analytics: {
      provider: 'google-analytics',
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
    crm: {
      provider: 'hubspot',
      apiKey: process.env.HUBSPOT_API_KEY,
      portalId: process.env.HUBSPOT_PORTAL_ID,
    },
    // Add more integrations
  },
})
```

**Configuration patterns:**
- Use environment variables
- Validate configuration
- Provide sensible defaults
- Document required fields

## Step 5: Use Integration in Code (15 minutes)

### Client-Side Integration (Analytics)

```typescript
// app/layout.tsx or component
'use client'

import { useAnalytics } from '@repo/integrations/google-analytics'

export function AnalyticsProvider() {
  useAnalytics({
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!,
  })
  
  return null
}
```

### Server-Side Integration (API)

```typescript
// app/api/contact/route.ts
import { createHubSpotClient } from '@repo/integrations/hubspot'

export async function POST(request: Request) {
  const hubspot = createHubSpotClient({
    apiKey: process.env.HUBSPOT_API_KEY!,
  })
  
  const data = await request.json()
  
  await hubspot.contacts.create(data)
  
  return Response.json({ success: true })
}
```

## Step 6: Test Integration (10 minutes)

### Test Client-Side

1. Start dev server: `pnpm dev`
2. Open browser DevTools
3. Check Network tab for API calls
4. Verify events are sent
5. Check integration dashboard

### Test Server-Side

```typescript
// Test API route
const response = await fetch('/api/test-integration', {
  method: 'POST',
  body: JSON.stringify({ test: true }),
})

console.log(await response.json())
```

## Step 7: Handle Errors (10 minutes)

Add error handling:

```typescript
import { createIntegrationClient } from '@repo/integrations/[name]'

try {
  const client = createIntegrationClient(config)
  await client.send(data)
} catch (error) {
  console.error('Integration error:', error)
  // Fallback behavior
  // Log to error tracking (Sentry)
}
```

## Common Integrations

### Google Analytics

**Setup:**
1. Create GA4 property
2. Get Measurement ID
3. Add to environment variables
4. Configure in `site.config.ts`

**Usage:**
```typescript
import { trackEvent } from '@repo/integrations/google-analytics'

trackEvent('button_click', { button_name: 'contact' })
```

### HubSpot CRM

**Setup:**
1. Create HubSpot account
2. Generate API key
3. Get Portal ID
4. Configure credentials

**Usage:**
```typescript
import { createHubSpotClient } from '@repo/integrations/hubspot'

const client = createHubSpotClient(config)
await client.contacts.create({ email, name })
```

### Stripe Payments

**Setup:**
1. Create Stripe account
2. Get API keys (test/live)
3. Configure webhooks
4. Set up payment intents

**Usage:**
```typescript
import { createStripeClient } from '@repo/integrations/stripe'

const stripe = createStripeClient(config)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
})
```

## Integration Patterns

### Adapter Pattern

Integrations use adapter pattern for consistency:

```typescript
interface IntegrationAdapter {
  initialize(config: IntegrationConfig): void
  send(data: unknown): Promise<void>
  validate(): boolean
}
```

### Error Handling

```typescript
class IntegrationError extends Error {
  constructor(
    message: string,
    public code: string,
    public integration: string
  ) {
    super(message)
  }
}
```

### Configuration Validation

```typescript
import { z } from 'zod'

const integrationConfigSchema = z.object({
  apiKey: z.string().min(1),
  // ... more fields
})

export function validateConfig(config: unknown) {
  return integrationConfigSchema.parse(config)
}
```

## Security Best Practices

### API Keys

- ✅ Store in environment variables
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Never log keys
- ✅ Use secret management (Vercel, etc.)

### Webhooks

- ✅ Verify webhook signatures
- ✅ Validate payloads
- ✅ Handle idempotency
- ✅ Log webhook events

### Rate Limiting

- ✅ Implement rate limiting
- ✅ Handle rate limit errors
- ✅ Use exponential backoff
- ✅ Cache when possible

## Troubleshooting

### Integration Not Working

1. **Check credentials:**
   ```bash
   # Verify environment variables are set
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Check configuration:**
   - Verify `site.config.ts` syntax
   - Check required fields
   - Validate types

3. **Check network:**
   - Browser DevTools Network tab
   - Server logs
   - Integration dashboard

4. **Check errors:**
   - Console errors
   - Server logs
   - Error tracking (Sentry)

### Common Issues

**Environment variables not loading:**
- Restart dev server
- Check `.env.local` file
- Verify variable names

**API errors:**
- Check API key validity
- Verify API permissions
- Check rate limits

**CORS errors:**
- Configure CORS on API side
- Use server-side proxy if needed

## Next Steps

- ✅ Add more integrations
- ✅ Create custom integrations
- ✅ Set up webhooks
- ✅ Monitor integration health
- ✅ Optimize integration performance

## Related Resources

- [Integration Overview](../integrations/overview.md)
- [API Reference](../integrations/api-reference.md)
- [Security Practices](../operations/security.md)
- [Troubleshooting Guide](../getting-started/troubleshooting.md)

---

**Ready for more?** Explore [Integration Documentation](../integrations/) for detailed guides on specific integrations!
