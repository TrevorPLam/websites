---
title: "Conventional Comments for Reviews"
description: "Use [Conventional Comments](https://conventionalcomments.org/) during code review for clarity and faster resolution."
domain: development
type: reference
layer: global
audience: ["developer"]
phase: 1
complexity: beginner
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "conventional", "comments", "reviews"]
legacy_path: "best-practices\conventional-comments.md"
---
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