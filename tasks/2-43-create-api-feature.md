# 2.43 Create API Feature

## Metadata

- **Task ID**: 2-43-create-api-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11
- **Downstream Tasks**: (Tasks that consume this output)

## Context

API feature with 5+ implementation patterns supporting REST, GraphQL, and tRPC.

**Implementation Patterns:** Config-Based, REST-Based, GraphQL-Based, tRPC-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), REST, GraphQL, tRPC

## Related Files

- `packages/features/src/api/index` – create – (see task objective)
- `packages/features/src/api/lib/schema` – create – (see task objective)
- `packages/features/src/api/lib/adapters` – create – (see task objective)
- `packages/features/src/api/lib/api-config.ts` – create – (see task objective)
- `packages/features/src/api/lib/rest.ts` – create – (see task objective)
- `packages/features/src/api/lib/graphql.ts` – create – (see task objective)
- `packages/features/src/api/lib/trpc.ts` – create – (see task objective)
- `packages/features/src/api/components/APISection.tsx` – create – (see task objective)
- `packages/features/src/api/components/APIConfig.tsx` – create – (see task objective)
- `packages/features/src/api/components/APIREST.tsx` – create – (see task objective)
- `packages/features/src/api/components/APIGraphQL.tsx` – create – (see task objective)
- `packages/features/src/api/components/APItRPC.tsx` – create – (see task objective)
- `packages/features/src/api/components/APIHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `APISection`, `apiSchema`, `createAPIConfig`, `createRESTEndpoint`, `createGraphQLEndpoint`, `createTRPCEndpoint`, `APIConfig`, `APIREST`, `APIGraphQL`, `APItRPC`, `APIHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; REST; GraphQL; tRPC; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] REST functional
- [ ] GraphQL works
- [ ] tRPC works.

## Technical Constraints

- No custom API framework
- use existing libraries.

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

