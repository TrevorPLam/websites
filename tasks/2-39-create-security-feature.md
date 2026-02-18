# 2.39 Create Security Feature

## Metadata

- **Task ID**: 2-39-create-security-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, C.13
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Security feature with 5+ implementation patterns, CSP, and rate limiting.

**Implementation Patterns:** Config-Based, CSP-Based, Rate-Limiting-Based, WAF-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: C.13 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, C.13
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), §C.13 (Security), CSP, rate limiting

## Related Files

- `packages/features/src/security/index` – create – (see task objective)
- `packages/features/src/security/lib/schema` – create – (see task objective)
- `packages/features/src/security/lib/adapters` – create – (see task objective)
- `packages/features/src/security/lib/security-config.ts` – create – (see task objective)
- `packages/features/src/security/lib/csp.ts` – create – (see task objective)
- `packages/features/src/security/lib/rate-limiting.ts` – create – (see task objective)
- `packages/features/src/security/components/SecuritySection.tsx` – create – (see task objective)
- `packages/features/src/security/components/SecurityConfig.tsx` – create – (see task objective)
- `packages/features/src/security/components/SecurityCSP.tsx` – create – (see task objective)
- `packages/features/src/security/components/SecurityRateLimit.tsx` – create – (see task objective)
- `packages/features/src/security/components/SecurityWAF.tsx` – create – (see task objective)
- `packages/features/src/security/components/SecurityHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `SecuritySection`, `securitySchema`, `createSecurityConfig`, `enforceCSP`, `rateLimit`, `SecurityConfig`, `SecurityCSP`, `SecurityRateLimit`, `SecurityWAF`, `SecurityHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; CSP; rate limiting; WAF; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] CSP functional
- [ ] rate limiting works.

## Technical Constraints

- No custom security engine
- standard practices only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

