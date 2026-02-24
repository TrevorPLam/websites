---
id: GAP-ENV-001-create-env-example
title: Create `.env.example` template with all required environment variables
status: completed
priority: high
type: docs
created: 2026-02-24
updated: 2026-02-24
completed: 2026-02-24
owner: ai-agent
---

# GAP-ENV-001 — Create `.env.example`

## Objective
Provide a root `.env.example` that documents required and optional environment variables for local development and deployment.

## Implementation Notes
- Verified `.env.example` exists at repository root.
- Confirmed variables align with environment schema modules under `packages/infrastructure/env/schemas/`.
- Kept pair-dependent provider variables grouped and documented.

## QA Evidence
- `rg -n "^(NODE_ENV|SITE_URL|SITE_NAME|NEXT_PUBLIC_SITE_URL|NEXT_PUBLIC_SITE_NAME|NEXT_PUBLIC_ANALYTICS_ID|ANALYTICS_ID|NEXT_PUBLIC_SENTRY_DSN|SENTRY_SAMPLE_RATE|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|HUBSPOT_PRIVATE_APP_TOKEN|UPSTASH_REDIS_REST_URL|UPSTASH_REDIS_REST_TOKEN|MINDBODY_API_KEY|MINDBODY_BUSINESS_ID|VAGARO_API_KEY|VAGARO_BUSINESS_ID|SQUARE_API_KEY|SQUARE_BUSINESS_ID)=" .env.example`
