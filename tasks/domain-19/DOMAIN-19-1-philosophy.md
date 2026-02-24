---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-19-1-philosophy
title: '19.1 Philosophy'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-19-1-philosophy
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-19-1 · 19.1 Philosophy

## Objective

Define the philosophical foundation and architectural principles for Cal.com Integration domain, establishing the "why" behind implementation decisions and providing context for future development.

---

## Context

**Documentation Reference:**

- Relevant guide docs: scheduling/\*
- Architecture patterns: Scheduling widget patterns
- Standards compliance: 2026 Web Standards, WCAG 2.2, OAuth 2.1

**Current Status:** Philosophy and architectural principles need definition

**Codebase area:** Cal.com Integration domain foundation

**Related files:** Domain-specific implementation files

**Dependencies:** Domain analysis, architectural decisions

**Prior work**: Basic domain structure exists

**Constraints:** Must align with overall monorepo philosophy and 2026 standards

---

## Tech Stack

- **Documentation**: Markdown with YAML frontmatter
- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **Standards**: 2026 compliance (WCAG 2.2, OAuth 2.1, Core Web Vitals)

---

## Implementation Tasks

### 1. Define Domain Philosophy

- [x] Establish core principles and values
- [x] Define architectural approach
- [x] Document decision-making framework

### 2. Architectural Guidelines

- [x] Define layer responsibilities
- [x] Establish interaction patterns
- [x] Document integration approaches

### 3. Standards Compliance

- [x] Ensure 2026 standards alignment
- [x] Define security principles
- [x] Document performance requirements

### 4. Future Considerations

- [x] Define extensibility principles
- [x] Document scalability considerations
- [x] Establish maintenance guidelines

---

## Philosophy Statement

### Core Principles

**1. Separation of Concerns**

- Cal.com owns the scheduling infrastructure (event types, availability, calendar sync)
- Our platform owns booking records for CRM integration, lead scoring, and GDPR compliance
- Clear contract: site sends booking to Cal.com → Cal.com sends webhook confirmation

**2. API Modernization**

- Cal.com API v1 deprecated February 15, 2026
- All integrations must use API v2 (`https://api.cal.com/v2`)
- OAuth-based access tokens (`cal_` prefixed) or managed user tokens only

**3. Dual Architecture Modes**

- **Embedded Widget**: Client website visitors book directly via Cal.com embed JS
- **Managed Bookings**: Agency-managed clients provisioned via Managed User API

### Architectural Approach

**Multi-Tenant Isolation**

- Per-tenant Cal.com configurations via secrets manager
- Tenant ID routing through webhook URLs and metadata
- Row-level security for booking data

**Event-Driven Integration**

- Webhook-first approach for real-time booking updates
- Idempotent event processing with duplicate prevention
- Automated lead scoring and CRM integration

**Security-First Design**

- HMAC signature verification for all webhooks
- OAuth 2.1 compliance for API access
- Per-tenant secret management with encryption

---

## Success Criteria

- [x] Philosophy document complete and clear
- [x] Architectural principles defined
- [x] Standards compliance documented
- [x] Future considerations addressed

---

## Verification Steps

1. **Review Philosophy**: Verify clarity and completeness
2. **Architecture Validation**: Ensure FSD compliance
3. **Standards Check**: Validate 2026 standards alignment
4. **Future Planning**: Confirm extensibility considerations

---

## Rollback Plan

If philosophy needs revision:

1. Update based on feedback
2. Re-validate architectural alignment
3. Update dependent documentation
4. Communicate changes to team

---

## References

- Feature-Sliced Design: https://feature-sliced.design/
- 2026 Web Standards: https://www.w3.org/standards/
- Monorepo Patterns: https://monorepo.tools/
- Cal.com API v2: https://cal.com/docs/api-reference/v2/
- Cal.com Webhooks: https://cal.com/docs/developing/guides/automation/webhooks

---

## Notes

This philosophy document serves as the foundation for all Cal.com Integration domain implementations and should be referenced when making architectural decisions.

**Key Integration Contract:**

- Your platform sends Cal.com the booking
- Cal.com sends your webhook the confirmation
- Booking records remain in your database for GDPR/CRM
- Cal.com manages the actual appointment slots

**API Migration Timeline:**

- February 15, 2026: API v1 deprecated
- All new integrations must use API v2
- OAuth tokens required (no simple API keys)
