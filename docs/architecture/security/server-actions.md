<!--
@file docs/architecture/security/server-actions.md
@role Architecture documentation — server action security patterns
@summary Documents the secureAction wrapper pattern for Next.js Server Actions.
  Covers IDOR mitigation, tenant-scoped queries, audit logging, and input validation.
@invariants
  - All sensitive server actions MUST use secureAction or an equivalent pattern
  - Tenant ID is NEVER read from client input — always from JWT/AsyncLocalStorage
  - Every invocation emits an audit log entry (started + success/error)
  - Input is validated via Zod BEFORE the handler is called
@gotchas
  - secureAction imports 'server-only' — never import in client components
  - requireAuth defaults to false (anonymous allowed); set true for authenticated actions
  - Audit logger memory store is bounded at 1000 entries; production uses stdout NDJSON
@verification
  - pnpm test packages/infra -- --testPathPattern=secure-action
  - pnpm type-check
@status active — Task security-1 implemented 2026-02-21
-->

# Server Action Security Patterns

## Overview

Every Next.js Server Action that handles sensitive data (bookings, user data, payments)
must use the `secureAction` wrapper from `@repo/infra/security/secure-action`.

## The `secureAction` Wrapper

```typescript
import { secureAction } from '@repo/infra/security/secure-action';
import { z } from 'zod';

const confirmSchema = z.object({
  bookingId: z.string().uuid(),
  confirmationNumber: z.string(),
  email: z.string().email(),
});

export async function confirmBooking(input: unknown) {
  return secureAction(
    input,
    confirmSchema,
    async (ctx, data) => {
      // ctx.tenantId — from JWT/AsyncLocalStorage (never client input)
      // ctx.correlationId — fresh UUID for audit correlation
      const booking = await repository.getById(data.bookingId, ctx.tenantId);
      if (!booking) throw new Error('Not found');
      return booking;
    },
    { actionName: 'confirmBooking', siteId: siteConfig.id }
  );
}
```

### What `secureAction` Provides

| Concern           | Mechanism                                                      |
| ----------------- | -------------------------------------------------------------- |
| Input validation  | Zod schema — VALIDATION_ERROR returned if invalid              |
| Tenant isolation  | `resolveTenantId()` from JWT scope / siteId fallback           |
| Audit logging     | Start + success/error entries via `auditLogger`                |
| Structured errors | `Result<T, ActionError>` — never throws across action boundary |
| Correlation       | Fresh `crypto.randomUUID()` per invocation                     |

## ActionContext

```typescript
interface ActionContext {
  tenantId: string; // Resolved from JWT / siteId fallback
  userId: string; // 'anonymous' for public actions
  roles: string[]; // Empty for public actions
  correlationId: string; // UUID for cross-log correlation
}
```

## Error Codes

| Code                  | Cause                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| `VALIDATION_ERROR`    | Zod schema failed — includes `.issues` array                              |
| `UNAUTHORIZED`        | `requireAuth: true` and no authenticated user                             |
| `FORBIDDEN`           | User lacks required role/permission                                       |
| `RATE_LIMIT_EXCEEDED` | Rate limit hit — includes `retryAfter`                                    |
| `NOT_FOUND`           | Resource not found (use same message as forbidden to prevent enumeration) |
| `INTERNAL_ERROR`      | Handler threw — error message included                                    |

## Audit Logging

All invocations are logged via `auditLogger` (`@repo/infra/security/audit-logger`):

```typescript
// Development: human-readable console output
// Production: NDJSON to stdout for log aggregation

{
  "timestamp": "2026-02-21T02:00:00.000Z",
  "correlationId": "uuid-v4",
  "level": "info",
  "action": "confirmBooking",
  "tenantId": "tenant-uuid",
  "userId": "user-uuid",
  "status": "success"
}
```

## IDOR Prevention

Tenant-scoped queries ensure cross-tenant access is impossible at the application layer:

```typescript
// Always scope queries to the resolved tenantId — never trust client-provided IDs
const booking = await repository.getById(data.bookingId, ctx.tenantId);
// Returns null for bookings that exist but belong to a different tenant
```

Combined with Supabase RLS policies (see `security-2-rls-multi-tenant`), this
provides defense-in-depth against IDOR attacks.

## File Locations

| File                                             | Purpose           |
| ------------------------------------------------ | ----------------- |
| `packages/infra/security/secure-action.ts`       | Core wrapper      |
| `packages/infra/security/audit-logger.ts`        | Audit logging     |
| `packages/infra/src/auth/tenant-context.ts`      | Tenant resolution |
| `packages/infra/__tests__/secure-action.test.ts` | Unit tests        |

## Related

- [Tenant Context](../auth/tenant-context.md)
- [Supply Chain Security](./supply-chain.md)
- Task: `tasks/security-1-server-action-hardening.md`
