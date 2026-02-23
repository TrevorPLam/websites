---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-004
title: 'RLS isolation test suite with comprehensive security validation'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: test # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-004-rls-isolation-tests
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-004 · RLS isolation test suite with comprehensive security validation

## Objective

Implement comprehensive RLS isolation test suite following section 4.5 specification with Playwright E2E tests that validate cross-tenant data access prevention, IDOR attack mitigation, and complete tenant isolation enforcement.

---

## Context

**Codebase area:** `e2e/multi-tenant/` — E2E test suite for RLS validation

**Related files:** Database schema, RLS policies, authentication system, test utilities

**Dependencies:** Playwright, Supabase client, existing test infrastructure

**Prior work:** Basic test infrastructure exists but lacks comprehensive RLS isolation testing

**Constraints:** Must validate all RLS policies and prevent any cross-tenant data access

---

## Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Testing        | Playwright E2E with Supabase integration |
| Database       | Supabase PostgreSQL with RLS policies    |
| Authentication | JWT token-based authentication           |
| Security       | Multi-tenant isolation validation        |

---

## Acceptance Criteria

- [ ] **[Agent]** Create comprehensive RLS isolation test suite following section 4.5
- [ ] **[Agent]** Implement tenant context setup helpers for isolated testing
- [ ] **[Agent]** Add cross-tenant read access prevention tests
- [ ] **[Agent]** Add cross-tenant write access prevention tests
- [ ] **[Agent]** Test IDOR attack mitigation scenarios
- [ ] **[Agent]** Add RLS violation detection and error handling tests
- [ ] **[Agent]** Implement performance tests for RLS query optimization
- [ ] **[Agent]** Add cleanup procedures for test data isolation
- [ ] **[Human]** Verify tests catch all RLS violations and prevent data leakage

---

## Implementation Plan

- [ ] **[Agent]** **Create test helpers** — Implement setTenantContext for isolated user creation
- [ ] **[Agent]** **Setup test tenants** — Create test tenant IDs and user accounts
- [ ] **[Agent]** **Implement read isolation tests** — Verify Tenant A cannot read Tenant B data
- [ ] **[Agent]** **Implement write isolation tests** — Verify Tenant A cannot write to Tenant B data
- [ ] **[Agent]** **Add IDOR prevention tests** — Test various IDOR attack scenarios
- [ ] **[Agent]** **Test RLS violations** — Verify RLS violations are handled gracefully
- [ ] **[Agent]** **Add performance tests** — Ensure RLS doesn't impact query performance significantly
- [ ] **[Agent]** **Create cleanup procedures** — Ensure test isolation between test runs
- [ ] **[Agent]** **Integrate with CI/CD** — Add RLS tests to automated test pipeline

> ⚠️ **Agent Question**: Ask human before proceeding if any existing tests might conflict with RLS testing.

---

## Commands

```bash
# Run RLS isolation tests
pnpm test e2e/multi-tenant/rls-isolation.spec.ts

# Run specific test scenario
pnpm test --grep "Tenant A cannot read Tenant B"

# Run tests with different environments
NODE_ENV=test pnpm test e2e/multi-tenant/

# Generate test report
pnpm test e22/multi-tenant/ --reporter=html
```

---

## Code Style

