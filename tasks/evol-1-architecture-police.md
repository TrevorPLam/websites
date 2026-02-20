# EVOL-1 Architecture Police (ESLint Rules)

## Metadata

- **Task ID**: evol-1-architecture-police
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 1 (Week 1)
- **Related Epics / ADRs**: ROADMAP Phase 1, ADR-012 (integration types)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: evol-3, evol-4

## Context

Enforce architectural invariants via ESLint to catch drift and prepare for data contracts. Per ROADMAP Phase 1 Week 1: no deep imports, no cross-client imports, warn when integration types (e.g. HubSpotContact) leak into features.

## Dependencies

- None

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **[2026-02]** Repo uses ESLint 9 flat config (`eslint.config.mjs`), not `.eslintrc.*`. Implement as additional flat config extending `@repo/eslint-config`.

### Deep research (online)

- **ESLint 9 flat config (default since v9):** Single `eslint.config.js` with array of config objects; explicit imports; better performance. Each element can target `files`; later configs override earlier. Use shareable configs for complex rule sets; package-level configs allow per-package rules without centralizing everything at root. (ESLint v9 release, monorepo migration guides 2024–2025.)
- **Monorepo strategy:** Root config as default fallback; each package can have its own `eslint.config.mjs` for package-specific rules (e.g. features package warning on integration imports). Keeps dependencies with their configs.
- **no-restricted-imports:** Supports `paths` (specific modules) and `patterns` (gitignore-style globs). Use `patterns` with `group` + `message` for clear violations: `{ group: ['@repo/*/src/**'], message: '...' }`. Can combine `paths` and `patterns`; `allowTypeImports` permits type-only imports where needed. (ESLint no-restricted-imports docs.)
- **References**: [ROADMAP](../ROADMAP.md) § Organic Evolution, [boundaries.js](../packages/config/eslint-config/boundaries.js).

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
- [ ] Document in ROADMAP (if needed)
- [ ] Run `pnpm lint` to verify

## Sample code / examples

```javascript
// Option A: Extend in packages/features/eslint.config.mjs (features-only warn for integration types)
import config from '@repo/eslint-config';
export default [
  ...config,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: '@repo/integrations-hubspot',
              message: 'Use @repo/types canonical types (e.g. CanonicalLead). See ADR-012.',
            },
          ],
          patterns: [
            {
              group: ['@repo/integrations-*'],
              message: 'Use @repo/types canonical types. See ADR-012.',
            },
          ],
        },
      ],
    },
  },
];
```

```javascript
// Option B: Root or eslint-config architecture layer (all packages: deep path + cross-client)
// Align with boundaries.js patterns; can be merged into @repo/eslint-config/boundaries.js
export const architectureRules = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        { group: ['@repo/*/src/**'], message: 'Use package exports only' },
        { group: ['@repo/clients-*', '**/clients/*'], message: 'No cross-client imports' },
      ],
    },
  ],
};
```

## Testing Requirements

- Run `pnpm lint`; verify violations are caught; fix any false positives.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
