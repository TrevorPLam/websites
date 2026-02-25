-- Wave 0 / Task 2: Tenants table
create table if not exists app_public.tenants (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  custom_domain text unique,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_slug_format check (slug ~ '^[a-z0-9-]{2,63}$')
);

create index if not exists tenants_created_at_idx on app_public.tenants (created_at desc);
