# 0.1 Populate Component a11y Rubric

## Metadata

- **Task ID**: 0-1-populate-component-a11y-rubric
- **Owner**: AGENT
- **Priority / Severity**: P1 (blocks 80+ UI tasks that reference this doc)
- **Target Release**: TBD
- **Related Epics / ADRs**: Task Research Audit; docs/accessibility
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: All 1.xx, 2.xx UI tasks, f-23

## Context

[docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) is referenced by 80+ tasks but currently contains only "TODO". This task populates it with a WCAG 2.2 AA–aligned checklist so implementation can meet accessibility requirements on first attempt.

## Dependencies

- **Code**: docs/accessibility/component-a11y-rubric.md – modify – populate content
- **Research**: RESEARCH.md Section Reference Index (§); R-A11Y in tasks/RESEARCH-INVENTORY.md

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: All tasks that reference docs/accessibility/component-a11y-rubric.md (1.xx, 2.xx, f-23)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] WCAG 2.2**: Touch targets minimum 24×24 CSS px (2.5.8); focus visible ≥2px, 3:1 contrast; dragging movements require keyboard alternative (2.5.7). Source: W3C WCAG 2.2, RESEARCH.md §2, tasks/RESEARCH-INVENTORY.md R-A11Y.
- **[2026-02-18] WAI-ARIA**: Roles, live regions, roving tabindex; reference WAI-ARIA Authoring Practices.
- **[2026-02-18] tasks/prompt.md §12**: Accessibility & Performance Guardrails — rubric must supply concrete success criteria for focus, contrast, touch targets, announcements.

## Related Files

- `docs/accessibility/component-a11y-rubric.md` – modify – add full rubric content

## Acceptance Criteria

- [ ] Rubric includes: touch target size (24×24 px minimum), focus indicators (2px, 3:1 contrast), keyboard navigation, ARIA/live regions, prefers-reduced-motion.
- [ ] Each criterion is testable (e.g. axe-core, manual checklist).
- [ ] Document is linked from RESEARCH.md and task prompt.md §12.
- [ ] All open UI tasks can reference this file for acceptance criteria.

## Technical Constraints

- Markdown format; optional tables/checklists for component authors.
- Align with WCAG 2.2 AA and repo RESEARCH.md.

## Definition of Done

- [ ] component-a11y-rubric.md contains full checklist
- [ ] Documentation updated (RESEARCH.md reference if needed)
- [ ] No code changes; doc-only task
