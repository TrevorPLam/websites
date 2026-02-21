# Security-3: Webhook Security & Signature Verification

## Metadata

- **Task ID**: security-3-webhook-security
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Integration security, webhook handling, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-1-server-action-hardening
- **Downstream Tasks**: infrastructure-3-integration-resilience

## Context

Webhook handlers for integrations (HubSpot, scheduling providers, etc.) currently lack:

1. Unified webhook verification framework (HMAC signature validation)
2. Timestamp-based replay protection
3. Global idempotency tracking (prevent duplicate processing)
4. Dead Letter Queue (DLQ) for failed webhooks

This addresses **Research Topic #7: Webhook Security & Signature Verification** from perplexity research.

## Dependencies

- **Upstream Task**: `security-1-server-action-hardening` — secureAction pattern may be used
- **Required Packages**: `@repo/integrations-core`, `@repo/infra`, Redis or Postgres for idempotency

## Cross-Task Dependencies & Sequencing

- **Upstream**: `security-1-server-action-hardening` (may use secureAction for webhook handlers)
- **Parallel Work**: Can work alongside integration package development
- **Downstream**: `infrastructure-3-integration-resilience` (retry/circuit breaker complements idempotency)

## Research

- **Primary topics**: [R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling), [R-SECURITY-WEBHOOKS](RESEARCH-INVENTORY.md#r-security-webhooks) (new)
- **[2026-02] Research Topic #7**: Webhook security requirements:
  - Verified HMAC or provider-specific signatures over **raw body bytes**, constant-time comparison
  - Timestamp windows + idempotency keys to prevent replay
  - At-least-once delivery handling with idempotent consumers
- **Threat Model**: Forged or replayed webhook events can cause fraud, data corruption, or arbitrary automation
- **References**:
  - [docs/research/perplexity-security-2026.md](../docs/research/perplexity-security-2026.md) (Topic #7)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)
  - OWASP API Security guidance

## Related Files

- `packages/integrations-core/src/webhook-security.ts` – create – Unified verification utilities
- `packages/integrations-core/src/webhook-idempotency.ts` – create – Idempotency tracking
- `packages/integrations/hubspot/src/webhook-handler.ts` – modify – Use webhook-security utilities
- `packages/integrations/scheduling/src/webhook-handler.ts` – modify – Use webhook-security utilities
- `docs/architecture/security/webhooks.md` – create – Document webhook security model

## Acceptance Criteria

- [ ] `webhook-security.ts` provides:
  - `verifySignature({rawBody, headers, secret, algorithm})` — HMAC verification with constant-time comparison
  - `assertFreshTimestamp(header, skewSeconds=300)` — Timestamp validation (5-minute window)
  - `assertIdempotent({eventId, ttlSeconds})` — Idempotency check using Redis/Postgres
- [ ] All webhook route handlers:
  - Read **raw body** (Next.js route config: `bodyParser: false` or equivalent)
  - Call shared security helpers before any business logic
  - Return provider-expected status codes (200, 401, 400, etc.)
- [ ] Idempotency tracking:
  - Redis or Postgres table for `event_id` with TTL
  - Prevents duplicate processing of same `event_id`
- [ ] Per-tenant webhook secrets:
  - Stored in secure config (env/secret manager), **not** in `site.config.ts`
  - `site.config.ts` references logical integration name; secrets resolved server-side
- [ ] Documentation created: `docs/architecture/security/webhooks.md`
- [ ] Unit tests for verification utilities
- [ ] Integration tests: valid signed request → 200, invalid signature → 401, stale timestamp → 400, duplicate event_id → rejected

## Technical Constraints

- Must work with Next.js route handlers (`app/api/webhooks/**/route.ts`)
- Must support multiple providers (HubSpot, Stripe-style, Calendly, etc.)
- Idempotency backend: Redis (preferred) or Postgres table
- Secrets must be stored securely (not in code or config files)

## Implementation Plan

### Phase 1: Core Security Utilities

- [ ] Create `packages/integrations-core/src/webhook-security.ts`:

  ```typescript
  export function verifySignature({
    rawBody,
    headers,
    secret,
    algorithm = 'sha256',
  }: {
    rawBody: Buffer | string;
    headers: Headers;
    secret: string;
    algorithm?: string;
  }): boolean {
    // HMAC verification with constant-time comparison
  }

  export function assertFreshTimestamp(header: string | null, skewSeconds = 300): void {
    // Validate timestamp within window
  }
  ```

- [ ] Create `packages/integrations-core/src/webhook-idempotency.ts`:
  ```typescript
  export async function assertIdempotent({
    eventId,
    ttlSeconds = 86400, // 24 hours
  }: {
    eventId: string;
    ttlSeconds?: number;
  }): Promise<void> {
    // Check Redis/Postgres for existing event_id
    // Store if new, throw if duplicate
  }
  ```

### Phase 2: Integration Updates

- [ ] Update HubSpot webhook handler:
  - Use `verifySignature` with HubSpot-specific algorithm
  - Use `assertIdempotent` with HubSpot event ID
- [ ] Update scheduling provider webhook handlers (Calendly, Acuity, Cal.com):
  - Provider-specific signature verification
  - Idempotency tracking
- [ ] Update Stripe-style webhook handlers (if applicable):
  - Stripe signature verification pattern
  - Idempotency tracking

### Phase 3: Secret Management

- [ ] Create secret resolution utility:
  - `getWebhookSecret(tenantId, integrationName)` — fetches from secure store
  - Environment variables or secret manager integration
- [ ] Update `site.config.ts` schema:
  - Remove webhook secrets (keep only logical names)
  - Document secret storage location

### Phase 4: Testing & Documentation

- [ ] Unit tests:
  - Signature verification (valid/invalid)
  - Timestamp validation (fresh/stale)
  - Idempotency (new/duplicate)
- [ ] Integration tests:
  - End-to-end webhook flow with security checks
- [ ] Create `docs/architecture/security/webhooks.md`

## Sample code / examples

### Webhook Security Utilities

```typescript
// packages/integrations-core/src/webhook-security.ts
import crypto from 'crypto';

export function verifySignature({
  rawBody,
  headers,
  secret,
  algorithm = 'sha256',
}: {
  rawBody: Buffer | string;
  headers: Headers;
  secret: string;
  algorithm?: string;
}): boolean {
  const signature = headers.get('x-signature') || headers.get('x-hubspot-signature');
  if (!signature) {
    return false;
  }

  const bodyBuffer = typeof rawBody === 'string' ? Buffer.from(rawBody) : rawBody;
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(bodyBuffer);
  const expectedSignature = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export function assertFreshTimestamp(header: string | null, skewSeconds = 300): void {
  if (!header) {
    throw new Error('Timestamp header missing');
  }

  const timestamp = parseInt(header, 10);
  const now = Math.floor(Date.now() / 1000);
  const skew = Math.abs(now - timestamp);

  if (skew > skewSeconds) {
    throw new Error(`Timestamp too stale: ${skew}s skew (max ${skewSeconds}s)`);
  }
}
```

### Idempotency Tracking

```typescript
// packages/integrations-core/src/webhook-idempotency.ts
import { redis } from '@repo/infra/redis'; // or Postgres client

export async function assertIdempotent({
  eventId,
  ttlSeconds = 86400,
}: {
  eventId: string;
  ttlSeconds?: number;
}): Promise<void> {
  const key = `webhook:event:${eventId}`;

  // Check if already processed
  const existing = await redis.get(key);
  if (existing) {
    throw new Error(`Duplicate webhook event: ${eventId}`);
  }

  // Store with TTL
  await redis.setex(key, ttlSeconds, 'processed');
}
```

### Webhook Handler Example

```typescript
// packages/integrations/hubspot/src/webhook-handler.ts
import { verifySignature, assertFreshTimestamp } from '@repo/integrations-core/webhook-security';
import { assertIdempotent } from '@repo/integrations-core/webhook-idempotency';
import { getWebhookSecret } from '@repo/infra/secrets';

export async function POST(request: Request) {
  // 1. Read raw body (Next.js route config: bodyParser: false)
  const rawBody = await request.text();
  const headers = request.headers;

  // 2. Get secret (from secure store, not config)
  const secret = await getWebhookSecret('hubspot'); // tenantId from context

  // 3. Verify signature
  if (!verifySignature({ rawBody, headers, secret })) {
    return new Response('Invalid signature', { status: 401 });
  }

  // 4. Check timestamp (if provider supports it)
  try {
    assertFreshTimestamp(headers.get('x-timestamp'));
  } catch (error) {
    return new Response('Stale timestamp', { status: 400 });
  }

  // 5. Parse body
  const payload = JSON.parse(rawBody);
  const eventId = payload.eventId || payload.id;

  // 6. Check idempotency
  try {
    await assertIdempotent({ eventId });
  } catch (error) {
    // Already processed, return 200 to acknowledge
    return new Response('OK', { status: 200 });
  }

  // 7. Process webhook (idempotent business logic)
  try {
    await processHubSpotWebhook(payload);
    return new Response('OK', { status: 200 });
  } catch (error) {
    // Log to DLQ or retry queue
    await logToDLQ({ eventId, payload, error });
    return new Response('Internal error', { status: 500 });
  }
}
```

## Testing Requirements

- **Unit Tests:**
  - Signature verification (valid/invalid signatures)
  - Timestamp validation (fresh/stale timestamps)
  - Idempotency (new/duplicate event IDs)
- **Integration Tests:**
  - Valid signed request → 200
  - Invalid signature → 401
  - Stale timestamp → 400
  - Duplicate event_id → 200 (acknowledged, not reprocessed)
- **E2E Tests:**
  - End-to-end webhook flow with security checks (Playwright or manual)

## Execution notes

- **Related files — current state:**
  - `packages/integrations/*/src/webhook-handler.ts` — may exist but verification inconsistent
  - `packages/integrations-core/` — may not exist yet
- **Potential issues / considerations:**
  - Provider-specific signature algorithms (HubSpot vs Stripe vs Calendly)
  - Raw body access in Next.js (may need route config)
  - Idempotency backend (Redis vs Postgres)
  - Secret storage (env vars vs secret manager)
- **Verification:**
  - Unit tests pass
  - Integration tests verify security checks
  - Manual test: invalid signature rejected

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing (unit + integration)
- [ ] Webhook security utilities created
- [ ] All webhook handlers updated to use security utilities
- [ ] Idempotency tracking implemented
- [ ] Documentation created (`docs/architecture/security/webhooks.md`)
- [ ] Security verified (invalid signatures rejected, replay prevented)
