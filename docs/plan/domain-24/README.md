# Domain 24: Realtime Lead Feed

## Overview

This domain covers the real-time lead feed system that updates client dashboards instantly when new leads are submitted, built on Supabase Realtime with proper multi-tenant security.

## Sections

- [24.1 Philosophy](24.1-philosophy.md)
- [24.2 Realtime Supabase Setup](24.2-realtime-supabase-setup.md)
- [24.3 Realtime Hook](24.3-realtime-hook.md)
- [24.4 Realtime Lead Feed UI](24.4-realtime-lead-feed-ui.md)

## Priority

**P0 (Week 1)** — Critical for client experience and lead response time.

## Dependencies

- Domain 4: Security (RLS policies)
- Domain 7: Multi-Tenancy (tenant resolution)
- Domain 22: AI Chat Widget (lead capture)
