# C.10 Add features/content (CMS Abstraction)

## Metadata

- **Task ID**: c-10-features-content
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.10], content source adapters
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Blog, static pages, D.3 editorial workflow

## Context

Add packages/features/src/content/ with content-provider.ts (unified content interface), workflow-state.ts for editorial lifecycle (D.3), and adapters: mdx-adapter, sanity-adapter, storyblok-adapter.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: D.3 (editorial workflow)
- **Downstream**: Blog, page content, INF-6 blocks

## Research

- **Primary topics**: [R-CMS](RESEARCH-INVENTORY.md#r-cms-content-adapters-mdx-pagination). THEGOAL [C.10].
- **[2026-02] Content adapters**: content-provider unified interface; workflow-state; MDX, Sanity, Storyblok adapters; site.config selects provider.
- **References**: [RESEARCH-INVENTORY.md – R-CMS](RESEARCH-INVENTORY.md#r-cms-content-adapters-mdx-pagination), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/features/src/content/content-provider.ts` – create
- `packages/features/src/content/workflow-state.ts` – create
- `packages/features/src/content/adapters/mdx-adapter.ts` – create
- `packages/features/src/content/adapters/sanity-adapter.ts` – create
- `packages/features/src/content/adapters/storyblok-adapter.ts` – create
- `packages/features/src/index.ts` – modify – Export content
- `docs/content/content-source-adapters.md` – reference

## Acceptance Criteria

- [ ] content-provider: unified interface for content retrieval
- [ ] workflow-state: editorial lifecycle types (draft, published, etc.)
- [ ] MDX adapter: Git-based MDX content
- [ ] Sanity adapter: Sanity CMS integration (optional stub)
- [ ] Storyblok adapter: Storyblok integration (optional stub)
- [ ] Export from @repo/features
- [ ] Document in docs/content/content-source-adapters.md

## Sample code / examples

- **content-provider.ts**: getContent(id), listContent(); adapters implement interface; site.config.content.provider selects adapter.

## Technical Constraints

- Adapter pattern; site.config selects provider
- Sanity/Storyblok can be stubs initially

## Implementation Plan

- [ ] Create content directory and adapters
- [ ] Implement content-provider, workflow-state
- [ ] Implement MDX adapter (primary)
- [ ] Add Sanity, Storyblok stubs or full adapters
- [ ] Add to features exports
- [ ] Document

## Testing Requirements

- Unit tests for content-provider and MDX adapter
- Run `pnpm test`, `pnpm type-check`

## Execution notes

- **Related files — current state:** features/content (CMS abstraction) — to be created or extended. R-CMS; content adapters, MDX, canonical URLs.
- **Potential issues / considerations:** Config-driven; adapter pattern for CMS backends; no breaking changes to current pages.
- **Verification:** Build passes; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Exported from features
- [ ] Build passes
