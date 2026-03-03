-- Wave 3 / TASK-AI-004-REV: Experiments and component mutex tables
-- Stores experiment definitions and a per-component lock table that prevents
-- two experiments from targeting the same component at the same time.
-- Overlapping experiments would invalidate statistical significance, so the
-- mutex is enforced at the database layer in addition to the application layer.

-- ─── experiments ─────────────────────────────────────────────────────────────

create table if not exists app_public.experiments (
  id              uuid          primary key default uuid_generate_v4(),
  tenant_id       uuid          not null references app_public.tenants (id) on delete cascade,
  name            text          not null,
  -- Path pattern (exact, prefix with *, or '*' for all pages)
  path            text          not null default '*',
  -- Puck JSON variants keyed by variant ID
  variants        jsonb         not null default '[]'::jsonb,
  -- Traffic split weights must sum to 100
  traffic_weights jsonb         not null default '{"control":50,"variant_b":50}'::jsonb,
  status          text          not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'concluded')),
  winner_variant  text,
  -- Statistical significance threshold (default 0.05 = 95% confidence)
  significance_threshold numeric(5, 4) not null default 0.0500
    check (significance_threshold >= 0.0001 and significance_threshold <= 0.2000),
  -- Minimum sample size before auto-promote can fire
  min_sample_size integer       not null default 100,
  started_at      timestamptz,
  concluded_at    timestamptz,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index if not exists experiments_tenant_status_idx
  on app_public.experiments (tenant_id, status);

comment on table app_public.experiments
  is 'A/B experiment definitions with variant configs and traffic weights.';
comment on column app_public.experiments.variants
  is 'Array of {id, name, layoutData} objects; layoutData is full Puck JSON.';
comment on column app_public.experiments.traffic_weights
  is 'Object keyed by variant ID with integer weight values summing to 100.';
comment on column app_public.experiments.winner_variant
  is 'Set when the experiment is auto-promoted to the statistically significant winner.';

-- ─── experiment_component_locks ──────────────────────────────────────────────
-- Each row represents an exclusive claim by an experiment on a component
-- slot (identified by component_key). Inserting a row here is the "mutex
-- acquire"; deleting it is the "release". A unique constraint enforces that
-- at most one active experiment holds each component slot per tenant.

create table if not exists app_public.experiment_component_locks (
  id              uuid          primary key default uuid_generate_v4(),
  tenant_id       uuid          not null references app_public.tenants (id) on delete cascade,
  experiment_id   uuid          not null references app_public.experiments (id) on delete cascade,
  -- Stable key identifying the component slot, e.g. "hero:homepage"
  component_key   text          not null,
  acquired_at     timestamptz   not null default now(),
  -- Optional TTL guard: lock auto-expires if experiment stalls
  expires_at      timestamptz   not null default (now() + interval '30 days')
);

-- Enforce exclusivity: one active lock per (tenant, component_key)
create unique index if not exists experiment_component_locks_unique_slot_idx
  on app_public.experiment_component_locks (tenant_id, component_key);

create index if not exists experiment_component_locks_experiment_idx
  on app_public.experiment_component_locks (experiment_id);

comment on table app_public.experiment_component_locks
  is 'Mutex table preventing two experiments from claiming the same component slot simultaneously.';
comment on column app_public.experiment_component_locks.component_key
  is 'Stable slot identifier, e.g. "hero:homepage" or "cta:pricing".';

-- ─── experiment_events ───────────────────────────────────────────────────────
-- Lightweight append-only event log for impression and conversion tracking.
-- Separate from Tinybird ingest so that statistical computations can run
-- directly in Postgres using window functions.

create table if not exists app_public.experiment_events (
  id              uuid          primary key default uuid_generate_v4(),
  tenant_id       uuid          not null references app_public.tenants (id) on delete cascade,
  experiment_id   uuid          not null references app_public.experiments (id) on delete cascade,
  variant_id      text          not null,
  -- 'impression' = page view assigned to variant; 'conversion' = goal reached
  event_type      text          not null check (event_type in ('impression', 'conversion')),
  -- Optional conversion type label, e.g. 'lead_captured', 'phone_clicked'
  conversion_type text,
  -- Hashed visitor identifier (not raw IP — SHA-256 of IP + salt)
  visitor_hash    text          not null,
  recorded_at     timestamptz   not null default now()
);

create index if not exists experiment_events_experiment_idx
  on app_public.experiment_events (experiment_id, variant_id, event_type);

create index if not exists experiment_events_tenant_idx
  on app_public.experiment_events (tenant_id, recorded_at desc);

comment on table app_public.experiment_events
  is 'Append-only impression and conversion events for A/B statistical analysis.';

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table app_public.experiments enable row level security;
alter table app_public.experiments force row level security;

alter table app_public.experiment_component_locks enable row level security;
alter table app_public.experiment_component_locks force row level security;

alter table app_public.experiment_events enable row level security;
alter table app_public.experiment_events force row level security;

-- experiments: tenants may select/insert/update their own rows
create policy "tenants_select_own_experiments"
  on app_public.experiments for select
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy "tenants_insert_own_experiments"
  on app_public.experiments for insert
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy "tenants_update_own_experiments"
  on app_public.experiments for update
  using (tenant_id = current_setting('app.current_tenant', true)::uuid)
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- component locks: same tenant isolation
create policy "tenants_select_own_locks"
  on app_public.experiment_component_locks for select
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy "tenants_insert_own_locks"
  on app_public.experiment_component_locks for insert
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy "tenants_delete_own_locks"
  on app_public.experiment_component_locks for delete
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- experiment events: insert-only for tenants (no update/delete for audit integrity)
create policy "tenants_select_own_events"
  on app_public.experiment_events for select
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy "tenants_insert_own_events"
  on app_public.experiment_events for insert
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);
