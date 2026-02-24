# tenant-resolution-sequence-diagram.md

> **Internal Reference** | Next.js 16 Edge Middleware · Upstash KV · Supabase

## Overview

This document provides sequence diagrams for all tenant resolution strategies, the
complete request lifecycle, and data flow from HTTP request to rendered response.

---

## Sequence 1 — Subdomain Resolution (Cache Hit)

```
Browser                 Edge Middleware          Upstash KV          Application
  │                          │                       │                    │
  │─── GET acme.yoursaas.com ──→                    │                    │
  │                          │                       │                    │
  │                  Parse hostname                   │                    │
  │                  slug = "acme"                    │                    │
  │                          │                       │                    │
  │                          │── GET slug:acme ──────→                   │
  │                          │←─ TenantContext ───────│                   │
  │                          │   (cache HIT ~2ms)     │                    │
  │                          │                       │                    │
  │                  Set headers:                     │                    │
  │                  x-tenant-id: t_123              │                    │
  │                  x-tenant-plan: pro              │                    │
  │                  x-billing-access: full          │                    │
  │                          │                       │                    │
  │                          │────────── Request passes through ─────────→
  │                          │                                            │
  │                          │                                    RSC Render
  │                          │                                    Read headers
  │                          │                                    Fetch data
  │                          │                                            │
  │←─────────────────── Streamed HTML Response ────────────────────────────
  │
Total: ~3-8ms to first byte (Edge → KV → render)
```

---

## Sequence 2 — Subdomain Resolution (Cache Miss)

```
Browser              Edge Middleware       Upstash KV         Supabase DB
  │                       │                    │                   │
  │── GET new.yoursaas.com ──→                 │                   │
  │                       │                    │                   │
  │               Parse hostname               │                   │
  │               slug = "new"                 │                   │
  │                       │                    │                   │
  │                       │── GET slug:new ────→                   │
  │                       │←─ (null — MISS) ───│                   │
  │                       │                    │                   │
  │                       │──────────────── SELECT * FROM tenants ──→
  │                       │                    │  WHERE slug='new'  │
  │                       │←────────────────── TenantContext ───────│
  │                       │                    │   (~15-30ms)       │
  │                       │                    │                   │
  │                       │── SET slug:new ────→                   │
  │                       │   TTL: 600s        │                   │
  │                       │                    │                   │
  │               Set x-tenant-* headers       │                   │
  │                       │                    │                   │
  │←───── Streamed Response (subsequent requests use cache) ─────────
  │
Total: ~25-50ms (first request); ~3-8ms after cache warms
```

---

## Sequence 3 — Custom Domain Resolution

```
Browser              Edge Middleware       Upstash KV         Supabase DB
  │                       │                    │                   │
  │── GET app.acme.com ───→                    │                   │
  │                       │                    │                   │
  │           hostname does NOT end in         │                   │
  │           .yoursaas.com → custom domain    │                   │
  │                       │                    │                   │
  │                       │── GET domain:app.acme.com ────────────→
  │                       │←─ TenantContext ───│                   │
  │                       │   or null          │                   │
  │                       │                    │                   │
  │               [on null]                    │                   │
  │                       │──────── SELECT * FROM tenants ─────────→
  │                       │                    │  WHERE custom_domain
  │                       │←──────── TenantContext ────────────────│
  │                       │                    │                   │
  │                       │── SET domain:app.acme.com ─────────────→
  │                       │   TTL: 300s (shorter — domain changes)  │
  │                       │                    │                   │
  │←────────────── Response ───────────────────────────────────────
```

---

## Sequence 4 — Tenant Not Found (404 Flow)

```
Browser              Edge Middleware       Upstash KV         Supabase DB
  │                       │                    │                   │
  │── GET ghost.yoursaas.com ──→               │                   │
  │                       │                    │                   │
  │                       │── GET slug:ghost ──→                   │
  │                       │←─ (null)            │                   │
  │                       │                    │                   │
  │                       │──────────── SELECT (no result) ─────────→
  │                       │←─────────── (empty) ───────────────────│
  │                       │                    │                   │
  │               Rewrite to /not-found        │                   │
  │                       │                    │                   │
  │←─────── 200 /not-found (no 404 header leaks tenant existence) ───
```

---

## Sequence 5 — Billing-Gated Request (Suspended Tenant)

```
Browser              Edge Middleware       Upstash KV         Supabase DB    Billing Lock Page
  │                       │                    │                   │                │
  │── GET acme.yoursaas.com/dashboard ──→      │                   │                │
  │                       │                    │                   │                │
  │               Resolve tenant (cache hit)   │                   │                │
  │               tenant.billingStatus = 'unpaid'                  │                │
  │                       │                    │                   │                │
  │               getBillingAccess('unpaid')   │                   │                │
  │               → access = 'locked'          │                   │                │
  │                       │                    │                   │                │
  │               Redirect to /billing/reactivate                  │                │
  │                       │                    │                   │                │
  │←─────────────── 307 Redirect ─────────────────────────────────────────────────→
  │──── GET /billing/reactivate ─────────────────────────────────────────────────→
  │←─── Reactivation page ──────────────────────────────────────────────────────←
```

