# Domain 4: SECURITY (Defense in Depth)

## Overview

This domain covers security (defense in depth) aspects of the marketing-first multi-client multi-site monorepo.

## Sections

- [4.1 Philosophy](4.1-philosophy.md)
- [4.2 Complete `middleware.ts`](4.2-complete-middlewarets.md)
- [4.3 `createServerAction()` Wrapper](4.3-createserveraction-wrapper.md)
- [4.4 Complete Supabase RLS Implementation](4.4-complete-supabase-rls-implementation.md)
- [4.5 RLS Isolation Test Suite](4.5-rls-isolation-test-suite.md)
- [4.6 Per-Tenant Secrets Management](4.6-per-tenant-secrets-management.md)
- [4.7 Post-Quantum Cryptography Abstraction](4.7-post-quantum-cryptography-abstraction.md)

## Priority

**P0 (Week 1)** — Foundation for entire platform.

## Dependencies

None - this is the foundational domain that all other domains depend on.

## Execution Status (DOMAIN-4-0XX)

- ✅ DOMAIN-4-001 — Complete middleware security layers
- ✅ DOMAIN-4-002 — `createServerAction()` security wrapper
- ✅ DOMAIN-4-003 — Supabase RLS implementation
- ✅ DOMAIN-4-004 — RLS isolation test suite
- ✅ DOMAIN-4-005 — Per-tenant secrets management
- ✅ DOMAIN-4-006 — Post-quantum cryptography abstraction

QA was executed for each parent task and a final QA sweep was run before completion.
