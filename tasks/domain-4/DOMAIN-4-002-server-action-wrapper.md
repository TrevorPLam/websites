---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-002
title: 'Enhanced createServerAction wrapper with security validation'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-002-server-action-wrapper
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-002 · Enhanced createServerAction wrapper with security validation

## Objective

Enhance the existing secureAction wrapper to follow section 4.3 specification with comprehensive input validation, authentication re-verification, tenant membership verification (IDOR prevention), and sanitized error handling for CVE-2025-29927 mitigation.

---

## Context

**Documentation Reference:**

- Security Middleware Implementation: `docs/guides/security/security-middleware-implementation.md` ✅ COMPLETED
- Server Action Security Wrapper: `docs/guides/security/server-action-security-wrapper.md` ✅ COMPLETED
- Security Headers System: `docs/guides/security/security-headers-system.md` ✅ COMPLETED
- Multi Layer Rate Limiting: `docs/guides/security/multi-layer-rate-limiting.md` ✅ COMPLETED
- Secrets Manager: `docs/guides/security/secrets-manager.md` ✅ COMPLETED
- Supabase Auth Docs: `docs/guides/security/supabase-auth-docs.md` ✅ COMPLETED

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** `packages/infra/security/secure-action.ts` — Server Action security wrapper

**Related files:** Existing secure-action.ts, tenant context, audit logger, Zod validation

**Dependencies:** Zod for validation, Supabase auth, existing security infrastructure

**Prior work:** Basic secure-action.ts exists but lacks comprehensive IDOR prevention and detailed error handling

**Constraints:** Must maintain backward compatibility while adding comprehensive security layers

---

## Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Validation     | Zod v3.24.0+ for input validation     |
| Authentication | Supabase SSR with JWT re-verification |
| Security       | IDOR prevention, error sanitization   |
| Logging        | Audit logging with correlation IDs    |

---

## Acceptance Criteria

- [ ] **[Agent]** Enhance createServerAction to follow section 4.3 specification exactly
- [ ] **[Agent]** Add comprehensive input validation with Zod schemas
- [ ] **[Agent]** Implement authentication re-verification (CVE-2025-29927 mitigation)
- [ ] **[Agent]** Add tenant membership verification for IDOR prevention
- [ ] **[Agent]** Implement detailed error sanitization preventing information leakage
- [ ] **[Agent]** Add correlation ID generation for audit logging
- [ ] **[Agent]** Maintain backward compatibility with existing secureAction
- [ ] **[Agent]** Add comprehensive test suite for security scenarios
- [ ] **[Agent]** Test with various attack vectors and edge cases
- [ ] **[Human]** Verify enhanced wrapper prevents CVE-2025-29927 class attacks

---

## Implementation Plan

- [ ] **[Agent]** **Backup existing secure-action** — Save current implementation for reference
- [ ] **[Agent]** **Analyze section 4.3 specification** — Extract all requirements from specification
- [ ] **[Agent]** **Enhance input validation** — Add comprehensive Zod schema validation
- [ ] **[Agent]** **Add auth re-verification** — Re-verify JWT tokens inside Server Actions
- [ ] **[Agent]** **Implement IDOR prevention** — Add tenant membership verification
- [ ] **[Agent]** **Add error sanitization** — Prevent information leakage in error responses
- [ ] **[Agent]** **Enhance audit logging** — Add correlation IDs and detailed logging
- [ ] **[Agent]** **Maintain compatibility** — Ensure existing code continues to work
- [ ] **[Agent]** **Create test suite** — Test all security scenarios and edge cases
- [ ] **[Agent]** **Update documentation** — Document enhanced security features

> ⚠️ **Agent Question**: Ask human before proceeding if any existing Server Actions might break with enhanced validation.

---

## Commands

```bash
# Test enhanced secureAction
pnpm test --filter="@repo/infra"

# Test Server Action security
curl -X POST http://localhost:3000/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{"malicious": "payload"}'

# Test IDOR prevention
curl -X POST http://localhost:3000/api/update-tenant \
  -H "Authorization: Bearer user-a-token" \
  -d '{"tenantId": "tenant-b-id", "data": "malicious"}'
```

---

## Code Style

