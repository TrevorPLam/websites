# Tenant Isolation Defense-in-Depth

## Layer 1: Request Context Binding

Application middleware sets `app.current_tenant` for every request based on verified identity.
No tenant ID is ever trusted from client-supplied headers or query strings.

## Layer 2: Database-Level RLS Enforcement

`app_public.leads` has `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`.
All CRUD policies compare `tenant_id` against `current_setting('app.current_tenant', true)::uuid`.

## Layer 3: Application Guardrails

Server-side data clients require tenant context before query execution.
Missing tenant context is treated as a hard error to prevent accidental cross-tenant access.

## Validation Strategy

- Integration tests should verify tenant A cannot read/write tenant B records.
- Regression checks should include `SELECT`/`UPDATE`/`DELETE` attempts without tenant context.
- Audit logs should capture tenant context for every privileged mutation.
