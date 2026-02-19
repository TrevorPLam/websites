After thoroughly reviewing the previous response for quality and completeness, I've refined and enhanced the guidelines to ensure they are accurate, comprehensive, and actionable. This version incorporates additional best practices, clarifies key points, and provides a robust template that can be used by an agent to update every task in your project.

Below is the polished and verified guide for documenting tasks, tailored for your marketing websites monorepo and optimized for use with Cursor AI.

---

# 📋 The Ultimate Guide to Task Documentation

A well-documented task is the foundation of efficient development—whether you're handing it off to a human teammate or an AI agent like Cursor. This guide outlines the essential information every task should include, with practical examples and a ready-to-use template.

## Why Thorough Task Documentation Matters

- **Clarity** – Reduces ambiguity and back-and-forth questions.
- **Efficiency** – Allows immediate execution without context switching.
- **Quality** – Ensures requirements are met and edge cases are handled.
- **AI‑Readiness** – Provides the structured context that AI agents need to generate accurate, project‑appropriate code.

## Core Components of a Well-Documented Task

### 0. Task Metadata

Capture the at-a-glance details up front so tasks plug directly into your tracker, automations, and reporting.

**Include:**

- Task ID / slug (match Linear/Jira/GitHub issue number)
- Owner or responsible pairing partner
- Priority & severity (P0/P1, blocker, etc.)
- Target release or due date
- Related epics, OKRs, or ADR IDs
- Reviewers / stakeholders who must approve

**Example:**

```markdown
## Metadata

- **Task ID**: TASK-204
- **Owner**: @alex-lee
- **Priority**: P1 (impacts upcoming launch)
- **Target Release**: 2026-03-15
- **Related**: Growth Epic GRW-12, ADR-0004 (Booking Conflicts)
- **Reviewers**: @ux-sam, @qa-taylor
```

### 1. Context & Purpose

Explain the **why** behind the task. This helps the implementer make informed decisions and prioritize correctly.

**Include:**

- The business problem or user need being addressed.
- Links to related epics, user stories, or feature requests.
- Any relevant product metrics or success criteria.

**Example:**

```markdown
## Context

Customers frequently abandon the booking process when they encounter double‑booked time slots. This task adds real‑time conflict detection to prevent scheduling overlaps, directly addressing a top user complaint and aiming to reduce booking abandonment by 15%.
```

### 2. Dependencies

List everything the task relies on—both technical and organizational.

**Dependency Types:**

| Type               | Description                                       | Example                                                    |
| ------------------ | ------------------------------------------------- | ---------------------------------------------------------- |
| **Package**        | External libraries or internal packages           | `@repo/ui@2.1.0` – provides the `Button` component         |
| **API / Service**  | External endpoints, databases, or cloud services  | HubSpot API – requires API key with `contacts:write` scope |
| **Code Module**    | Specific functions, classes, or files             | `validateBookingTime` from `@repo/features/booking`        |
| **Infrastructure** | Environment variables, feature flags, permissions | `BOOKING_CONFLICT_CHECK` feature flag must be enabled      |
| **Team / Review**  | Required approvals or input                       | UX sign‑off on error message copy                          |

For each dependency, note whether it is **required** or **optional**, and include the **reason** it is needed. This helps with troubleshooting and future maintenance.

### 3. Related Files & File Paths

Explicitly identify every file that will be created, modified, or deleted.

**Best Practice:**

- Use full paths relative to the project root (e.g., `packages/features/booking/validation.ts`).
- Briefly state the purpose of each file in the context of this task.

**Example:**

```markdown
## Related Files

- `templates/hair-salon/components/BookingForm.tsx` – modify to display conflict errors
- `packages/features/booking/validation.ts` – create new `validateBookingTime` function
- `packages/types/booking.ts` – update `Booking` interface with conflict metadata
- `clients/alpha/site.config.ts` – add `booking.preventConflicts` boolean setting
```

### 4. Code Snippets & Examples