```typescript
// ✅ Correct — Enhanced Server Action wrapper following section 4.3
import { z, ZodSchema } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { auditLogger } from './audit-logger';

// Enhanced types following section 4.3
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export type ActionContext = {
  userId: string;
  tenantId: string;
  userRole: 'owner' | 'admin' | 'member' | 'viewer';
  correlationId: string;
};

export type ActionHandler<TInput, TOutput> = (
  input: TInput,
  context: ActionContext
) => Promise<TOutput>;

// Enhanced error sanitization
function sanitizeError(error: unknown): { message: string; code: string } {
  // Never expose raw error messages to the client
  if (error instanceof z.ZodError) {
    return {
      message: 'Validation failed: ' + error.errors.map((e) => e.message).join(', '),
      code: 'VALIDATION_ERROR',
    };
  }

  // Detect RLS violations (Postgres error code 42501)
  if (
    error instanceof Error &&
    (error.message.includes('42501') || error.message.includes('row-level security'))
  ) {
    console.error('[RLS Violation]', error);
    return { message: 'Access denied', code: 'RLS_VIOLATION' };
  }

  // Generic fallback — never expose raw error
  return { message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' };
}

// Enhanced tenant membership verification
async function verifyTenantMembership(
  userId: string,
  tenantId: string
): Promise<{ role: ActionContext['userRole'] } | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return { role: data.role as ActionContext['userRole'] };
}

// Enhanced createServerAction wrapper
export function createServerAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: ActionHandler<TInput, TOutput>
) {
  return async function action(input: TInput): Promise<ActionResult<TOutput>> {
    const correlationId = crypto.randomUUID();

    try {
      // 1. Input validation
      const validatedInput = schema.parse(input);

      // 2. Authentication re-verification (CVE-2025-29927 mitigation)
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          cookies: cookieStore,
        }
      );

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
      }

      // 3. Tenant context extraction
      const tenantId = user.user_metadata?.tenant_id;
      if (!tenantId) {
        return { success: false, error: 'Invalid tenant context', code: 'INVALID_TENANT' };
      }

      // 4. IDOR prevention - verify tenant membership
      const membership = await verifyTenantMembership(user.id, tenantId);
      if (!membership) {
        await auditLogger.log({
          action: 'server-action.idor-attempt',
          userId: user.id,
          tenantId,
          correlationId,
          metadata: { input: validatedInput },
        });

        return { success: false, error: 'Access denied', code: 'ACCESS_DENIED' };
      }

      // 5. Build action context
      const context: ActionContext = {
        userId: user.id,
        tenantId,
        userRole: membership.role,
        correlationId,
      };

      // 6. Execute handler with validated context
      const result = await handler(validatedInput, context);

      // 7. Log successful action
      await auditLogger.log({
        action: 'server-action.success',
        userId: context.userId,
        tenantId: context.tenantId,
        correlationId,
        metadata: { input: validatedInput },
      });

      return { success: true, data: result };
    } catch (error) {
      // 8. Error handling and sanitization
      const sanitized = sanitizeError(error);

      await auditLogger.log({
        action: 'server-action.error',
        userId: 'unknown',
        tenantId: 'unknown',
        correlationId,
        metadata: { error: sanitized.message, code: sanitized.code },
      });

      return { success: false, error: sanitized.message, code: sanitized.code };
    }
  };
}
```

**Server Action principles:**

- Never trust middleware authentication alone (CVE-2025-29927 mitigation)
- Always re-verify JWT tokens inside Server Actions
- Validate tenant membership to prevent IDOR attacks
- Sanitize all errors to prevent information leakage
- Generate correlation IDs for audit trail
- Use Zod for comprehensive input validation

---

## Boundaries

| Tier             | Scope                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 4.3 specification; add all security layers; maintain backward compatibility; implement comprehensive error handling |
| ⚠️ **Ask first** | Changing existing Server Action signatures; modifying validation requirements; updating authentication flow                        |
| 🚫 **Never**     | Skip authentication re-verification; expose raw error messages; trust client input for security decisions; bypass IDOR prevention  |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm test --filter="@repo/infra"` — all tests pass with enhanced security
- [ ] **[Agent]** Test input validation — Invalid inputs are rejected with proper error codes
- [ ] **[Agent]** Test authentication re-verification — Invalid tokens are rejected
- [ ] **[Agent]** Test IDOR prevention — Cross-tenant access attempts are blocked
- [ ] **[Agent]** Test error sanitization — No sensitive information leaked in errors
- [ ] **[Agent]** Verify audit logging — All actions logged with correlation IDs
- [ ] **[Human]** Test CVE-2025-29927 mitigation — Attacks are properly blocked
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Backward compatibility:** Ensure existing Server Actions continue to work without modification
- **Error handling:** Balance security with user experience in error messages
- **Performance:** Additional security layers should not significantly impact performance
- **Database connectivity:** Handle database connection errors gracefully
- **Token expiration:** Handle expired tokens with appropriate user guidance

---

## Out of Scope

- Database-level security (handled by RLS in separate task)
- Middleware security layers (handled in separate task)
- Post-quantum cryptography (handled in separate task)
- Per-tenant secrets management (handled in separate task)

---

## References

- [Section 4.3 createServerAction Wrapper](docs/plan/domain-4/4.3-createserveraction-wrapper.md)
- [Section 4.1 Philosophy](docs/plan/domain-4/4.1-philosophy.md)
- [CVE-2025-29927 Mitigation](https://pentest-tools.com/blog/cve-2025-29927-next-js-bypass)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Zod Validation Documentation](https://zod.dev/)
