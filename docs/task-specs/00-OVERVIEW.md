# Normalized Task Specifications — Overview

This directory contains per-task specifications in the strict 15-section format.
Use these as the canonical implementation guide for AI agents and developers.

**Conventions:**
- **Optional Modes** applied per task type (UI primitive → Radix; marketing → variant; feature → adapter; template → registry)
- **Hard Constraints:** No cross-layer violations, no circular imports, no business logic in clients, everything typed, no dead exports

**Index:**
- [1.2–1.6] UI Primitives → `01-ui-primitives.md`
- [1.7, 2.1–2.10] Marketing Components → `02-marketing-components.md`
- [2.16–2.19] Feature Breadth → `03-feature-breadth.md`
- [3.1–3.8] Page Templates → `04-page-templates.md`
- [4.1–4.6] Integrations → `05-integrations.md`
- [5.1–5.6] Client Factory → `06-client-factory.md`
- [6.1–6.10] Cleanup, Docs, Scripts → `07-cleanup-scripts.md`
- [C.1–D.8] Governance → `08-governance.md`
