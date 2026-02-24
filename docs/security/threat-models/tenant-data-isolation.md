# Threat Model — Tenant Data Isolation

- **Last reviewed:** 2026-02-24
- **Review cadence:** Annual
- **Owner:** Platform Architecture

## Boundary

Tenant-scoped reads/writes, cache keys, and background job processing.

## Key threats

| STRIDE          | Threat                            | Risk   | Mitigations                                         |
| --------------- | --------------------------------- | ------ | --------------------------------------------------- |
| Spoofing        | Forged tenant identifiers         | High   | Server-side tenant resolution, auth-context binding |
| Tampering       | Cross-tenant record mutation      | High   | RLS policies, tenant filters in all writes          |
| Repudiation     | No trace of cross-tenant attempts | Medium | Structured audit and error logs                     |
| Info Disclosure | Cache key collisions              | High   | Tenant prefix in all cache namespaces               |
| DoS             | Noisy-neighbor workload spikes    | Medium | Per-tenant quotas and rate limits                   |
| EoP             | Admin impersonation misuse        | High   | Explicit impersonation controls and audit logging   |

## Residual risks

- Expand integration tests for cross-package tenant isolation behavior.
