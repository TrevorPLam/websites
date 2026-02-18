# 0.2 Fix Toast / Sonner API (Blocking CI)

## Metadata

- **Task ID**: 0-2-fix-toast-sonner-api
- **Owner**: AGENT
- **Priority / Severity**: P0 (blocking CI/build per ISSUES.md)
- **Target Release**: TBD
- **Related**: [ISSUES.md](../ISSUES.md) § CRITICAL #1
- **Upstream Tasks**: None
- **Downstream Tasks**: Unblocks full monorepo build

## Context

[ISSUES.md](../ISSUES.md): `packages/ui/src/components/Toast.tsx` causes TypeScript errors when @repo/features or @repo/marketing-components builds. Sonner API expectations have changed; current usage is incompatible.

## Research & Evidence (Date-Stamped)

- **[2026-02-18] ISSUES.md**: Line 66 — `toast.custom(jsx, options)` passes `(id) => ReactNode` but Sonner expects `(id) => ReactElement`. Line 82 — `sonnerToast.promise(promise, messages, options)` called with 3 args; API may expect 1–2.
- **[2026-02-18] Sonner**: Check current Sonner (catalog: ^2.0.7) API for `custom` and `promise` signatures; align Toast.tsx types and call sites.

## Related Files

- `packages/ui/src/components/Toast.tsx` – modify – fix custom/promise usage and types
- `packages/ui/package.json` – verify sonner version

## Acceptance Criteria

- [ ] Toast.tsx type-checks; no ReactNode/ReactElement mismatch for custom().
- [ ] promise() called with correct arity per Sonner docs.
- [ ] `pnpm build` passes for @repo/ui and dependents.

## Definition of Done

- [ ] Build passes
- [ ] No new lint/type errors
