# Threat Model Review Policy

Threat models under `docs/security/threat-models/` must be reviewed at least once every 12 months and after any material architecture change affecting trust boundaries.

## Review trigger conditions

- Annual scheduled review (Q1 security review window).
- New external integration handling credentials or webhooks.
- Authentication/session model updates.
- Tenant data isolation architecture changes.

## Operational process

1. Security Champions open a review tracking issue in Q1.
2. Model owners validate threats, mitigations, and residual risk entries.
3. Updates are merged with `Last reviewed` date refreshed.
4. Follow-up remediations are linked to backlog tasks.

## Enforcement hooks

- Calendar reminder + quarterly security operations checklist.
- CI check for stale review dates using `pnpm check-review-schedule`.
