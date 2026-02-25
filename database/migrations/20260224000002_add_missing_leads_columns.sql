-- Add missing leads columns referenced in application code
-- Wave 2 / Database Schema Alignment

-- Add missing leads columns
alter table app_public.leads 
add column score integer not null default 0,
add column phone text,
add column message text,
add column utm_source text,
add column utm_source_first text,
add column booking_id uuid,
add column lead_source text not null default 'website';

-- Add indexes for performance
create index if not exists leads_score_idx on app_public.leads (score desc);
create index if not exists leads_tenant_score_idx on app_public.leads (tenant_id, score desc);
create index if not exists leads_booking_id_idx on app_public.leads (booking_id);
create index if not exists leads_utm_source_idx on app_public.leads (utm_source);

-- Add comments
comment on column app_public.leads.score is 'Lead quality score (0-100)';
comment on column app_public.leads.phone is 'Contact phone number';
comment on column app_public.leads.message is 'Lead message or inquiry';
comment on column app_public.leads.utm_source is 'UTM source from latest visit';
comment on column app_public.leads.utm_source_first is 'UTM source from first visit';
comment on column app_public.leads.booking_id is 'Associated booking ID';
comment on column app_public.leads.lead_source is 'Lead generation source';
