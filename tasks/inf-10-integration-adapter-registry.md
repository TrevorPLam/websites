# INF-10 Integration Adapter Registry

## Metadata

- **Task ID**: inf-10-integration-adapter-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 4-1 through 4-5
- **Downstream Tasks**: Custom integrations

## Context

Discovery of integrations by provider ID. Custom adapters register via package or config. Add integrations without code changes to central export.

## Dependencies

- **Upstream Task**: 4-1 through 4-5 – integrations exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 4-1..4-5
- **Downstream**: Custom integrations

## Research

- **Primary topics**: [R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-scheduling-oauth-tcf), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Adapter registry.
- **[2026-02] Adapter registry**: provider ID to adapter; discovery via package or config; site.config.integrations selects by ID.
- **References**: [RESEARCH-INVENTORY.md – R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-scheduling-oauth-tcf).

## Related Files

- `packages/integrations/*/` – modify – Registry pattern
- `packages/types/src/site-config.ts` – reference – integrations config
- New integration packages – create – Follow registry pattern

## Acceptance Criteria

- [ ] Integration adapter registry: provider ID → adapter
- [ ] New adapter package can register without editing central index
- [ ] Discovery: package exports, or explicit config registration
- [ ] site.config.integrations selects by provider ID
- [ ] Document how to add new integration

## Technical Constraints

- Adapter contract per integration type (scheduling, chat, etc.)
- Package naming: @repo/integrations-<provider>

## Implementation Plan

- [ ] Define adapter registry interface per type
- [ ] Implement discovery (exports, config)
- [ ] Update existing integrations to use registry
- [ ] Document
- [ ] Add tests

## Sample code / examples

- **Registry**: integrationRegistry.get(providerId) returns adapter; discovery from package exports or config; document @repo/integrations-<provider> pattern.

## Testing Requirements

- Unit tests for adapter resolution; build pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
