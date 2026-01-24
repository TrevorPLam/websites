# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) that document significant architectural and technical decisions made for this project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams:

- **Remember** why decisions were made
- **Communicate** decisions to current and future team members
- **Learn** from past decisions
- **Ensure** AI agents understand the historical context

## When to Create an ADR

Create an ADR when:

- **Crossing module boundaries** (required by Principle 23 in `.repo/agents/QUICK_REFERENCE.md`)
- **Changing API contracts** or endpoints
- **Introducing new dependencies** or major libraries
- **Changing security architecture** or authentication flows
- **Making database schema changes** that affect multiple modules
- **Choosing between multiple technical approaches** with significant trade-offs
- **Changing deployment architecture** or infrastructure

## ADR Naming Convention

ADRs follow this naming pattern:

```
ADR-{number}-{short-title}.md
```

Examples:
- `ADR-001-use-nextjs-app-router.md`
- `ADR-002-implement-multi-tenancy.md`
- `ADR-003-choose-supabase-for-database.md`

## ADR Lifecycle

1. **Proposed** - ADR is written and under review
2. **Accepted** - Decision has been made and ADR is approved
3. **Superseded** - ADR has been replaced by a newer decision (link to new ADR)
4. **Deprecated** - Decision is no longer relevant

## How to Use the Template

1. Copy `ADR-000-template.md` to a new file with the next sequential number
2. Fill in all sections with relevant information
3. Include the ADR in your PR when making changes that require architectural decisions
4. Link to the ADR from your PR description

## Template Location

The ADR template is located at:
- **Markdown version**: `docs/adr/ADR-000-template.md` (use this for human-readable ADRs)
- **JSON version**: `.repo/templates/ADR_TEMPLATE.md` (used by automation scripts)

## Required for

Per `.repo/agents/QUICK_REFERENCE.md`:
- Cross-module imports (Principle 23)
- API contract changes
- Schema changes
- Changes that cross feature boundaries

## References

- [Architecture Decision Records (ADR) Guide](https://adr.github.io/)
- [Repository Quick Reference](./.repo/agents/QUICK_REFERENCE.md#-adr-workflow)
- [Boundary Policy](../.repo/policy/BOUNDARIES.md)

---

**Last Updated:** 2026-01-23  
**Maintained By:** Development Team