```typescript
// ✅ Correct — Comprehensive RLS isolation test suite
import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Test helpers: create isolated tenant users
// ============================================================================

async function setTenantContext(tenantId: string, role: 'owner' | 'member' = 'owner') {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Create a test user for this tenant
  const {
    data: { user },
  } = await supabase.auth.admin.createUser({
    email: `test-${tenantId}@test.example.com`,
    password: 'TestPassword123!',
    email_confirm: true,
  });

  if (!user) throw new Error('Failed to create test user');

  // Add user to tenant_members
  await supabase.from('tenant_members').insert({
    tenant_id: tenantId,
    user_id: user.id,
    role,
  });

  // Sign in as this user and return an authenticated client
  const {
    data: { session },
  } = await supabase.auth.signInWithPassword({
    email: `test-${tenantId}@test.example.com`,
    password: 'TestPassword123!',
  });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
        },
      },
    }
  );
}

// Test tenant IDs (seeded in test DB)
const TENANT_A = '11111111-1111-1111-1111-111111111111';
const TENANT_B = '22222222-2222-2222-2222-222222222222';

test.describe('RLS Isolation: Cross-tenant data access is blocked', () => {
  test('Tenant A cannot read Tenant B leads', async () => {
    const clientA = await setTenantContext(TENANT_A);

    // Insert a lead for Tenant B using service role
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: seedLead } = await adminClient
      .from('leads')
      .insert({
        tenant_id: TENANT_B,
        name: 'Secret Lead',
        email: 'secret@tenantb.com',
        message: 'Confidential',
      })
      .select('id')
      .single();

    // Tenant A attempts to read Tenant B's lead — MUST return empty, not the lead
    const { data: leads, error } = await clientA.from('leads').select('*').eq('id', seedLead!.id);

    expect(error).toBeNull(); // No error — RLS silently filters, not errors
    expect(leads).toHaveLength(0); // CRITICAL: zero rows returned

    // Cleanup
    await adminClient.from('leads').delete().eq('id', seedLead!.id);
  });

  test('Tenant A cannot write leads into Tenant B', async () => {
    const clientA = await setTenantContext(TENANT_A);

    const { error } = await clientA.from('leads').insert({
      tenant_id: TENANT_B, // Attempting to inject into wrong tenant
      name: 'Malicious Lead',
      email: 'hacker@evil.com',
      message: 'IDOR attempt',
    });

    expect(error).not.toBeNull(); // RLS violation should be blocked
    expect(error?.message).toContain('new row violates row-level security policy');
  });

  test('RLS violations are logged without exposing data', async () => {
    const clientA = await setTenantContext(TENANT_A);

    // Attempt to access tenant B data
    const { error } = await clientA.from('tenants').select('*').eq('id', TENANT_B);

    expect(error).toBeNull(); // RLS violations don't throw errors, they filter results
    // Verify no data was leaked in the response
    // (This would be tested in the actual implementation)
  });
});
```

**RLS testing principles:**

- Each test creates isolated tenant contexts to prevent interference
- RLS violations should be detected by empty result sets, not errors
- Test both read and write operations for comprehensive coverage
- Include IDOR attack scenarios to validate tenant isolation
- Clean up test data to maintain test isolation
- Use service role only for setup/cleanup, not for testing RLS

---

## Boundaries

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 4.5 specification; test all RLS policies; prevent cross-tenant access; include IDOR attack scenarios; maintain test isolation |
| ⚠️ **Ask first** | Modifying existing test infrastructure; changing test database setup; updating authentication flow for tests                                 |
| 🚫 **Never**     | Allow cross-tenant data access in tests; expose sensitive test data; skip RLS violation testing; bypass tenant isolation verification        |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm test e2e/multi-tenant/rls-isolation.spec.ts` — all tests pass
- [ ] **[Agent]** Verify read isolation — Cross-tenant reads return empty results
- [ ] **[Agent]** Verify write isolation — Cross-tenant writes are rejected
- [ ] **[Agent]** Test IDOR prevention — IDOR attacks are blocked
- [ ] **[Agent]** Verify error handling — RLS violations don't expose data
- [ ] **[Agent]** Test cleanup procedures — Test isolation is maintained
- [ ] **[Human]** Run manual security tests — Manual penetration testing confirms RLS effectiveness
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Test isolation:** Ensure tests don't interfere with each other's tenant contexts
- **Database cleanup:** Implement proper cleanup to maintain test data integrity
- **Error handling:** RLS violations filter results rather than throwing errors
- **Performance:** Ensure RLS testing doesn't impact overall test performance
- **Authentication tokens:** Handle token expiration and refresh in test scenarios

---

## Out of Scope

- Application-level security testing (handled by middleware and Server Action tests)
- Performance benchmarking of RLS queries (handled in separate task)
- Database migration testing (handled in separate task)
- Integration testing with authentication flow (handled in separate task)

---

## References

- [Section 4.5 RLS Isolation Test Suite](docs/plan/domain-4/4.5-rls-isolation-test-suite.md)
- [Section 4.4 Complete Supabase RLS Implementation](docs/plan/domain-4/4.4-complete-supabase-rls-implementation.md)
- [Playwright Documentation](https://playwright.dev/)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Testing Guide](https://owasp.org/www-project-web-application-security-testing-guide/)
