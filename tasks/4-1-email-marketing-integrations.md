# 4.1 Email Marketing Integrations

## Metadata

- **Task ID**: 4-1-email-marketing-integrations
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

EmailAdapter interface. Mailchimp, SendGrid, ConvertKit. Retry(3) + timeout(10s). OAuth 2.1 PKCE optional.

## Dependencies

- **Package**: @repo/integrations – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/integrations/email/contract.ts` – modify – (see task objective)
- `mailchimp.ts` – modify – (see task objective)
- `sendgrid.ts` – modify – (see task objective)
- `convertkit.ts` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `EmailAdapter { subscribe, health }`, `createMailchimpAdapter`, etc.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] 4.1a contract; 4.1b–d providers; export; tests.
- [ ] Adapters implement interface
- [ ] subscribe works.

## Technical Constraints

- No double opt-in
- stop at 3 providers.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] 4.1a contract; 4.1b–d providers; export; tests.

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

