-- Wave 0 / Task 2: Leads table with tenant FK and RLS enabled
create table if not exists app_public.leads (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app_public.tenants(id) on delete cascade,
  email text not null,
  name text,
  source text not null default 'website',
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_email_format check (position('@' in email) > 1),
  constraint leads_status_valid check (status in ('new', 'qualified', 'contacted', 'converted', 'archived'))
);

create unique index if not exists leads_tenant_email_created_bucket_uniq
  on app_public.leads (tenant_id, lower(email), date_trunc('day', created_at));

create index if not exists leads_tenant_created_idx on app_public.leads (tenant_id, created_at desc);

alter table app_public.leads enable row level security;
alter table app_public.leads force row level security;
