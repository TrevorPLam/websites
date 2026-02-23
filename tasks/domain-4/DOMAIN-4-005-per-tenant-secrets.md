---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-005
title: 'Per-tenant secrets management with encryption'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-005-per-tenant-secrets
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-005 · Per-tenant secrets management with encryption

## Objective

Implement per-tenant secrets management system following section 4.6 specification with pgcrypto encryption, master key management, rotation capabilities, and audit logging for secure storage of API keys and sensitive configuration.

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

**Codebase area:** `packages/auth/src/secrets-manager.ts` — Per-tenant secrets management

**Related files:** Database schema, authentication system, audit logging, encryption utilities

**Dependencies:** Supabase database, pgcrypto extension, existing security infrastructure

**Prior work:** Basic secrets management may exist but lacks comprehensive encryption and tenant isolation

**Constraints:** Must use pgcrypto for encryption and implement proper key management following 2026 security standards

---

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Encryption | PostgreSQL pgcrypto with AES-256-CBC              |
| Database   | Supabase with encrypted secrets table             |
| Security   | Master key management with rotation               |
| Audit      | Comprehensive audit logging for secret operations |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement per-tenant secrets management following section 4.6 specification
- [ ] **[Agent]** Add pgcrypto encryption with master key from environment
- [ ] **[Agent]** Create tenant_secrets table with encrypted storage
- [ ] **[Agent]** Implement setTenantSecret and getTenantSecret functions
- [ ] **[Agent]** Add secret rotation capability with audit logging
- [ ] **[Agent]** Create SQL functions for encryption/decryption operations
- [ ] **[Agent]** Add comprehensive error handling and validation
- [ ] **[Agent]** Test secret encryption/decryption with various scenarios
- [ ] **[Human]** Verify secrets are properly encrypted and isolated per tenant

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 4.6 specification** — Extract all requirements for secrets management
- [ ] **[Agent]** **Create database schema** — Add tenant_secrets table with encryption columns
- [ ] **[Agent]** **Implement SQL functions** — Add upsert_tenant_secret and get_tenant_secret functions
- [ ] **[Agent]** **Create secrets manager** — Implement TypeScript wrapper functions
- [ ] **[Agent]** **Add encryption utilities** — Implement pgcrypto integration with master key
- [ ] **[Agent]** **Add rotation capability** — Implement secret rotation with audit logging
- [ ] **[Agent]** **Add error handling** — Sanitize errors and prevent information leakage
- [ ] **[Agent]** **Create test suite** — Test encryption, decryption, and rotation scenarios
- [ ] **[Agent]** **Update documentation** — Document secrets management usage patterns

> ⚠️ **Agent Question**: Ask human before proceeding if any existing secrets need migration to new encrypted format.

---

## Commands

```bash
# Test secrets manager
pnpm test --filter="@repo/auth"

# Test secret encryption
node -e "
import { setTenantSecret, getTenantSecret } from '@repo/auth/secrets-manager';
await setTenantSecret('tenant-123', 'api-key', 'secret-value');
const value = await getTenantSecret('tenant-123', 'api-key');
console.log('Secret value:', value);
"

# Test secret rotation
node -e "
import { rotateTenantSecret } from '@repo/auth/secrets-manager';
await rotateTenantSecret('tenant-123', 'api-key', 'new-secret-value');
"

# Verify database encryption
psql $DATABASE_URL -c "SELECT encrypted_value FROM tenant_secrets WHERE tenant_id = 'tenant-123';"
```

---

## Code Style

```typescript
// ✅ Correct — Per-tenant secrets management following section 4.6
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Per-tenant secrets are encrypted with pgcrypto in Postgres.
// The master encryption key lives in environment variables (never in code).
// Rotation: see docs/runbooks/rotate-secrets.md
// ============================================================================

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function setTenantSecret(
  tenantId: string,
  keyName: string,
  value: string
): Promise<void> {
  // Encrypt with pgcrypto symmetric encryption using master key from env
  const masterKey = process.env.TENANT_SECRETS_MASTER_KEY!;

  const { error } = await adminClient.rpc('upsert_tenant_secret', {
    p_tenant_id: tenantId,
    p_key_name: keyName,
    p_plain_value: value,
    p_master_key: masterKey,
  });

  if (error) throw error;
}

export async function getTenantSecret(tenantId: string, keyName: string): Promise<string | null> {
  const masterKey = process.env.TENANT_SECRETS_MASTER_KEY!;

  const { data, error } = await adminClient.rpc('get_tenant_secret', {
    p_tenant_id: tenantId,
    p_key_name: keyName,
    p_master_key: masterKey,
  });

  if (error) return null;
  return data as string | null;
}

export async function rotateTenantSecret(
  tenantId: string,
  keyName: string,
  newValue: string
): Promise<void> {
  await setTenantSecret(tenantId, keyName, newValue);

  // Record rotation in audit log
  await adminClient.from('audit_logs').insert({
    tenant_id: tenantId,
    action: 'secret.rotated',
    table_name: 'tenant_secrets',
    new_data: { key_name: keyName, rotated_at: new Date().toISOString() },
  });
}
```

