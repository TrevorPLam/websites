# 2.34 Create Authentication Feature

## Metadata

- **Task ID**: 2-34-create-authentication-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Authentication feature with 5+ implementation patterns, OAuth, and SSO support.

**Implementation Patterns:** Config-Based, OAuth-Based, SSO-Based, JWT-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), OAuth, SSO

## Related Files

- `packages/features/src/authentication/index` – create – (see task objective)
- `packages/features/src/authentication/lib/schema` – create – (see task objective)
- `packages/features/src/authentication/lib/adapters` – create – (see task objective)
- `packages/features/src/authentication/lib/auth-config.ts` – create – (see task objective)
- `packages/features/src/authentication/lib/oauth.ts` – create – (see task objective)
- `packages/features/src/authentication/lib/sso.ts` – create – (see task objective)
- `packages/features/src/authentication/lib/jwt.ts` – create – (see task objective)
- `packages/features/src/authentication/components/AuthSection.tsx` – create – (see task objective)
- `packages/features/src/authentication/components/AuthConfig.tsx` – create – (see task objective)
- `packages/features/src/authentication/components/AuthOAuth.tsx` – create – (see task objective)
- `packages/features/src/authentication/components/AuthSSO.tsx` – create – (see task objective)
- `packages/features/src/authentication/components/AuthJWT.tsx` – create – (see task objective)
- `packages/features/src/authentication/components/AuthHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `AuthSection`, `authSchema`, `createAuthConfig`, `login`, `logout`, `register`, `oauthLogin`, `ssoLogin`, `AuthConfig`, `AuthOAuth`, `AuthSSO`, `AuthJWT`, `AuthHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; OAuth; SSO; JWT; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] OAuth functional
- [ ] SSO works
- [ ] JWT works.

## Technical Constraints

- No custom auth system
- use existing providers.

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

