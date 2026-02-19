# Security-1: Server Action Hardening & IDOR Mitigation

## Metadata

- **Task ID**: security-1-server-action-hardening
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: IDOR protection, booking feature, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-5-booking-actions-verification
- **Downstream Tasks**: security-2-rls-multi-tenant, security-6-react-taint-api, infrastructure-1-observability-opentelemetry

## Context

Booking actions (`confirmBooking`, `cancelBooking`, `getBookingDetails`) currently have basic verification but lack:

1. Unified `secureAction` wrapper pattern for auth + validation + logging
2. Tenant-scoped queries (all queries must include `tenant_id`)
3. Security audit logging for sensitive state changes
4. Rate limiting and idempotency for side-effectful actions

This addresses **Research Topic #1: Server Action Security & IDOR Mitigation** from perplexity research.

## Dependencies

- **Upstream Task**: `0-5-booking-actions-verification` — booking actions exist with verification params
- **Required Packages**: `@repo/infra`, `@repo/features`, `@repo/types`

## Cross-Task Dependencies & Sequencing

- **Upstream**: `0-5-booking-actions-verification` (verification params added)
- **Parallel Work**: Can work alongside `security-2-rls-multi-tenant` (RLS policies)
- **Downstream**: `security-2-rls-multi-tenant` (uses secureAction pattern), `infrastructure-1-observability-opentelemetry` (uses audit logs)

## Research

