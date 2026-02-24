# Research and Delivery Simplification Standard

## Purpose

Reduce discovery-to-delivery overhead by making research, experimentation, proofs of concept, prototypes, and MVP work traceable and lightweight.

## Scope

- Applies to product discovery, technical research, and pre-production validation work.
- Applies to research spikes, experiments, proofs of concept, prototypes, and MVP initiatives.

## Related references

- `docs/standards/strategy-and-innovation-simplification-standard.md`
- `docs/guides/best-practices/prioritization-framework.md`
- `docs/guides/best-practices/reversibility-principles.md`
- `docs/guides/best-practices/thin-vertical-slice-guide.md`
- `docs/guides/architecture/architecture-decision-record-template.md`

## Simplification requirements

### 1) Research complexity reduction

- Use a single research brief template: question, constraints, evidence, recommendation.
- Time-box research spikes with an explicit stop date and decision owner.
- Publish outcomes in one decision note linked from the active task file.

### 2) Experimentation simplification

- Define every experiment with one hypothesis and one measurable success condition.
- Limit experiment design to baseline, variant, and decision threshold.
- Close experiments with a one-page outcome summary and next action.

### 3) Proof-of-concept cleanup

- Build POCs only for the highest-risk assumption in scope.
- Keep POCs disposable by default with explicit non-production boundaries.
- Record exit criteria before implementation begins.

### 4) Prototype simplification

- Prefer low-fidelity prototypes unless high-fidelity is required for decision confidence.
- Limit prototype scope to user-critical flows, not full-system parity.
- Capture stakeholder feedback in one consolidated decision log.

### 5) MVP development cleanup

- Define MVP scope as the thinnest vertical slice that validates core value.
- Defer non-critical enhancements to post-MVP backlog items with owners.
- Require launch-readiness checks for security, observability, and rollback.

## Lightweight QA checklist

- `pnpm validate-docs` passes after updates.
- Parent task plan references this standard and all five task IDs.
- `TODO.md` status and summary counts reflect completed scope.

## Task mapping

- DOMAIN-37-098-research-complexity-reduction
- DOMAIN-37-099-experimentation-simplification
- DOMAIN-37-100-proof-of-concept-cleanup
- DOMAIN-37-101-prototype-simplification
- DOMAIN-37-102-mvp-development-cleanup
