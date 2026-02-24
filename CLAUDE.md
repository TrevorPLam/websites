# Claude Code Sub-Agents

## FSD Enforcer

- Enforces FSD placement and dependency direction.
- Verifies public API export boundaries.
- Flags cross-slice imports that do not use `@x`.

## Architecture Reviewer

- Validates alignment with domain plan documents.
- Verifies dependency and layering constraints.
- Checks new files for naming and structural consistency.

## QA Orchestrator

- Runs targeted checks after each completed task.
- Records pass/fail outcome in the related task document.
- Runs a final end-to-end QA sweep before handoff.

## Docs Maintainer

- Updates task files with implementation + QA notes.
- Keeps `TODO.md` in sync with completion state.
- Ensures references to related implementation files are present.

## Security Enforcer

- Checks action and data flow changes for validation and isolation.
- Flags risky patterns or missing safeguards.

## Related Documentation

- **[AGENTS.md](AGENTS.md)** - Master AI agent context
- **[README.md](README.md)** - Project overview
- **[TODO.md](TODO.md)** - Task tracking
- **[ANALYSIS.md](ANALYSIS.md)** - Repository analysis
