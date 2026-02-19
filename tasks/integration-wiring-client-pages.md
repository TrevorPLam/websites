# integration-wiring Wire Integrations into Client Pages

## Metadata

- **Task ID**: integration-wiring-client-pages
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 4.x integrations complete
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 4-2, 4-3, 4-4, 4-5
- **Downstream Tasks**: Client UX

## Context

Wire scheduling, chat, reviews, and maps integration adapters into client pages. Integrations exist (scheduling, chat, reviews, maps) but may not be surfaced in client UI. Add components or sections that use these adapters based on site.config integrations.

## Dependencies

- **Upstream Task**: 4-2, 4-3, 4-4, 4-5 – integrations complete

## Cross-Task Dependencies & Sequencing

- **Upstream**: 4-2, 4-3, 4-4, 4-5
- **Downstream**: Client UX

## Research

- **Primary topics**: [R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-scheduling-oauth-tcf), site.config integrations.
- **[2026-02] Config-driven**: site.config.integrations selects adapters; consent gate for chat/maps (TCF/cookie); no integration if not in config.
- **References**: [RESEARCH-INVENTORY.md – R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-scheduling-oauth-tcf), [CLAUDE.md](../CLAUDE.md).

## Related Files

- `packages/page-templates/` – modify – Sections use integrations
- `packages/features/` – modify – Booking, contact may use scheduling
- Client layout/pages – reference – Where to render chat, maps, reviews

## Acceptance Criteria

- [ ] Scheduling: booking form/page uses SchedulingAdapter from config
- [ ] Chat: chat widget loads when integrations.chat configured
- [ ] Reviews: testimonials or reviews section uses ReviewAdapter
- [ ] Maps: contact or location section uses MapsAdapter
- [ ] All gated by consent where required (chat, maps)
- [ ] Config-driven: no integration if not in site.config

## Technical Constraints

- Consent gates for chat, maps (TCF/cookie)
- Adapters selected by site.config.integrations

## Implementation Plan

- [ ] Audit which pages need which integrations
- [ ] Add integration usage to page-templates/features
- [ ] Add chat widget, maps embed to layout or sections
- [ ] Test with at least one client per integration

## Sample code / examples

- **Page/section**: Read site.config.integrations; render SchedulingAdapter on booking page, ReviewAdapter in testimonials, MapsAdapter in contact; mount chat widget when integrations.chat set. Gate chat/maps with consent check.

## Testing Requirements

- Manual or E2E: verify scheduling, chat, reviews, maps appear when configured

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Integrations wired
- [ ] Build passes
