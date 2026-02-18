# 1.7 Create @repo/marketing-components Package Scaffold

## Metadata

- **Task ID**: 1-7-create-repo-marketing-components-package-scaffold
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

No target package for 2.1–2.10. Create package scaffold, no runtime logic.

## Dependencies

- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **2026-02-18** Monorepo structure with pnpm workspaces for package management - [pnpm Workspaces](https://pnpm.io/workspaces)
- **2026-02-18** Atomic design principles for component organization - [Atomic Design](https://atomicdesign.bradfrost.com/)
- **2026-02-18** TypeScript configuration for monorepo packages - [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- **2026-02-18** Package dependency management with workspace protocol - [pnpm Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol)

## Related Files

- `packages/marketing-components/package.json` – **IMPLEMENTED** – Package with workspace dependencies
- `packages/marketing-components/tsconfig.json` – **IMPLEMENTED** – TypeScript configuration
- `packages/marketing-components/src/index.ts` – **IMPLEMENTED** – Barrel export file
- `pnpm-workspace.yaml` – **VERIFIED** – Workspace configuration includes marketing-components

## Code Snippets / Examples

```typescript
// Package configuration (implemented)
{
  "name": "@repo/marketing-components",
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "@repo/types": "workspace:*"
  },
  "exports": { ".": "./src/index.ts"
  }
}

// Index.ts barrel export
export * from './hero';
export * from './pricing';
export * from './testimonials';
// Additional marketing component families
```

## Acceptance Criteria

- [x] package.json (deps: @repo/ui, @repo/utils, @repo/types) configured
- [x] TypeScript configuration with workspace references
- [x] src/index.ts barrel export structure
- [x] Package builds successfully
- [x] 2.1 (Hero components) can add components to package
- [x] Workspace dependency resolution functional

## Technical Constraints

- No components
- no Storybook
- scaffold only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [x] Create package.json with workspace dependencies
- [x] Configure TypeScript with extends: @repo/typescript-config
- [x] Create src/index.ts barrel export structure
- [x] Verify workspace dependency resolution
- [x] Test build process across workspace

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

- [x] Code reviewed and approved (follows monorepo patterns)
- [x] Package builds successfully across workspace
- [x] Documentation updated (package structure, usage examples)
- [x] Workspace dependency resolution verified
- [x] TypeScript configuration working
- [x] Ready for marketing component development (2.1+ tasks)
