# Infrastructure-5: Contract Testing with Pact

## Metadata

- **Task ID**: infrastructure-5-contract-testing-pact
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Priority)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: API reliability, integration testing, contract validation
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None (can work in parallel with integration packages)
- **Downstream Tasks**: infrastructure-3-integration-resilience (complements retry logic)

## Context

API contracts between frontend and backend can break silently, causing production failures. Pact provides consumer-driven contract testing, ensuring frontend and backend teams share a common understanding of API contracts.

Current state: No contract testing. API changes can break integrations without detection.

This addresses **Research Topic: Contract Testing with Pact** from chatgpt.md and gemini1.md.

## Dependencies

- **Required Packages**: `@pact-foundation/pact`, `@pact-foundation/pact-node`
- **Integration Packages**: All `@repo/integrations-*` packages
- **Testing Framework**: Jest (already in use)

## Research

- **Primary topics**: [R-CONTRACT-TESTING](RESEARCH-INVENTORY.md#r-contract-testing) (new)
- **[2026-02] ChatGPT/Gemini Research**: Pact contract testing:
  - Consumer-driven contracts (frontend defines expected API behavior)
  - Prevents API breakage between frontend/backend teams
  - Validates request/response schemas
  - Runs in CI pipeline
- **Threat Model**: Breaking API changes, integration failures, production outages
- **References**: 
  - [docs/research/chatgpt-comprehensive-2026.md](../docs/research/chatgpt-comprehensive-2026.md) (Topic: API Integration Patterns)
  - [docs/research/gemini-strategic-architecture-2026.md](../docs/research/gemini-strategic-architecture-2026.md) (Topic: Testing)

## Related Files

- `packages/infra/src/testing/pact-setup.ts` – create – Pact test utilities
- `packages/integrations-hubspot/__tests__/pact/` – create – HubSpot contract tests
- `packages/integrations-calendly/__tests__/pact/` – create – Calendly contract tests
- `.github/workflows/ci.yml` – modify – Add Pact contract validation
- `docs/architecture/testing/contract-testing.md` – create – Document Pact usage

## Acceptance Criteria

- [ ] Pact installed and configured:
  - Test utilities for creating consumer contracts
  - CI integration for contract validation
- [ ] Contract tests for key integrations:
  - HubSpot CRM API contracts
  - Calendly webhook contracts
  - SendGrid email API contracts
- [ ] CI pipeline validates contracts:
  - Consumer tests run on PR
  - Provider verification (if backend available)
- [ ] Documentation created: `docs/architecture/testing/contract-testing.md`
- [ ] Example contracts for at least 3 integrations
- [ ] Contract versioning strategy documented

## Technical Constraints

- Requires mock provider setup for consumer tests
- Provider verification requires backend availability (may be optional)
- Contracts must be versioned and maintained

## Implementation Plan

### Phase 1: Setup
- [ ] Install Pact dependencies:
  ```bash
  pnpm add -D @pact-foundation/pact @pact-foundation/pact-node
  ```
- [ ] Create `packages/infra/src/testing/pact-setup.ts`:
  - Pact server setup utilities
  - Contract creation helpers
  - Test fixtures

### Phase 2: Contract Tests
- [ ] Create contract tests for HubSpot integration:
  - Contact creation contract
  - Contact search contract
- [ ] Create contract tests for Calendly integration:
  - Webhook event contract
  - Scheduled events query contract
- [ ] Create contract tests for SendGrid integration:
  - Email send contract
  - Template rendering contract

### Phase 3: CI Integration
- [ ] Add Pact validation to CI pipeline:
  - Run consumer tests on PR
  - Publish contracts to Pact Broker (if available)
  - Provider verification (optional, if backend available)

### Phase 4: Documentation
- [ ] Document Pact usage patterns
- [ ] Create guide for adding new contract tests
- [ ] Document contract versioning strategy

## Testing

- [ ] Unit tests for Pact setup utilities
- [ ] Contract tests verify API expectations
- [ ] CI tests: Verify contracts validate correctly
- [ ] Integration tests: Verify contracts match actual API behavior

## Notes

- Contract testing complements integration tests by catching API changes early
- Consumer-driven approach means frontend team defines expected behavior
- Contracts should be versioned and maintained alongside API changes
- Complements `infrastructure-3-integration-resilience` by ensuring API contracts are stable
