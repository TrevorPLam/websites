# Collaboration Simplification Standard

## Purpose

Reduce process overhead in collaboration workflows while keeping review quality, onboarding speed, and knowledge continuity high.

## Scope

- Applies to all contributors and AI agents.
- Applies to pull requests, onboarding flows, knowledge transfer sessions, and mentoring activities.

## Simplification requirements

### 1) Knowledge management baseline

- Keep one source of truth per topic in `docs/`.
- Prefer short runbooks over large policy docs when guidance is operational.
- Archive obsolete docs in the same PR that introduces replacements.

### 2) Documentation maintenance cadence

- Update docs only when behavior or ownership changes.
- Use quarterly reviews for stale pages rather than ad-hoc large rewrites.
- Keep each page focused on one decision or one workflow.

### 3) Training and onboarding

- New contributor onboarding is a single checklist-based flow.
- Training material must include expected outcomes and a completion signal.
- Reuse existing guides before creating new onboarding documents.

### 4) Knowledge transfer

- Use handoff notes with: current state, open risks, next actions.
- Record ownership transitions directly in task/plan documents.
- Avoid parallel handoff formats across teams.

### 5) Code review simplification

- Default to one reviewer for low-risk changes.
- Use two reviewers only for security-sensitive or high-blast-radius changes.
- PR templates should request only action-oriented review comments.

### 6) Pair programming and mentoring

- Time-box pair sessions to a clear objective and 60-minute cap by default.
- Use mentoring goals per quarter, not weekly mandatory ceremonies.
- Capture outcomes in lightweight notes linked from task files.

## Lightweight QA checklist

- `pnpm validate-docs` passes after process-doc updates.
- Task and plan files link to the governing standard.
- No duplicate workflow docs were introduced for the same process.

## Task mapping

- DOMAIN-37-080-knowledge-management-cleanup
- DOMAIN-37-081-documentation-maintenance-simplification
- DOMAIN-37-082-training-complexity-reduction
- DOMAIN-37-083-knowledge-transfer-cleanup
- DOMAIN-37-084-onboarding-simplification
- DOMAIN-37-085-code-review-cleanup
- DOMAIN-37-086-pair-programming-simplification
- DOMAIN-37-087-mentoring-complexity-reduction
