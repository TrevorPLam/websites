# ADR-000: [Title of Decision]

**Status:** [Proposed | Accepted | Superseded | Deprecated]  
**Date:** YYYY-MM-DD  
**Decision Makers:** [Names/roles]  
**Related:** [Links to related ADRs, issues, PRs]

---

## Context

Describe the context and background that led to this decision. What problem are we trying to solve? What are the constraints?

## Decision Drivers

List the key factors that influenced this decision:

- Factor 1
- Factor 2
- Factor 3

## Options Considered

### Option 1: [Name]

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

### Option 2: [Name]

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

## Decision

Clearly state the decision that was made and why.

**Chosen:** [Option name]

**Rationale:** Explain why this option was chosen over the others.

## Consequences

### Positive

- Consequence 1
- Consequence 2

### Negative

- Consequence 1
- Consequence 2

### Neutral

- Consequence 1
- Consequence 2

## Implementation

### Modules Affected

List the modules/components that will be impacted:

- `module/path/1`
- `module/path/2`

### Commands/Scripts Required

```bash
# List any commands needed for implementation
npm install package-name
```

### Migration Steps

If applicable, document migration steps:

1. Step 1
2. Step 2
3. Step 3

### Boundary Impact

Describe any impact on module boundaries:

- Does this cross module boundaries?
- Does this require changes to APIs or interfaces?
- Are there any dependency concerns?

## Verification

How will we verify this decision was implemented correctly?

- [ ] Verification criterion 1
- [ ] Verification criterion 2
- [ ] Verification criterion 3

## Human-in-the-Loop (HITL)

List any HITL items required for this decision:

- HITL-XXX: Description

## References

- [Link to relevant documentation]
- [Link to related issue/PR]
- [Link to external resource]

---

**Notes:**
- Use this template to document significant architectural or technical decisions
- ADRs are immutable once accepted - create a new ADR to supersede an old one
- Store ADRs in `docs/adr/` with sequential numbering (ADR-001, ADR-002, etc.)
