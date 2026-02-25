-- Create processed_webhooks table for webhook idempotency
-- Wave 2 / Database Schema Alignment

create table if not exists app_public.processed_webhooks (
  id uuid primary key default uuid_generate_v4(),
  provider text not null,
  event_id text not null,
  event_type text,
  processed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint processed_webhooks_provider_event_id_unique unique (provider, event_id)
);

-- Add indexes for performance
create index if not exists processed_webhooks_provider_idx on app_public.processed_webhooks (provider);
create index if not exists processed_webhooks_processed_at_idx on app_public.processed_webhooks (processed_at desc);

-- Add comments
comment on table app_public.processed_webhooks is 'Track processed webhook events for idempotency';
comment on column app_public.processed_webhooks.provider is 'Webhook provider (cal, stripe, etc.)';
comment on column app_public.processed_webhooks.event_id is 'Unique event identifier from provider';
comment on column app_public.processed_webhooks.event_type is 'Event type (booking.created, etc.)';
comment on column app_public.processed_webhooks.processed_at is 'When webhook was processed';

-- Enable RLS
alter table app_public.processed_webhooks enable row level security;
alter table app_public.processed_webhooks force row level security;
