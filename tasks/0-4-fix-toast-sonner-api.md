# 0.4 Fix Toast.tsx Sonner API Compatibility

## Metadata

- **Task ID**: 0-4-fix-toast-sonner-api
- **Owner**: AGENT
- **Priority / Severity**: P0 (blocking CI/build)
- **Target Release**: TBD
- **Related Epics / ADRs**: CI quality gates
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Build pipeline

## Context

When @repo/features or @repo/marketing-components builds, it type-checks @repo/ui. Toast.tsx has two Sonner API mismatches: (1) `toast.custom(jsx, options)` passes `(id) => ReactNode` but Sonner expects `(id) => ReactElement`; (2) `sonnerToast.promise(promise, messages, options)` called with 3 args; API may expect 1–2. Full build fails until resolved.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Build pipeline, all packages that depend on @repo/ui

## Related Files

- `packages/ui/src/components/Toast.tsx` – modify – Fix Sonner API usage

## Acceptance Criteria

- [ ] `toast.custom` receives correct callback signature (returns ReactElement)
- [ ] `toast.promise` uses correct argument count/signature per Sonner docs
- [ ] `pnpm --filter @repo/ui type-check` passes
- [ ] Full monorepo build passes

## Technical Constraints

- Preserve existing Toast API for consumers
- Sonner peer dependency version must be respected

## Implementation Plan

- [ ] Audit Sonner current API (toast.custom, toast.promise)
- [ ] Fix type assertions or callback signatures
- [ ] Verify build and tests pass

## Testing Requirements

- Run `pnpm type-check`, `pnpm build`, `pnpm test` to verify

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