Provide concrete examples that illustrate expected behavior, input/output formats, or implementation patterns. This is especially critical for AI agents.

**Include:**

- **Before/after** code for modifications.
- **Usage examples** for new functions or components.
- **Error scenarios** and how they should be handled.
- **Data structures** (e.g., JSON payloads, TypeScript interfaces).

**Example:**

```typescript
// New validation function signature
function validateBookingTime(
  time: Date,
  existingBookings: Booking[],
  businessHours: BusinessHours
): ValidationResult;

// Expected output format
type ValidationResult = {
  valid: boolean;
  error?: {
    code: 'double_booking' | 'outside_hours';
    message: string;
  };
};

// Usage in component
const { valid, error } = validateBookingTime(selectedTime, bookings, config.hours);
if (!valid) {
  setError(error.message);
}
```

### 5. Acceptance Criteria

Define the conditions that must be met for the task to be considered complete. Each criterion should be **testable** and **unambiguous**.

**Good criteria:**

- "Form submission is blocked when the selected time is already booked."
- "User sees the error message 'This time is unavailable' within 500ms."
- "The `validateBookingTime` function returns `{ valid: false, error: { code: 'double_booking' } }` for conflicting slots."

**Avoid vague statements like** "Make sure it works well."

### 6. Technical Constraints & Considerations

Document any non‑functional requirements that could affect implementation.

**Areas to cover:**

- **Performance** – e.g., "API response must be under 200ms."
- **Security** – e.g., "All user input must be sanitized to prevent XSS."
- **Accessibility** – e.g., "Form error messages must be announced by screen readers (WCAG 2.2 AA)."
- **Browser/device support** – e.g., "Must work on iOS Safari 14+."
- **Compliance** – e.g., "No tracking cookies without explicit consent."

**Example:**

```markdown
## Technical Constraints

- The booking form must function without JavaScript (progressive enhancement).
- All timestamps must be stored in UTC and converted to the user's local time zone on the client.
- Error messages must support internationalization (i18n) via `next-intl`.
```

### 7. Implementation Plan (Optional but Recommended)

For complex tasks, a step‑by‑step plan helps break the work into manageable chunks and can be used as a checklist.

**Example:**

```markdown
## Implementation Plan

1. **Data Layer**
   - [ ] Add `bookings.conflict_check` column to the database.
   - [ ] Create repository method `findConflictingBookings(time, resourceId)`.
2. **Validation Logic**
   - [ ] Implement `validateBookingTime` with business hours logic.
   - [ ] Write unit tests for all edge cases.
3. **UI Integration**
   - [ ] Modify `BookingForm` to call validation before submission.
   - [ ] Display error message with appropriate styling.
4. **Configuration**
   - [ ] Add `booking.preventConflicts` to site config schema.
   - [ ] Update client configs to enable feature.
```

### 8. Testing Requirements

Specify what tests should be written and what scenarios they must cover.

**Include:**

- **Unit tests** – functions, components in isolation.
- **Integration tests** – user flows across multiple modules.
- **Manual test cases** – for edge cases that are hard to automate.
- **Performance/load tests** – if applicable.

**Example:**

```markdown
## Testing Requirements

- **Unit tests** (≥80% coverage for new code):
  - Valid time with no conflicts → returns `{ valid: true }`
  - Valid time with conflict → returns `{ valid: false, error.code: 'double_booking' }`
  - Time outside business hours → returns `{ valid: false, error.code: 'outside_hours' }`
  - Invalid input (e.g., `null`) → throws appropriate error
- **Integration tests**:
  - Full booking flow with conflict prevention (using Playwright)
- **Manual tests**:
  - Concurrent booking attempts from two browsers
  - Daylight saving time boundary (March 10, 2026)
```

### 9. Documentation Updates

Identify any existing documentation that needs to be updated as part of the task.

**Common targets:**

- README files
- API reference docs
- Storybook / component examples
- Architecture Decision Records (ADRs)
- Changelog

**Example:**

