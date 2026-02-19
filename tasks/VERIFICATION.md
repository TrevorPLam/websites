# Task verification checklist

**Purpose:** One-time or periodic verification that each task file is accurate and complete. Use when adding or updating tasks.

---

## Per-task checks

### Metadata

- [ ] **Task ID** matches filename (e.g. `6-8a-turbo-gen-new-client` ↔ `6-8a-turbo-gen-new-client.md`).
- [ ] **Upstream / Downstream** task IDs exist as other task files or are "None" / "TBD".

### Context

- [ ] Describes **current state** accurately (e.g. "Plop config is a stub" matches `turbo/generators/config.ts`; "four booking-actions tests fail" matches test file and failure count).
- [ ] No outdated claims (e.g. wrong package names, removed paths).

### Dependencies

- [ ] Upstream tasks listed are real task IDs.
- [ ] Prerequisites are correct (e.g. "5.1 – starter-template exists").

### Research

- [ ] **Date** is set (e.g. 2026-02).
- [ ] **R-\*** links point to existing sections in [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md).
- [ ] No outdated library versions (Sonner 2.x, Next 16, React 19 per [CLAUDE.md](../CLAUDE.md)).

### Related Files

- [ ] **Paths exist** (or are explicitly "to be created").
- [ ] **Role** is correct: modify / create / reference.

### Acceptance Criteria

- [ ] Each item is **testable** (can be checked with a command or manual step).
- [ ] Aligned with Implementation Plan and Technical Constraints.

### Sample code / examples

- [ ] At least one snippet present.
- [ ] **Imports and paths** are valid for this repo.
- [ ] Snippet is **runnable** or clearly marked "conceptual".

### Testing Requirements

- [ ] Commands or steps are **runnable** (e.g. `pnpm validate-client clients/<name>/`, `pnpm test`).

### Definition of Done

- [ ] Includes: code review, tests passing, build passing, docs updated (as applicable).

---

## Structural checks

- [ ] All 13 sections present in **canonical order** (see [tasks/README.md](README.md)).
- [ ] Research section has Key findings + References.
- [ ] No duplicate or contradictory information across sections.

---

## Repo alignment

- [ ] **CLAUDE.md**: Layer rules, package names, pnpm version, ports respected.
- [ ] **THEGOAL.md**: Task references and script paths match THEGOAL if cited.
- [ ] **package.json** / **turbo.json**: Script names and generator wiring match task descriptions.

---

## After verification

Fix any inaccuracies (paths, test counts, API details, dates) in the task file. If RESEARCH-INVENTORY or code has changed, update the task and optionally RESEARCH-INVENTORY.