**SQL functions for encrypted storage:**

```sql
-- Upsert encrypted tenant secret (pgcrypto)
CREATE OR REPLACE FUNCTION upsert_tenant_secret(
  p_tenant_id UUID,
  p_key_name TEXT,
  p_plain_value TEXT,
  p_master_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO tenant_secrets (tenant_id, key_name, encrypted_value, rotated_at)
  VALUES (
    p_tenant_id,
    p_key_name,
    encode(encrypt(p_plain_value::bytea, p_master_key::bytea, 'aes-cbc'), 'base64'),
    now()
  )
  ON CONFLICT (tenant_id, key_name)
  DO UPDATE SET
    encrypted_value = encode(encrypt(p_plain_value::bytea, p_master_key::bytea, 'aes-cbc'), 'base64'),
    rotated_at = now();
END;
$$;

-- Decrypt tenant secret
CREATE OR REPLACE FUNCTION get_tenant_secret(
  p_tenant_id UUID,
  p_key_name TEXT,
  p_master_key TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encrypted_value TEXT;
BEGIN
  SELECT encrypted_value INTO encrypted_value
  FROM tenant_secrets
  WHERE tenant_id = p_tenant_id AND key_name = p_key_name;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN convert_from(decode(decode(encrypted_value, 'base64'), p_master_key::bytea, 'aes-cbc'), 'utf8');
END;
$$;
```

**Secrets management principles:**

- Always encrypt secrets at rest using pgcrypto AES-256-CBC
- Master key lives only in environment variables, never in code
- Each tenant has isolated encrypted storage
- All secret operations are logged for audit trail
- Rotation capability ensures keys can be updated without downtime

---

## Boundaries

| Tier             | Scope                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 4.6 specification; use pgcrypto encryption; implement master key management; add audit logging; maintain tenant isolation |
| ⚠️ **Ask first** | Changing encryption algorithms; modifying master key management; updating database schema; migrating existing secrets                    |
| 🚫 **Never**     | Store secrets in plain text; expose master keys in code; skip audit logging; bypass tenant isolation                                     |

---

## Success Verification

- [ ] **[Agent]** Test secret encryption — Secrets are properly encrypted and stored
- [ ] **[Agent]** Test secret decryption — Decrypted values match original input
- [ ] **[Agent]** Verify tenant isolation — Secrets are isolated per tenant
- [ ] **[Agent]** Test secret rotation — Rotation works and is properly logged
- [ ] **[Agent]** Verify audit logging — All secret operations are logged
- [ ] **[Agent]** Test error handling — Errors are sanitized and don't expose sensitive data
- [ ] **[Human]** Test with real secrets — API keys and configuration values
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Master key management:** Ensure master key is properly secured and rotated
- **Database connectivity:** Handle database connection errors gracefully
- **Encryption performance:** Monitor encryption/decryption performance impact
- **Key rotation:** Ensure rotation doesn't break existing functionality
- **Audit logging:** Ensure audit logs don't contain sensitive information

---

## Out of Scope

- Application-level secret management (handled by Server Actions)
- Database-level security policies (handled by RLS in separate task)
- Post-quantum cryptography (handled in separate task)
- Rate limiting and request validation (handled in middleware)

---

## References

- [Section 4.6 Per-Tenant Secrets Management](docs/plan/domain-4/4.6-per-tenant-secrets-management.md)
- [Section 4.1 Philosophy](docs/plan/domain-4/4.1-philosophy.md)
- [PostgreSQL pgcrypto Documentation](https://www.postgresql.org/docs/current/pgcrypto.html)
- [Supabase Security Documentation](https://supabase.com/docs/guides/security)
- [NIST Cryptographic Standards](https://csrc.nist.gov/publications/fips/)