```markdown
## Documentation Updates

- [ ] Update `docs/features/booking.md` with conflict prevention details.
- [ ] Add JSDoc comments to `validateBookingTime`.
- [ ] Update API examples in `docs/api/booking.md`.
- [ ] Note the change in `CHANGELOG.md` under "Added".
```

### 10. Design References & Assets

If the task involves UI changes, link to mockups, wireframes, or design tokens.

**Example:**

```markdown
## Design References

- [Figma mockup](https://figma.com/file/...) – shows error state styling.
- [Design tokens](packages/ui/tokens/colors.json) – use `color-feedback-error` for error messages.
```

### 11. Cross-Task Dependencies & Sequencing

Explicitly note how this work fits into the broader program so multiple contributors (human or AI) can execute in parallel without stepping on each other.

**Include:**

- Upstream tasks that must finish first, with links (e.g., `@tasks/2-18-build-portfolio-components.md`).
- Downstream tasks that depend on this work (list expected hand-offs).
- Shared migrations or feature flags that multiple tasks touch.
- Coordination notes (e.g., "Run concurrently with TASK-210 but merge after their schema change").

### 12. Accessibility & Performance Guardrails

Tie every UI or feature change back to the repo's concrete standards so no requirement is left implicit.

- Reference `docs/accessibility/component-a11y-rubric.md` for WCAG 2.2 AA expectations (focus styles, touch targets, screen-reader copy).
- Link to performance budgets (e.g., `docs/architecture/README.md` or feature-specific specs) and restate target metrics (LCP < 2.5s, INP ≤ 200ms, bundle caps, etc.).
- Call out required testing tools: axe-core, Lighthouse CI, WebPageTest scripts, etc.
- Specify progressive enhancement or streaming requirements when applicable.

### 13. Research & Source of Truth

Maintain a dated research log so future contributors understand _why_ standards exist and can validate them against current industry guidance.

- Use ISO dates (`2026-02-17`) for every entry.
- Summarize the key takeaway in one sentence, then provide a short bullet list of actionable implications for this task.
- Reference repo-aligned sources whenever possible (e.g., `RESEARCH.md`, `docs/architecture/dependency-graph.md`, ADRs, workflow specs).
- Capture _basics, fundamentals, best practices, highest standards, and novel techniques_ relevant to the task scope (UI, performance, integrations, etc.).
- Flag when research sunsets (e.g., "Review again after 2026-06-01 release") so stale info can be rotated out.

**Example:**

```markdown
## Research (Updated 2026-02-17)

- **Source**: docs/accessibility/component-a11y-rubric.md, WCAG 2.2
  - Touch targets min 24×24 CSS px; confirm alert buttons honor this.
- **Source**: RESEARCH.md §"Edge-Native Delivery"
  - Booking flow must keep JS payload < 250KB gzipped; plan extra code-splitting.
- **Source**: ADR-0004 Booking Conflicts
  - Reuse `BookingConflictService`; avoid duplicating heuristic logic.
```

## 📝 Task Documentation Template

Use this template as a starting point. Customize sections based on task complexity.

````markdown
# [TASK-ID] Task Title

## Metadata

- **Owner**: [name or @handle]
- **Priority / Severity**: [P0/P1/etc.]
- **Target Release / Due Date**: [YYYY-MM-DD]
- **Related Epics / ADRs**: [links]
- **Reviewers / Stakeholders**: [people]
- **Upstream Tasks**: [TASK-IDs or @file references]
- **Downstream Tasks**: [TASK-IDs or @file references]

## Context

[Business problem, user value, related initiatives]

## Dependencies

- **Package**: [name@version] – [required/optional] – [reason]
- **API**: [endpoint] – [required/optional] – [reason]
- **Code**: [module path] – [required/optional] – [reason]
- **Infrastructure**: [env vars, feature flags] – [reason]
- **Team**: [required input]

## Cross-Task Dependencies & Sequencing

- **Upstream**: [Task or PR that must land first]
- **Parallel Work**: [Tasks to coordinate with]
- **Downstream**: [Work that will consume this output]

