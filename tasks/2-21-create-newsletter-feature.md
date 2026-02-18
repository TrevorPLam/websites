# 2.21 Create Newsletter Feature

## Metadata

- **Task ID**: 2-21-create-newsletter-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 4.1
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Newsletter feature with 5+ implementation patterns, segmentation, and automation.

**Implementation Patterns:** Config-Based, API-Based, Email-Service-Based, CMS-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 4.1 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 4.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), §4.1 (Email integrations)

## Related Files

- `packages/features/src/newsletter/index` – create – (see task objective)
- `packages/features/src/newsletter/lib/schema` – create – (see task objective)
- `packages/features/src/newsletter/lib/adapters` – create – (see task objective)
- `packages/features/src/newsletter/lib/newsletter-config.ts` – create – (see task objective)
- `packages/features/src/newsletter/lib/segmentation.ts` – create – (see task objective)
- `packages/features/src/newsletter/lib/automation.ts` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterSection.tsx` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterConfig.tsx` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterAPI.tsx` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterEmail.tsx` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterCMS.tsx` – create – (see task objective)
- `packages/features/src/newsletter/components/NewsletterHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `NewsletterSection`, `newsletterSchema`, `createNewsletterConfig`, `subscribe`, `segmentSubscribers`, `automateCampaigns`, `NewsletterConfig`, `NewsletterAPI`, `NewsletterEmail`, `NewsletterCMS`, `NewsletterHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; segmentation; automation; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] segmentation functional
- [ ] automation works.

## Technical Constraints

- No custom email service
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