- **Primary topics**: [R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling), [R-NEXT](RESEARCH-INVENTORY.md#r-next-app-router-rsc-server-actions), [R-SECURITY-SERVER-ACTIONS](RESEARCH-INVENTORY.md#r-security-server-actions) (new), [R-REACT-TAINT-API](RESEARCH-INVENTORY.md#r-react-taint-api) (new)
- **[2026-02] Research Topic #1** (Perplexity): Every Server Action handling sensitive data must enforce:
  - Input validation (Zod/valibot)
  - Authentication (session or access token)
  - Authorization (ownership / role / tenant checks)
  - Rate limiting and idempotency for side-effectful actions
- **[2026-02] Additional Research** (Gemini): React Taint API should be used to prevent sensitive data leakage:
  - Use `experimental_taintObjectReference` to mark sensitive objects
  - Sanitize DTOs before serialization to client
  - See `security-6-react-taint-api` for full implementation
- **Threat Model**: IDOR/Broken object-level authorization exposing other tenants' bookings; business logic abuse (over-booking, resource quota violations); accidental PII exposure via DTOs
- **References**:
  - [RESEARCH-INVENTORY.md – R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling)
  - [docs/research/perplexity-security-2026.md](../docs/research/perplexity-security-2026.md) (Topic #1)
  - [docs/archive/research/gemini-production-audit-2026.md](../docs/archive/research/gemini-production-audit-2026.md) (Server Action Security)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)

## Related Files

- `packages/infra/src/security/secure-action.ts` – create – Unified wrapper for auth + validation + logging
- `packages/infra/src/security/audit-logger.ts` – create – Security audit logging utility
- `packages/features/src/booking/lib/booking-actions.ts` – modify – Refactor to use secureAction wrapper
- `packages/database/src/booking.ts` – modify – Add tenant-scoped query helpers
- `packages/infra/src/rate-limit/action-rate-limit.ts` – create – Rate limiting for server actions
- `docs/architecture/security/server-actions.md` – create – Document secure action pattern

## Acceptance Criteria

- [ ] `secureAction` wrapper implemented with:
  - Session/auth validation
  - Zod input validation
  - Typed context (`{ userId, tenantId, roles }`)
  - Security audit logging
- [ ] All booking actions refactored to use `secureAction`:
  - `confirmBooking` — tenant-scoped query, audit log
  - `cancelBooking` — tenant-scoped query, audit log
  - `getBookingDetails` — tenant-scoped query
- [ ] Tenant-scoped query helpers in `packages/database/src/booking.ts`:
  - `getBookingForTenant({bookingId, tenantId})`
  - `updateBookingStatus({bookingId, tenantId, ...})`
- [ ] Rate limiting added to mutation actions (confirm/cancel)
- [ ] Security audit logs include: `tenantId`, `userId`, `action`, `bookingId`, `timestamp`, `correlationId`
- [ ] Documentation created: `docs/architecture/security/server-actions.md`
- [ ] Unit tests for `secureAction` wrapper
- [ ] Integration tests verify IDOR protection (cross-tenant access fails)

## Technical Constraints

- Must work with Next.js Server Actions (`'use server'`)
- Must integrate with existing auth system (Supabase or session-based)
- Audit logs must be tenant-aware and searchable
- Rate limiting must use existing infra (Upstash Redis or in-memory fallback)

## Implementation Plan

### Phase 1: Core Infrastructure

- [ ] Create `packages/infra/src/security/secure-action.ts`:
  ```typescript
  export async function secureAction<TInput, TOutput>(
    input: TInput,
    schema: z.ZodSchema<TInput>,
    handler: (ctx: ActionContext, input: TInput) => Promise<TOutput>
  ): Promise<Result<TOutput, ActionError>>;
  ```
- [ ] Create `packages/infra/src/security/audit-logger.ts`:
  - Structured logging with tenant/user context
  - Integration with observability (OpenTelemetry spans)
- [ ] Create `packages/infra/src/rate-limit/action-rate-limit.ts`:
  - Per-user and per-IP rate limits
  - Configurable limits per action type

### Phase 2: Database Layer

- [ ] Update `packages/database/src/booking.ts`:
  - Add `getBookingForTenant({bookingId, tenantId})`
  - Add `updateBookingStatus({bookingId, tenantId, ...})`
  - Ensure all queries include tenant_id filter

### Phase 3: Action Refactoring

- [ ] Refactor `confirmBooking` to use `secureAction`
- [ ] Refactor `cancelBooking` to use `secureAction`
- [ ] Refactor `getBookingDetails` to use `secureAction`
- [ ] Add rate limiting to mutation actions

### Phase 4: Testing & Documentation

- [ ] Unit tests for `secureAction` wrapper
- [ ] Integration tests for IDOR protection
- [ ] Create `docs/architecture/security/server-actions.md`
- [ ] Update `tasks/archive/0-5-booking-actions-verification.md` to reference this task

## Sample code / examples

### secureAction Wrapper

```typescript
// packages/infra/src/security/secure-action.ts
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { auditLogger } from './audit-logger';
import { rateLimitAction } from '../rate-limit/action-rate-limit';

export interface ActionContext {
  userId: string;
  tenantId: string;
  roles: string[];
  correlationId: string;
}

export async function secureAction<TInput, TOutput>(
  input: TInput,
  schema: z.ZodSchema<TInput>,
  handler: (ctx: ActionContext, input: TInput) => Promise<TOutput>,
  options?: {
    actionName: string;
    rateLimit?: { maxRequests: number; windowMs: number };
  }
): Promise<Result<TOutput, ActionError>> {
  // 1. Validate input
  const validated = schema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', issues: validated.error.issues } };
  }

  // 2. Authenticate
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: { code: 'UNAUTHORIZED' } };
  }

  // 3. Rate limit (if configured)
  if (options?.rateLimit) {
    const rateLimitResult = await rateLimitAction(
      session.user.id,
      options.actionName,
      options.rateLimit
    );
    if (!rateLimitResult.allowed) {
      return { success: false, error: { code: 'RATE_LIMIT_EXCEEDED' } };
    }
  }

  // 4. Create context
  const ctx: ActionContext = {
    userId: session.user.id,
    tenantId: session.user.tenantId,
    roles: session.user.roles || [],
    correlationId: crypto.randomUUID(),
  };

  // 5. Audit log (before)
  auditLogger.log({
    level: 'info',
    action: options?.actionName || 'unknown',
    userId: ctx.userId,
    tenantId: ctx.tenantId,
    correlationId: ctx.correlationId,
    metadata: { input: validated.data },
  });

  try {
    // 6. Execute handler
    const result = await handler(ctx, validated.data);

    // 7. Audit log (success)
    auditLogger.log({
      level: 'info',
      action: options?.actionName || 'unknown',
      userId: ctx.userId,
      tenantId: ctx.tenantId,
      correlationId: ctx.correlationId,
      status: 'success',
      metadata: { result },
    });

    return { success: true, data: result };
  } catch (error) {
    // 8. Audit log (error)
    auditLogger.log({
      level: 'error',
      action: options?.actionName || 'unknown',
      userId: ctx.userId,
      tenantId: ctx.tenantId,
      correlationId: ctx.correlationId,
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    });

    return { success: false, error: { code: 'INTERNAL_ERROR', message: String(error) } };
  }
}
```

### Refactored Booking Action

```typescript
// packages/features/src/booking/lib/booking-actions.ts
import { secureAction } from '@repo/infra/security/secure-action';
import { getBookingForTenant, updateBookingStatus } from '@repo/database/booking';
import { z } from 'zod';

const confirmBookingSchema = z.object({
  bookingId: z.string().uuid(),
  confirmationNumber: z.string(),
  email: z.string().email(),
});

export async function confirmBooking(input: unknown) {
  return secureAction(
    input,
    confirmBookingSchema,
    async (ctx, { bookingId, confirmationNumber, email }) => {
      // Tenant-scoped query
      const booking = await getBookingForTenant({
        bookingId,
        tenantId: ctx.tenantId,
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Verify ownership
      if (booking.confirmationNumber !== confirmationNumber || booking.email !== email) {
        throw new Error('Verification failed');
      }

      // Update status
      await updateBookingStatus({
        bookingId,
        tenantId: ctx.tenantId,
        status: 'confirmed',
      });

      return { success: true };
    },
    {
      actionName: 'confirmBooking',
      rateLimit: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
    }
  );
}
```

## Testing Requirements

- **Unit Tests:**
  - `secureAction` wrapper: auth failure, validation failure, rate limit, success
  - Audit logger: log format, tenant context
- **Integration Tests:**
  - Cross-tenant booking access fails (IDOR protection)
  - Rate limiting enforced
  - Audit logs contain expected fields
- **E2E Tests:**
  - Booking flow with secureAction (Playwright)

## Execution notes

- **Related files — current state:**
  - `packages/features/src/booking/lib/booking-actions.ts` — exists with verification params (task 0-5)
  - `packages/infra/src/security/` — may not exist yet
- **Potential issues / considerations:**
  - Auth system integration (Supabase vs session-based)
  - Rate limiting backend (Upstash Redis vs in-memory)
  - Audit log storage (structured logs vs database)
- **Verification:**
  - `pnpm test` — all tests pass
  - `pnpm type-check` — no type errors
  - Manual test: cross-tenant access fails

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing (unit + integration)
- [ ] Type-check passes
- [ ] Documentation created (`docs/architecture/security/server-actions.md`)
- [ ] Booking actions refactored to use `secureAction`
- [ ] IDOR protection verified (cross-tenant access fails)
- [ ] Audit logging verified (logs contain tenant/user context)
