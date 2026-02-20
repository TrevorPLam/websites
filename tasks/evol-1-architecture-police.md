# EVOL-1 Architecture Police (ESLint Rules)

## Metadata

- **Task ID**: evol-1-architecture-police
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 1 (Week 1)
- **Related Epics / ADRs**: NEW.md Phase 1, ADR-012 (integration types)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: evol-3, evol-4

## Context

Enforce architectural invariants via ESLint to catch drift and prepare for data contracts. Per NEW.md Week 1: no deep imports, no cross-client imports, warn when integration types (e.g. HubSpotContact) leak into features.

## Dependencies

- None

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Repo uses ESLint 9 flat config (`eslint.config.mjs`), not `.eslintrc.*`. Implement as additional flat config extending `@repo/eslint-config`.
- **References**: NEW.md, [docs/architecture/evolution-roadmap.md](../docs/architecture/evolution-roadmap.md).

## Related Files

- `packages/config/eslint-config/` – modify or extend
- Root `eslint.config.mjs` or package-level – modify
- New: `eslint.config.architecture.mjs` or integrate into existing

## Acceptance Criteria

- [ ] Error: no imports from `@repo/*/src/**` (use package exports only)
- [ ] Error: no imports from `@repo/clients-*` or cross-client
- [ ] Warn: HubSpotContact (and similar) in features packages → "Use @repo/types canonical types. See ADR-012"
- [ ] Uses ESLint 9 flat config (not .eslintrc)
- [ ] `pnpm lint` passes with new rules

## Technical Constraints

- ESLint 9 flat config format
- Extend @repo/eslint-config
- ADR-012 referenced before it exists (create in Phase 2)

## Implementation Plan

- [ ] Create architecture rules (flat config)
- [ ] Wire into root or eslint-config package
- [ ] Add no-restricted-imports for deep paths and cross-client
- [ ] Add warn for integration types in features
- [ ] Document in evolution-roadmap
- [ ] Run `pnpm lint` to verify

## Sample code / examples

```javascript
// eslint.config.architecture.mjs (flat config)
import eslint from '@eslint/js';
import config from '@repo/eslint-config';
export default [
  ...config,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@repo/*/src/**'], message: 'Use package exports only' },
            { group: ['@repo/clients-*'], message: 'No cross-client imports' },
          ],
        },
      ],
    },
  },
];
```

## Testing Requirements

- Run `pnpm lint`; verify violations are caught; fix any false positives.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
