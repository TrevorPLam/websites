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

## Research

- **Primary topics**: [R-UI](RESEARCH-INVENTORY.md#r-ui-radix-ui-primitives-react-19-componentref) (Sonner, React 19).
- **[2026-02] Sonner 2.0.7** (repo catalog): `toast.custom(render, options)` — render must return `React.ReactElement`, not `ReactNode`; Sonner types may use `ReactElement` in typings. Ensure callback signature `(id: string | number) => React.ReactElement`.
- **[2026-02] toast.promise**: Sonner v2 uses `.promise(promise, data)` with a single `data` object (`loading`, `success`, `error` messages); confirm whether 2-arg or 3-arg form and align types.
- **References**: [RESEARCH-INVENTORY.md – R-UI](RESEARCH-INVENTORY.md#r-ui-radix-ui-primitives-react-19-componentref), Sonner npm/docs, [CLAUDE.md](CLAUDE.md) (Sonner 2.0.7).

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

## Sample code / examples

- **Correct custom signature** (packages/ui/src/components/Toast.tsx): Callback must return `React.ReactElement` so type matches Sonner.
  ```typescript
  custom: (jsx: (id: string | number) => React.ReactElement, options?: ToastOptions) =>
    sonnerToast.custom(jsx, options),
  ```
- **Promise API**: Use Sonner v2 form — e.g. `sonnerToast.promise(promise, { loading: '...', success: '...', error: '...' })`; ensure our wrapper does not pass a third options object if Sonner expects only two args. Check `node_modules/sonner` types for exact signature.

## Testing Requirements

- Run `pnpm type-check`, `pnpm build`, `pnpm test` to verify

## Execution notes

- **Related files — current state:** `packages/ui/src/components/Toast.tsx` — exists; wraps Sonner; `toast.custom` and `toast.promise` are the two call sites to fix.
- **Potential issues / considerations:** Sonner 2.0.7 typings use `ReactElement` for `custom`; third argument to `promise` may be unsupported — check `node_modules/sonner` types; preserve existing public `toast` API for consumers (e.g. BookingForm).
- **Verification:** `pnpm type-check`, `pnpm build`, `pnpm test`.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