---

## Sequence 6 — Full PPR Request Lifecycle

```
Browser              Vercel CDN           Edge Middleware       Next.js RSC         Supabase
  │                      │                    │                     │                  │
  │── GET /dashboard ────→                    │                     │                  │
  │                      │                    │                     │                  │
  │              Check CDN cache              │                     │                  │
  │              [MISS — dynamic route]       │                     │                  │
  │                      │                    │                     │                  │
  │                      │────── Invoke Edge Function ─────────────→                  │
  │                      │                Middleware runs:          │                  │
  │                      │                - Resolve tenant          │                  │
  │                      │                - Rate limit              │                  │
  │                      │                - Evaluate flags          │                  │
  │                      │                - Set security headers    │                  │
  │                      │                                          │                  │
  │                      │────────────── Forward to RSC ────────────→                 │
  │                      │                                          │                  │
  │                      │                          ┌── Static shell (cached, instant)
  │                      │                          │   Layout, navigation, skeleton  │
  │←───────────────── Stream: static shell ─────────┘                                │
  │                      │                          │                                  │
  │                      │                          │── Parallel data fetches ────────→
  │                      │                          │   analytics, leads, team         │
  │                      │                          │←── Results ──────────────────────│
  │                      │                          │   (15-50ms per query)            │
  │                      │                          │                                  │
  │←───────────────── Stream: dynamic sections ─────┘                                │
  │                      │                                                             │
  │  (React hydrates)    │                                                             │
  │                      │
Total: Static shell in ~50ms, dynamic content in ~100-200ms
```

---

## Sequence 7 — Cache Invalidation on Tenant Update

```
Admin Action           Supabase DB          Upstash KV          Edge CDN
  │                       │                    │                   │
  │── Update tenant plan ──→                   │                   │
  │   (pro → enterprise)   │                   │                   │
  │                       │                    │                   │
  │           Supabase Webhook triggers        │                   │
  │                       │                    │                   │
  │                       │──── DEL slug:acme ──→                  │
  │                       │──── DEL tenant:t_123 →                 │
  │                       │                    │                   │
  │                       │───────── revalidateTag('tenant:t_123') →
  │                       │          (Next.js cache invalidation)  │
  │                       │                    │                   │
  │           Next request to acme.yoursaas.com                    │
  │           resolves fresh tenant context from DB                │
  │           with new plan: enterprise                            │
  │           and new billing access: full                         │
```

---

## Architecture Decision Records

### ADR-001: Why Upstash KV over Vercel KV

| Factor                 | Upstash Redis       | Vercel KV         |
| ---------------------- | ------------------- | ----------------- |
| Global replication     | 10+ regions         | Limited           |
| Read latency           | ~1ms (global)       | ~5ms (US-centric) |
| Price model            | Per request         | Per GB-month      |
| Bandwidth              | Included            | Extra cost        |
| Consistent API         | ✅ Redis-compatible | ✅                |
| Multi-tenant isolation | ✅ Via key prefix   | ✅                |

**Decision:** Use Upstash Redis for tenant resolution cache. Its global read
replication ensures sub-2ms KV lookups in all major Vercel regions.

### ADR-002: Why Short TTL on Custom Domains (5 min)

Custom domain DNS changes (CNAME updates, domain verification) must propagate within
minutes when a tenant updates or verifies their domain. A stale cache entry routing
to the wrong tenant would be a security issue. 5-minute TTL balances performance
(95%+ cache hit rate) with correctness.

### ADR-003: Why `slug:` and `domain:` Separate Keys

Using separate key namespaces for slug-based and domain-based lookups enables:

1. Independent TTL tuning (domains: 5min, slugs: 10min)
2. Surgical cache invalidation (slug change doesn't invalidate domain cache)
3. Cache size budgeting (domains cache is smaller — fewer tenants have custom domains)

---

## Performance Targets

| Operation                     | P50   | P95   | P99   |
| ----------------------------- | ----- | ----- | ----- |
| Middleware total (cache hit)  | 3ms   | 8ms   | 15ms  |
| Tenant KV lookup (Upstash)    | 1ms   | 3ms   | 5ms   |
| Tenant DB lookup (cache miss) | 15ms  | 40ms  | 80ms  |
| Full page TTFB (static shell) | 50ms  | 120ms | 200ms |
| Full page TTFB (full dynamic) | 200ms | 400ms | 700ms |

---

## References

- [Tenant Resolution Implementation](./tenant-resolution-implementation.md)
- [Routing Strategy Comparison](./routing-strategy-comparison.md)
- [Noisy Neighbor Prevention](./noisy-neighbor-prevention.md)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Upstash Redis Global Replication](https://upstash.com/docs/redis/features/globalreplication)
