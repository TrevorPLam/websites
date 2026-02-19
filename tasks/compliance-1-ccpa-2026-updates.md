# Compliance-1: CCPA 2026 Updates

## Metadata

- **Task ID**: compliance-1-ccpa-2026-updates
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Priority)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Privacy compliance, data residency, CCPA 2026 regulations
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-4-consent-management
- **Downstream Tasks**: None

## Context

CCPA 2026 introduces significant updates:
1. Expanded lookback period (data requests must cover Jan 2022 onwards)
2. DROP (Delete Request and Opt-Out Platform) integration requirement
3. Enhanced rights for minors
4. Restrictions on precise geolocation data sales

Current state: CCPA compliance may not cover expanded lookback or DROP integration.

This addresses **Research Topic: CCPA 2026 Compliance** from gemini2.md.

## Dependencies

- **Upstream Task**: `security-4-consent-management` — consent management must be in place
- **Required Packages**: DROP API integration, data deletion utilities
- **Database**: Must support data retrieval/deletion across expanded timeline

## Research

- **Primary topics**: [R-CCPA-2026](RESEARCH-INVENTORY.md#r-ccpa-2026) (new)
- **[2026-02] Gemini Research**: CCPA 2026 requirements:
  - Expanded lookback: Data requests must cover Jan 2022 onwards
  - DROP integration: Check platform every 45 days for deletion requests
  - Enhanced minor rights: Auto-classify <16 data as sensitive PII
  - Geolocation restrictions: Ban on sales of precise geolocation (<1,750 feet)
- **Threat Model**: Legal liability, fines, loss of customer trust
- **References**: 
  - [docs/research/gemini-production-audit-2026.md](../docs/research/gemini-production-audit-2026.md) (Topic: Compliance)

## Related Files

- `packages/infra/src/compliance/drop-integration.ts` – create – DROP API client
- `packages/infra/src/compliance/data-deletion.ts` – create – Data deletion utilities
- `packages/infra/src/compliance/ccpa-2026.ts` – create – CCPA 2026 compliance helpers
- `.github/workflows/compliance-drop.yml` – create – Scheduled DROP check workflow
- `docs/compliance/ccpa-2026.md` – create – CCPA 2026 compliance guide

## Acceptance Criteria

- [ ] DROP integration implemented:
  - API client for DROP platform
  - Scheduled check every 45 days (GitHub Actions workflow)
  - Automatic processing of deletion requests
- [ ] Expanded lookback support:
  - Data retrieval covers Jan 2022 onwards
  - Data deletion covers expanded timeline
- [ ] Minor data handling:
  - Auto-classify <16 data as sensitive PII
  - Enhanced consent requirements for minors
- [ ] Geolocation restrictions:
  - No sales of precise geolocation data
  - Compliance checks for geolocation data usage
- [ ] Documentation created: `docs/compliance/ccpa-2026.md`
- [ ] Compliance tests verify requirements
- [ ] Audit logs for data deletion requests

## Technical Constraints

- Must integrate with existing data storage (Supabase)
- DROP API may have rate limits
- Data deletion must be comprehensive (all systems, backups)

## Implementation Plan

### Phase 1: DROP Integration
- [ ] Research DROP API documentation
- [ ] Create `packages/infra/src/compliance/drop-integration.ts`:
  - DROP API client
  - Deletion request processing
- [ ] Create scheduled workflow: `.github/workflows/compliance-drop.yml`

### Phase 2: Data Deletion
- [ ] Create `packages/infra/src/compliance/data-deletion.ts`:
  - Expanded lookback data retrieval (Jan 2022+)
  - Comprehensive data deletion (all systems)
  - Audit logging

### Phase 3: Minor Data Handling
- [ ] Implement age classification:
  - Auto-detect <16 users
  - Enhanced PII classification
  - Stricter consent requirements

### Phase 4: Documentation & Testing
- [ ] Document CCPA 2026 compliance requirements
- [ ] Create compliance test suite
- [ ] Document data deletion procedures

## Testing

- [ ] Unit tests for DROP integration
- [ ] Integration tests: Verify data deletion covers expanded timeline
- [ ] Compliance tests: Verify minor data handling
- [ ] E2E tests: Verify DROP request processing

## Notes

- CCPA 2026 compliance is legally required — high priority
- DROP integration must run on schedule (every 45 days)
- Data deletion must be comprehensive and auditable
- Complements `security-4-consent-management` by adding deletion request handling
- May require coordination with legal/compliance team
