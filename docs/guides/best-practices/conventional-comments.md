# Conventional Comments for Reviews

Use [Conventional Comments](https://conventionalcomments.org/) during code review for clarity and faster resolution.

## Approved prefixes

- `praise:` Positive reinforcement for good patterns.
- `nitpick:` Non-blocking minor improvements.
- `suggestion:` Concrete improvement proposal.
- `issue:` Blocking problem that must be addressed.
- `question:` Clarification request.
- `thought:` Optional consideration or broader idea.
- `chore:` Follow-up work that can be deferred.

## Required practices

- Mark blocking feedback with `issue:`.
- Include actionable suggestions with examples when possible.
- Tie architectural concerns to ADR references when relevant.
- Tie security concerns to explicit requirement IDs or security docs.

## Examples

- `issue:` This action lacks tenant scoping. Please require `tenantId` from server context and validate access.
- `suggestion:` Consider extracting this parsing logic into `shared/lib/parse-date.ts` to reduce duplication.
- `question:` Should this edge case map to a 400 instead of a 500?
