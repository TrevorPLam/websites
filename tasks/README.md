# Task Directory — Standard Structure and Conventions

**Last updated:** 2026-02  
**Purpose:** Canonical task format for near-perfect AI and human execution. All active tasks under `tasks/*.md` (excluding `archive/` and meta files) MUST follow this structure.

---

## Canonical section order

Use this exact order. Every required section must be present.

| Order | Section                                  | Required | Notes                                                                                                              |
| ----- | ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 1     | **Title (H1)**                           | Yes      | `# TaskID Short Title` — Task ID matches filename (e.g. `6-8a-turbo-gen-new-client`)                               |
| 2     | **Metadata**                             | Yes      | See Metadata fields below                                                                                          |
| 3     | **Context**                              | Yes      | Why this task exists; current state of the codebase                                                                |
| 4     | **Dependencies**                         | Yes      | Upstream tasks / prerequisites                                                                                     |
| 5     | **Cross-Task Dependencies & Sequencing** | Optional | Upstream, parallel, downstream (add for implementation tasks)                                                      |
| 6     | **Research**                             | Yes      | Date-stamped findings; link to RESEARCH-INVENTORY R-\* topics; basics, best practices, standards, novel techniques |
| 7     | **Related Files**                        | Yes      | Path — role (modify / create / reference)                                                                          |
| 8     | **Acceptance Criteria**                  | Yes      | Checkboxes; testable                                                                                               |
| 9     | **Technical Constraints**                | Yes      | Must-match constraints (repo rules, APIs, versions)                                                                |
| 10    | **Implementation Plan**                  | Yes      | Ordered steps                                                                                                      |
| 11    | **Sample code / examples**               | Yes      | At least one actionable snippet tied to Related Files and research                                                 |
| 12    | **Testing Requirements**                 | Yes      | How to verify (commands, manual steps, E2E)                                                                        |
| 13    | **Definition of Done**                   | Yes      | Code review, tests, build, docs                                                                                    |

---

## Metadata fields

Every task MUST include these Metadata entries:

- **Task ID**: Same as filename without `.md` (e.g. `6-8a-turbo-gen-new-client`)
- **Owner**: AGENT or team/person
- **Priority / Severity**: P0 (blocking), P1, P2, etc.
- **Target Release**: TBD or version/milestone
- **Related Epics / ADRs**: THEGOAL refs, epic IDs, ADR paths
- **Reviewers / Stakeholders**: @agent or names
- **Upstream Tasks**: Comma-separated IDs or "None"
- **Downstream Tasks**: Comma-separated IDs or "TBD"

---

## Task types and AI execution hints

Classify each task by type. Use these hints for consistent execution:

| Type            | Prefix / examples  | AI execution hints                                                   |
| --------------- | ------------------ | -------------------------------------------------------------------- |
| **Fix/Blocker** | 0-4, 0-5, 0-6, 0-7 | Run the failing command first (e.g. `pnpm type-check`, `pnpm test`). |

Fix exact file paths and APIs; preserve consumer contract. **NEW:** Check for type mismatches
(image vs src), duplicate exports, and prop consistency (member vs members).
Test dependent packages after fixes. |
| **CLI/Generator** | 6-8a, 6-8b, 6-8c, 6-8d, 6-8e | Implement generator/CLI; run it; then run `pnpm validate-client` (or equivalent). Use starter-template as source. |
| **Cleanup/Docs** | 6-9a, 6-9b, 6-9c, 6-1a | Run knip/validate-docs; remove or update only what the task specifies. |
| **Infrastructure/Registry** | inf-1 … inf-15 | Config-driven; extend existing registries; no breaking changes to current flow. |
| **Architecture/CI** | c-1 … c-18 | Wire scripts to package.json; document in docs/; add CI step if required. |
| **Governance** | d-1, d-6, d-8 | Scripts + docs; schema versioning, a11y gate, SBOM. |
| **Docs** | docs-\* | Create/update docs; run `pnpm validate-docs`. |
| **API/Integration** | api-_, integration-_ | Next.js App Router API routes; site.config-driven; health/OG/adapters. |
| **Scripts/Wiring** | scripts-wire-\* | Audit scripts in `scripts/`; add package.json entries; document. |
| **Ops** | e-7 | Infra ops, queues, governance. |
| **Feature systems** | f-\* | Align with R-INFRA, THEGOAL; CVA, tokens, providers. |

---

## Research section requirements

- **Date-stamp**: All findings use a single date (e.g. 2026-02).
- **Link to RESEARCH-INVENTORY**: Reference the relevant R-\* topic(s); see [tasks/RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md).
- **Content**: Basics/fundamentals, best practices, highest standards (WCAG, THEGOAL, CLAUDE.md), and novel techniques where applicable.
- **References**: List RESEARCH-INVENTORY anchors, official docs, and repo refs (CLAUDE.md, THEGOAL.md).

---

## Sample code / examples requirements

- At least **one** concrete snippet per task (TypeScript, JSON, or shell as appropriate).
- Snippets must reflect the **existing** framework and **Related Files** (real paths, real APIs).
- **Actionable**: Copy-adapt-paste; imports and paths valid for this repo.
- If research recommends a **better** approach than current code: document the gap in the task (e.g. in Research or Technical Constraints); create a **refactor task** (e.g. `0-4b-refactor-toast-sonner-api.md`) describing the improvement; link from the original task. Create refactor tasks only when 02/2026 research clearly justifies a different approach than the current codebase.

---

## Out of scope for "active" tasks

- Files under `tasks/archive/`
- Meta files: `prompt.md`, `RESEARCH-INVENTORY.md`, `TASK-UPDATE-*.md`, `c-1-c-18-d-1-d-8.md`

---

## Verification

Before considering a task complete, run the checklist in [tasks/VERIFICATION.md](VERIFICATION.md).
