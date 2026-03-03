-- Wave 1 / TASK-UI-003: Layout version history table
-- Stores an immutable audit trail of every published Puck layout so that
-- site owners can review, compare, and roll back to any prior version.
-- The `site_layouts` table (TASK-PUCK-001) holds the *active* layout;
-- this table holds the *history*.

create table if not exists app_public.layout_versions (
  id            uuid          primary key default uuid_generate_v4(),
  site_id       text          not null,
  tenant_id     uuid          not null references app_public.tenants (id) on delete cascade,
  -- Snapshot of the full Puck JSON layout at publish time.
  layout_data   jsonb         not null,
  -- Human-readable label (e.g. "v3 – Added hero section").
  -- Set automatically to "Version N" if not provided by the editor.
  version_label text          not null default '',
  -- The user (editor) who published this version. NULL for system-generated.
  published_by  uuid,
  created_at    timestamptz   not null default now()
);

-- Performance: history queries always filter by tenant + site, ordered by time.
create index if not exists layout_versions_tenant_site_idx
  on app_public.layout_versions (tenant_id, site_id, created_at desc);

-- Comments
comment on table app_public.layout_versions
  is 'Immutable history of published Puck layouts, one row per publish event.';
comment on column app_public.layout_versions.site_id
  is 'Logical site identifier (matches site_layouts.site_id).';
comment on column app_public.layout_versions.tenant_id
  is 'Owning tenant – enforced by RLS.';
comment on column app_public.layout_versions.layout_data
  is 'Full Puck JSON snapshot at publish time.';
comment on column app_public.layout_versions.version_label
  is 'Optional human-readable label set by the editor.';
comment on column app_public.layout_versions.published_by
  is 'User ID of the editor who published this version.';

-- Row Level Security -----------------------------------------------------------
-- Mirrors the RLS pattern used on site_layouts: tenant isolation via the
-- app.current_tenant session variable.

alter table app_public.layout_versions enable row level security;
alter table app_public.layout_versions force row level security;

-- Tenants can read their own version history.
create policy "tenants_select_own_versions"
  on app_public.layout_versions for select
  using (
    tenant_id = current_setting('app.current_tenant', true)::uuid
  );

-- Only the service role (bypasses RLS) writes new version rows.
-- Application code calls a server-side function rather than direct inserts.
-- This prevents tenants from injecting versions for other tenants.
create policy "service_role_insert_versions"
  on app_public.layout_versions for insert
  with check (
    tenant_id = current_setting('app.current_tenant', true)::uuid
  );

-- Version rows are immutable: no updates, no direct deletes by tenants.
-- Deletion happens only via the cascade on tenants.id (GDPR right-to-erasure).
