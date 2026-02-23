<!--
/**
 * @file architecture-decision-record-template.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for architecture decision record template.
 * @entrypoints docs/guides/architecture-decision-record-template.md
 * @exports architecture decision record template
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# Architecture Decision Record (ADR) Template

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Title

**Date:** [YYYY-MM-DD]
**Deciders:** [List of people who made the decision]
**Status:** [Current status of the decision]

### Status Options

- **Proposed:** The ADR is under consideration and open for discussion.
- **Accepted:** The decision has been agreed upon and should be implemented.
- **Rejected:** The proposal has been declined.
- **Deprecated:** The decision is no longer relevant due to changes in the project.
- **Superseded by [ADR-XXXX]:** A newer decision has replaced this one.

### Context

[This section describes the forces at play, including technical, business, and social factors. What is the issue that motivates this decision? What is the current state of the world? Why is a change being considered? Be explicit about any assumptions or constraints. This section should be written in plain language to provide background for anyone reading the record in the future.]

**Questions to consider:**

- What problem are we trying to solve?
- What are the known limitations of the current approach?
- What are the drivers for change (e.g., performance, scalability, maintainability, team structure)?

### Options Considered

[List and evaluate the alternative approaches that were considered. This helps demonstrate due diligence and provides context for why the chosen solution was selected.]

**Option 1: [Description]**

- Pros: [Advantages]
- Cons: [Disadvantages]

**Option 2: [Description]**

- Pros: [Advantages]
- Cons: [Disadvantages]

**Option 3: [Chosen Solution]**

- Pros: [Advantages]
- Cons: [Disadvantages]

### Decision

[This section states the change that we are proposing or have agreed upon. It should be written in an active voice ("We will..."). It describes the new state of things and outlines the chosen solution.]

**Example:** "We will adopt Feature-Sliced Design (v2.1) as the primary architectural pattern for all new frontend applications. This will involve structuring our codebase by layers (`app`, `pages`, `features`, etc.) and enforcing module boundaries with a linter."

### Related ADRs

[List any related ADRs that provide additional context or are affected by this decision.]

- [ADR-XXXX]: [Brief description of relationship]
- [ADR-YYYY]: [Brief description of relationship]

### Consequences

[This section describes the resulting context after applying the decision. It should be balanced, listing both the positive and negative consequences.]

**Positive:**

- [e.g., Improved code maintainability and navigability]
- [e.g., Clearer team ownership of modules]
- [e.g., Enforced separation of concerns]

**Negative/Risks:**

- [e.g., Initial learning curve for developers]
- [e.g., Requires refactoring of existing code to fit the new pattern]
- [e.g., Tooling (linters, generators) must be set up and maintained]

**Mitigations:**

- [e.g., Create a comprehensive migration guide and hold training sessions.]
- [e.g., Start with new projects and migrate incrementally.]
- [e.g., Automate enforcement with CI to prevent regressions.]

### Implementation Tracking

[Link to related issues, pull requests, or tasks that implement this decision.]

- **Issue:** [Link to issue tracker]
- **Pull Request:** [Link to PR]
- **Tasks:** [List of implementation tasks]

---

**Note to ADR Author:** Keep the document concise and focused on a single decision. Link to relevant pull requests, issues, or design documents for additional detail.


--- 

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns


## Overview

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
