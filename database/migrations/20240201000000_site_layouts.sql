-- Wave 1 / TASK-PUCK-001: Site layouts table
-- Stores JSON-driven Puck editor layouts per site with full version history.
-- RLS ensures strict per-tenant isolation when tenant_id is provided.
-- Admin-created layouts (tenant_id NULL) are managed via service-role only.

create table if not exists app_public.site_layouts (
  id          uuid          primary key default uuid_generate_v4(),
  site_id     text          not null,
  tenant_id   uuid          references app_public.tenants (id) on delete cascade,
  layout_data jsonb         not null default '{}'::jsonb,
  published   boolean       not null default false,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

-- Performance: most queries filter by tenant + site
create index if not exists site_layouts_tenant_site_idx
  on app_public.site_layouts (tenant_id, site_id);

-- Performance: quickly fetch the current published layout
create index if not exists site_layouts_site_published_idx
  on app_public.site_layouts (site_id, published)
  where published = true;

-- Auto-update updated_at on every row modification
create or replace function app_public.set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_layouts_updated_at
  before update on app_public.site_layouts
  for each row execute function app_public.set_updated_at();

-- Row Level Security -----------------------------------------------------------
-- Tenant-scoped access applies only to rows that have a tenant_id.
-- Admin/service-role operations bypass RLS entirely.

alter table app_public.site_layouts enable row level security;

-- Tenants can only read their own layouts
create policy "tenants_select_own_layouts"
  on app_public.site_layouts for select
  using (tenant_id = auth.uid() or tenant_id is null);

-- Tenants can only insert layouts for themselves
create policy "tenants_insert_own_layouts"
  on app_public.site_layouts for insert
  with check (tenant_id = auth.uid() or tenant_id is null);

-- Tenants can only update their own layouts
create policy "tenants_update_own_layouts"
  on app_public.site_layouts for update
  using (tenant_id = auth.uid() or tenant_id is null)
  with check (tenant_id = auth.uid() or tenant_id is null);

-- Tenants can only delete their own layouts
create policy "tenants_delete_own_layouts"
  on app_public.site_layouts for delete
  using (tenant_id = auth.uid() or tenant_id is null);
