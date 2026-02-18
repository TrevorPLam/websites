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

### Primary Research Topics

- **[2026-02-18] R-INTEGRATION**: Scheduling, OAuth, TCF — see [RESEARCH-INVENTORY.md](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH-INVENTORY.md#r-integration) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-INTEGRATION](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH-INVENTORY.md#r-integration) — Full research findings
- [RESEARCH.md](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH.md) — Additional context

## Related Files

- `packages/integrations/email/contract.ts` – modify – EmailAdapter interface
- `packages/integrations/mailchimp/src/index.ts` – create – Mailchimp implementation
- `packages/integrations/sendgrid/src/index.ts` – create – SendGrid implementation
- `packages/integrations/convertkit/src/index.ts` – create – ConvertKit implementation
- `packages/integrations/email/index.ts` – create – Central export
- `packages/integrations/email/__tests__/adapters.test.ts` – create – Unit tests

## Acceptance Criteria

- [x] 4.1a contract; 4.1b–d providers; export; tests.
- [x] Adapters implement interface
- [x] subscribe works.

## Technical Constraints

- No double opt-in
- stop at 3 providers.

## Implementation Plan

- [x] 4.1a contract; 4.1b–d providers; export.
- [x] 4.1e tests.

## Definition of Done

- [x] Code reviewed and approved
- [x] All tests passing
- [x] Documentation updated
- [x] Build passes
