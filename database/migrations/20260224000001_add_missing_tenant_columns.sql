-- Add missing tenant columns referenced in application code
-- Wave 2 / Database Schema Alignment

-- Add missing tenant columns
alter table app_public.tenants 
add column status text not null default 'trial',
add column config jsonb not null default '{}'::jsonb,
add column subdomain text,
add column tier text not null default 'basic',
add column onboarding_completed_at timestamptz,
add column custom_domain_verified boolean not null default false,
add column custom_domain_added_at timestamptz,
add column stripe_customer_id text;

-- Add indexes for performance
create index if not exists tenants_status_idx on app_public.tenants (status);
create index if not exists tenants_subdomain_idx on app_public.tenants (subdomain);
create index if not exists tenants_tier_idx on app_public.tenants (tier);
create index if not exists tenants_custom_domain_verified_idx on app_public.tenants (custom_domain_verified);

-- Add comments
comment on column app_public.tenants.status is 'Tenant status: trial, active, suspended, cancelled';
comment on column app_public.tenants.config is 'Tenant configuration (site.config.ts equivalent)';
comment on column app_public.tenants.subdomain is 'Subdomain for tenant site';
comment on column app_public.tenants.tier is 'Subscription tier: basic, pro, enterprise';
comment on column app_public.tenants.onboarding_completed_at is 'When onboarding was completed';
comment on column app_public.tenants.custom_domain_verified is 'Whether custom domain DNS is verified';
comment on column app_public.tenants.custom_domain_added_at is 'When custom domain was added';
comment on column app_public.tenants.stripe_customer_id is 'Stripe customer ID for billing';
