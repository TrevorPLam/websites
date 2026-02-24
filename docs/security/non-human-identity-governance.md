# Non-Human Identity (NHI) Governance

## Purpose

Define guardrails for service accounts, bots, CI agents, and AI agents that act on behalf of humans.

## Governance controls

- Every NHI must have an owning team and accountable human owner.
- Credentials must be short-lived and rotated automatically.
- High-risk actions require scoped permissions and explicit approval gates.
- NHI actions must be logged with actor, delegated user, tenant, and trace identifiers.
- Dormant identities must be disabled after 30 days of inactivity.

## Required metadata

- `nhi_id`
- `owner_team`
- `owner_human`
- `allowed_actions`
- `environments`
- `expiry_policy`

## Review cadence

- Monthly owner attestation.
- Quarterly least-privilege review.
- Incident-triggered emergency review.
