-- Wave 1 / TASK-017: Immutable audit log table for SOC 2 compliance
-- Creates an append-only audit trail in app_private schema.
-- Each row carries a SHA-256 chain_hash derived from the previous row's hash
-- so that any retroactive tampering is detectable via the trail verifier.
-- The table is intentionally placed in app_private so that application roles
-- cannot UPDATE or DELETE rows through normal query paths.

-- ── Table ─────────────────────────────────────────────────────────────────────

create table if not exists app_private.audit_logs (
  -- Sequential surrogate key for ordering and pagination.
  id            bigserial     primary key,
  -- Tenant that produced the event (foreign key to app_public.tenants).
  tenant_id     uuid          not null references app_public.tenants (id) on delete restrict,
  -- Authenticated user that triggered the action.  NULL for system actions.
  user_id       uuid,
  -- Action name in dot-notation, e.g. "user.created", "billing.updated".
  action        text          not null check (char_length(action) between 1 and 128),
  -- Outcome of the action.
  outcome       text          not null check (outcome in ('success', 'failure', 'unauthorized')),
  -- Structured metadata as JSON.  Must NOT contain passwords, tokens, or raw PII.
  metadata      jsonb         not null default '{}'::jsonb,
  -- ISO-8601 timestamp of when the event occurred.
  occurred_at   timestamptz   not null default now(),
  -- SHA-256 of "<previous_hash>:<id>:<occurred_at>:<tenant_id>:<action>:<outcome>"
  -- Genesis row uses empty string as the previous hash.
  chain_hash    text          not null check (char_length(chain_hash) = 64)
);

-- ── Indexes ──────────────────────────────────────────────────────────────────

-- Most queries filter by tenant, then order by time.
create index if not exists audit_logs_tenant_time_idx
  on app_private.audit_logs (tenant_id, occurred_at desc);

-- Enable filtering by action type (e.g. all "user.*" events for a tenant).
create index if not exists audit_logs_action_idx
  on app_private.audit_logs (action text_pattern_ops);

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table app_private.audit_logs enable row level security;

-- Only the authenticated user's own tenant rows are visible via the service role.
create policy if not exists audit_logs_tenant_select
  on app_private.audit_logs
  for select
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- INSERT is permitted to the service role; no UPDATE or DELETE policies are
-- defined — this makes the log append-only for application code.
create policy if not exists audit_logs_tenant_insert
  on app_private.audit_logs
  for insert
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- ── Comments ──────────────────────────────────────────────────────────────────

comment on table app_private.audit_logs
  is 'Immutable, hash-chained audit trail for SOC 2 compliance (TASK-017).  '
     'Never UPDATE or DELETE rows — integrity depends on the append-only contract.';
comment on column app_private.audit_logs.chain_hash
  is 'SHA-256 of "<prev_hash>:<occurred_at>:<tenant_id>:<action>:<outcome>".  '
     'Verify the full chain with verifyAuditChain() in @repo/compliance.';
comment on column app_private.audit_logs.metadata
  is 'Structured context.  Must NOT contain passwords, access tokens, or raw PII.';

-- ── Attach audit trigger to core tables ───────────────────────────────────────
-- The trigger function is defined in database/triggers/audit-trigger.sql which
-- must be applied first.  These calls are idempotent (drop-then-create) so
-- re-running the migration is safe.

select app_private.attach_audit_trigger('app_public.tenants');
select app_private.attach_audit_trigger('app_public.leads');
