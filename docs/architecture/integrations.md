<!--
/**
 * @file docs/architecture/integrations.md
 * @role docs
 * @summary Integration package architecture and resilience patterns.
 *
 * @entrypoints
 * - Architecture documentation for integration packages
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - tasks/infrastructure-3-integration-resilience.md
 * - packages/integrations-core
 *
 * @used_by
 * - Developers implementing integrations
 * - Operations monitoring integration health
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: External API requests
 * - outputs: Resilient API responses or DLQ entries
 *
 * @invariants
 * - All integrations use ResilientHttpClient
 * - Retries handle transient failures
 * - Circuit breaker prevents cascading failures
 * - Failed requests stored in DLQ
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Integration Architecture

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Task infrastructure-3](../../tasks/infrastructure-3-integration-resilience.md), [@repo/integrations-core](../../packages/integrations-core)

---

## Overview

Integration packages (`@repo/integrations-*`) provide standardized interfaces to third-party services (CRM, scheduling, email, chat, reviews, maps). All integrations use the resilience utilities from `@repo/integrations-core` to handle failures gracefully.

## Resilience Patterns

### Retry Logic

Transient failures (429, 5xx, network errors) are automatically retried with exponential backoff:

```typescript
import { ResilientHttpClient } from '@repo/integrations-core/client';

const client = new ResilientHttpClient({
  integration: 'hubspot',
  retry: {
    maxAttempts: 3,
    initialBackoffMs: 1000,
    backoffMultiplier: 2,
    maxBackoffMs: 10000,
  },
});
```

### Circuit Breaker

Prevents cascading failures by opening circuit after failure threshold:

```typescript
const client = new ResilientHttpClient({
  integration: 'hubspot',
  circuitBreaker: {
    failureThreshold: 5, // Open after 5 failures
    timeoutMs: 60000, // Wait 1 minute before half-open
    halfOpenMaxAttempts: 2, // Close after 2 successes
  },
});
```

**States:**
- **Closed:** Normal operation, requests pass through
- **Open:** Circuit open, requests fail immediately (no retries)
- **Half-Open:** Testing recovery, limited requests allowed

### Dead Letter Queue (DLQ)

Failed requests after max retries are stored in DLQ:

```typescript
import { getDLQEntries, processDLQEntry } from '@repo/integrations-core/dlq';

// Get failed requests
const entries = await getDLQEntries('hubspot');

// Process manually
for (const entry of entries) {
  await processDLQEntry(entry.id);
}
```

## Integration Package Structure

### Standard Pattern

```typescript
// packages/integrations/hubspot/src/client.ts
import { ResilientHttpClient } from '@repo/integrations-core/client';
import type { HubSpotContact } from './types';

const client = new ResilientHttpClient({
  integration: 'hubspot',
  retry: {
    maxAttempts: 3,
    initialBackoffMs: 1000,
  },
  circuitBreaker: {
    failureThreshold: 5,
    timeoutMs: 60000,
  },
});

export async function createContact(data: HubSpotContact) {
  const response = await client.request('https://api.hubapi.com/contacts/v1/contact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

## Error Handling

### Error Types

- **IntegrationError** - Base error for integration failures
- **RateLimitError** - 429 rate limit (retryable)
- **CircuitBreakerOpenError** - Circuit breaker open (not retryable)
- **NetworkError** - Network/timeout failures (retryable)

### Error Handling Pattern

```typescript
import {
  IntegrationError,
  RateLimitError,
  CircuitBreakerOpenError,
} from '@repo/integrations-core/errors';

try {
  await createContact(data);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Rate limited - will retry automatically
    console.warn('Rate limited, retrying...', error.retryAfter);
  } else if (error instanceof CircuitBreakerOpenError) {
    // Circuit breaker open - don't retry
    console.error('Circuit breaker open, integration unavailable');
  } else if (error instanceof IntegrationError) {
    // Other integration error
    console.error('Integration error:', error.message);
  }
}
```

## Integration Packages

### Current Integrations

| Package | Provider | Status | Resilience |
|---------|----------|--------|------------|
| `@repo/integrations-analytics` | Google Analytics, Plausible | Scaffolded | Not implemented |
| `@repo/integrations-hubspot` | HubSpot CRM | Scaffolded | Not implemented |
| `@repo/integrations-supabase` | Supabase | Active | N/A (database) |
| `@repo/integrations-scheduling` | Calendly, Acuity, Cal.com | Scaffolded | Not implemented |
| `@repo/integrations-email` | Mailchimp, SendGrid, ConvertKit | Scaffolded | Not implemented |
| `@repo/integrations-chat` | Intercom, Crisp, Tidio | Scaffolded | Not implemented |
| `@repo/integrations-reviews` | Google, Yelp, Trustpilot | Scaffolded | Not implemented |
| `@repo/integrations-maps` | Google Maps | Scaffolded | Not implemented |

### Migration Path

To add resilience to existing integrations:

1. **Install dependency:**
   ```bash
   pnpm add @repo/integrations-core
   ```

2. **Replace fetch with ResilientHttpClient:**
   ```typescript
   // Before
   const response = await fetch(url, options);

   // After
   const client = new ResilientHttpClient({ integration: 'hubspot', ... });
   const response = await client.request(url, options);
   ```

3. **Handle errors:**
   ```typescript
   try {
     await client.request(url, options);
   } catch (error) {
     if (error instanceof RateLimitError) {
       // Handle rate limit
     }
   }
   ```

## Monitoring

### Circuit Breaker State

```typescript
const state = client.getCircuitBreakerState();
// 'closed' | 'open' | 'half-open'
```

### DLQ Monitoring

```typescript
import { getDLQEntries } from '@repo/integrations-core/dlq';

// Monitor failed requests
const failedRequests = await getDLQEntries('hubspot');
console.log(`Failed requests: ${failedRequests.length}`);
```

## Best Practices

1. **Always use ResilientHttpClient** for external API calls
2. **Configure retry/circuit breaker** per integration (different APIs have different limits)
3. **Monitor DLQ** for patterns indicating integration issues
4. **Handle errors gracefully** - don't let integration failures break user flows
5. **Log integration calls** for debugging and monitoring

## Related Documentation

- [Task infrastructure-3](../../tasks/infrastructure-3-integration-resilience.md)
- [@repo/integrations-core source](../../packages/integrations-core)
- [Integration Script Metadata](../third-party-scripts.md)