## Research & Evidence (Date-Stamped)

- **[YYYY-MM-DD] Source Name**: [link or @file reference] – [core takeaway + how it shapes this task]
- **[YYYY-MM-DD] Source Name**: …

## Related Files

- `[file path]` – [create/modify/delete] – [purpose]
- `[file path]` – [create/modify/delete] – [purpose]

## Code Snippets / Examples

```[language]
[code example demonstrating expected implementation or usage]
```
````

## Acceptance Criteria

- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]

## Technical Constraints

- [constraint 1]
- [constraint 2]

## Accessibility & Performance Requirements

- Accessibility: [link to docs/accessibility/component-a11y-rubric.md and describe requirement]
- Performance: [target metric + link to spec or monitoring dashboard]

## Implementation Plan

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Testing Requirements

- [test requirement 1]
- [test requirement 2]

## Documentation Updates

- [ ] [document] – [what to update]

## Design References

- [Link to mockups or design assets]

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Feature flagged (if applicable)
- [ ] Deployed to staging and verified

```

## 🎯 Best Practices Summary

| Practice | Why It Matters |
|----------|----------------|
| **Write for your future self** | You'll forget details; explicit docs save time. |
| **Use concrete examples** | Abstract requirements are often misinterpreted. |
| **Link everything** | Make it easy to navigate to related issues, designs, and files. |
| **Keep tasks atomic** | One task should do one thing; avoid scope creep. |
| **Include error paths** | Edge cases are where bugs hide. |
| **Specify "why" not just "what"** | Enables better decision‑making during implementation. |
| **Make criteria testable** | "Works well" is not testable; "returns 200 OK" is. |

## 💡 Pro Tips for Cursor AI & Monorepos

Since you're using Cursor and managing a monorepo, consider these extra steps:

- **Use `@` mentions** in your task descriptions to point Cursor to relevant files (e.g., `@packages/features/booking/validation.ts`).
- **Provide schema examples** for data structures you expect the AI to generate.
- **Reference your `.cursorrules`** or project‑specific coding guidelines to ensure consistency.
- **Include environment variable names** and their expected values if configuration is required.
- **For client‑specific tasks**, note which `site.config.ts` fields should be modified.

## ✅ Quality Checklist & Repo Standards

Before marking a task as complete, verify that:

- [ ] Metadata, context, and dependency sections are filled out (omit sections only when truly N/A).
- [ ] Cross-task sequencing is documented so collaborators know order of operations.
- [ ] Accessibility requirements reference `docs/accessibility/component-a11y-rubric.md` and include concrete success criteria (focus, contrast, touch targets, announcements).
- [ ] Performance targets (LCP/INP/CLS, bundle size, streaming requirements) are documented with links to monitoring dashboards or specs.
- [ ] Every file path is correct, clickable, and scoped to the repo root for Cursor `@` mentions.
- [ ] Code examples compile/run when pasted (cursor-friendly snippets, TypeScript types, data contracts).
- [ ] Acceptance criteria are testable and map to automation or manual checks.
- [ ] Dependencies include version constraints + feature flags/env vars with their storage location.
- [ ] Testing instructions cover unit/integration/e2e, and specify required commands (e.g., `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm test:e2e`).
- [ ] Accessibility/performance tooling is listed (e.g., axe, Lighthouse CI, WebPageTest).
- [ ] Documentation updates list exact files (e.g., `docs/features/booking.md`, ADRs, changelog).
- [ ] Research section contains up-to-date, date-stamped sources tied to repo docs/ADRs and highlights basics → novel techniques relevant to the task.

---

By following these guidelines, you'll create tasks that are clear, executable, and ready for both human and AI collaboration. This consistency will pay dividends in reduced friction, fewer bugs, and faster delivery across your entire monorepo.

Would you like me to tailor this further for a specific type of task (e.g., adding a new UI component, setting up a client, or integrating a third‑party service)?
