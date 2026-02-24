# Composite Identity Audit Logging

Composite identity links non-human agent execution with a human or workflow initiator.

## Required log fields

- `timestamp`
- `action`
- `nhi_id`
- `initiator_type` (`human`, `workflow`, `scheduled`)
- `initiator_id`
- `tenant_id`
- `trace_id`
- `result` (`allowed`, `blocked`, `failed`)
- `policy_version`

## Storage and retention

- Write logs to append-only storage.
- Keep hot logs for 90 days and archive for 1 year.
- Encrypt logs at rest and in transit.

## Verification

Use `pnpm ai:log-composite` to emit and validate example composite-identity events.
