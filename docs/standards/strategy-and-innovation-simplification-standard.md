# Strategy and Innovation Simplification Standard

## Purpose

Reduce planning and innovation process overhead by replacing heavyweight ceremonies with lightweight, decision-focused workflows.

## Scope

- Applies to product, engineering, design, and delivery planning workflows.
- Applies to strategy, roadmap, architecture evolution, technology assessment, and innovation/research activities.

## Simplification requirements

### 1) Collaboration tooling baseline

- Standardize on one async discussion channel per initiative and one decision log location in `docs/`.
- Prefer built-in repository workflows before introducing new collaboration tools.
- Require sunset criteria for any newly adopted collaboration tool.

### 2) Communication patterns

- Use structured status updates with: `decision`, `impact`, `next step`.
- Default to async updates unless blockers require synchronous discussion.
- Route broad announcements through one canonical channel to prevent duplicate threads.

### 3) Meeting and ceremony reduction

- Require agendas with explicit decisions/outcomes for recurring meetings.
- Cancel recurring meetings with no decisions in two consecutive sessions.
- Replace low-value meetings with written updates and owner acknowledgments.

### 4) Planning process cleanup

- Keep planning artifacts to one problem statement, one execution plan, and one risk log per initiative.
- Use time-boxed planning windows and freeze scope for the active iteration.
- Track dependencies in task docs instead of separate planning boards.

### 5) Estimation simplification

- Use three-point sizing (`small`, `medium`, `large`) for routine work.
- Reserve detailed breakdowns for high-risk/security-sensitive scope only.
- Re-estimate only when requirements materially change.

### 6) Roadmapping cleanup

- Maintain one rolling roadmap per domain with quarterly horizons.
- Encode roadmap items as outcome statements, not task-level checklists.
- Remove roadmap items that have no clear owner or success metric.

### 7) Strategy planning simplification

- Capture strategy changes as concise decision records linked to delivery work.
- Limit strategy reviews to a defined cadence with pre-read inputs.
- Track strategic assumptions and explicitly expire stale assumptions.

### 8) Architecture evolution cleanup

- Document architecture changes with lightweight ADRs using existing templates.
- Require problem, options, and chosen tradeoff in every architecture decision.
- Batch non-urgent refactor proposals into periodic architecture reviews.

### 9) Technology assessment simplification

- Evaluate tools with a fixed scorecard: capability, cost, risk, reversibility.
- Time-box evaluations and require a default recommendation at close.
- Prefer reversible pilots over broad adoptions for uncertain tools.

### 10) Innovation management cleanup

- Keep an innovation backlog with explicit hypotheses and expected impact.
- Cap concurrent innovation experiments to protect delivery throughput.
- Promote experiments to roadmap only after objective success criteria are met.

## Lightweight QA checklist

- `pnpm validate-docs` passes after updates.
- Parent task documentation links to this standard and task mapping.
- `TODO.md` status reflects completion of mapped tasks.

## Task mapping

- DOMAIN-37-088-collaboration-tools-cleanup
- DOMAIN-37-089-communication-simplification
- DOMAIN-37-090-meeting-overhead-reduction
- DOMAIN-37-091-planning-complexity-cleanup
- DOMAIN-37-092-estimation-simplification
- DOMAIN-37-093-roadmapping-cleanup
- DOMAIN-37-094-strategy-planning-simplification
- DOMAIN-37-095-architecture-evolution-cleanup
- DOMAIN-37-096-technology-assessment-simplification
- DOMAIN-37-097-innovation-management-cleanup
