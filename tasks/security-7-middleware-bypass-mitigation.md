# Security-7: Middleware Bypass Mitigation (CVE-2025-29927)

## Metadata

- **Task ID**: security-7-middleware-bypass-mitigation
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Authentication security, middleware hardening, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-1-server-action-hardening
- **Downstream Tasks**: None

## Context

CVE-2025-29927 allows attackers to bypass Next.js middleware by manipulating `x-middleware-subrequest` headers. This vulnerability means authentication/authorization checks in middleware can be circumvented, requiring defense-in-depth at the Data Access Layer (DAL).

Current state: Authentication relies on middleware checks. No defense-in-depth verification at DAL level.

This addresses **Research Topic: Middleware Bypass Mitigation** from gemini2.md.

## Dependencies

- **Upstream Task**: `security-1-server-action-hardening` — DAL verification patterns
- **Required Packages**: `@repo/infra`, Next.js 16.1.5
- **Next.js Version**: Requires Next.js 16+ (proxy.ts pattern)

## Research

- **Primary topics**: [R-MIDDLEWARE-BYPASS](RESEARCH-INVENTORY.md#r-middleware-bypass) (new)
- **[2026-02] Gemini Research**: CVE-2025-29927 mitigation requires:
  - Multi-layered authentication (Edge Middleware + DAL verification)
  - Never rely solely on middleware for security
  - Verify authentication at every data access point
- **Threat Model**: Bypassed middleware allows unauthorized access to protected routes and Server Actions
- **References**: 
  - [docs/research/gemini-production-audit-2026.md](../docs/research/gemini-production-audit-2026.md) (Topic: Security Hardening)

## Related Files

- `packages/infra/src/security/middleware-bypass.ts` – create – Middleware bypass detection
- `packages/infra/src/security/secure-action.ts` – modify – Add middleware bypass checks
- `packages/infra/src/dal/context.ts` – create – DAL authentication context
- `middleware.ts` or `proxy.ts` – modify – Add bypass detection headers
- `docs/architecture/security/middleware-bypass.md` – create – Document mitigation strategy

## Acceptance Criteria

- [ ] Middleware bypass detection implemented:
  - Detect `x-middleware-subrequest` header manipulation
  - Log security events for bypass attempts
- [ ] DAL-level authentication verification:
  - Every DAL function verifies user session independently
  - No reliance on middleware auth state alone
- [ ] `secureAction` wrapper includes bypass checks:
  - Verifies authentication even if middleware was bypassed
  - Rejects requests with suspicious headers
- [ ] Documentation created: `docs/architecture/security/middleware-bypass.md`
- [ ] Security tests verify bypass attempts are blocked
- [ ] Monitoring alerts for bypass attempts

## Technical Constraints

- Must work with Next.js 16 proxy.ts pattern
- Must not break existing authentication flows
- Performance impact must be minimal (DAL checks should be fast)

## Implementation Plan

### Phase 1: Detection
- [ ] Create `packages/infra/src/security/middleware-bypass.ts`:
  - Detect `x-middleware-subrequest` header
  - Validate middleware execution state
  - Log security events

### Phase 2: DAL Verification
- [ ] Create `packages/infra/src/dal/context.ts`:
  - Independent session verification
  - JWT validation at DAL level
  - Tenant context extraction

### Phase 3: Integration
- [ ] Integrate bypass detection into `secureAction` wrapper
- [ ] Update middleware/proxy.ts to set verification headers
- [ ] Add DAL verification to all data access functions

### Phase 4: Testing & Monitoring
- [ ] Security tests simulate bypass attempts
- [ ] Verify legitimate requests still work
- [ ] Set up monitoring alerts for bypass attempts

## Testing

- [ ] Unit tests for bypass detection logic
- [ ] Integration tests: Simulate bypass attempt (should be blocked)
- [ ] E2E tests: Verify legitimate authentication still works
- [ ] Performance tests: Verify minimal latency impact

## Notes

- Critical security fix — should be prioritized in Wave 1
- Complements `security-1-server-action-hardening` by adding defense-in-depth
- Requires coordination with middleware/proxy.ts changes
- Monitor Next.js releases for official CVE-2025-29927 patches
