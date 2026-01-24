# Onboarding

## Environment setup

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values:

   - `SUPABASE_URL`: Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-only secret).
   - `HUBSPOT_PRIVATE_APP_TOKEN`: HubSpot private app token (server-only secret).

3. Optional variables:

   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for production rate limiting.
   - `NEXT_PUBLIC_*` entries for site metadata and analytics.
   - `SENTRY_*` entries if you enable Sentry.

For details on defaults and validation behavior, see `lib/env.ts` and the comments in `.env.example`.
