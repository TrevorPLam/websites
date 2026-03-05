# MCP Orchestration Stability Report

> **Audit Type**: 5.2 MCP Orchestration Stability Audit  
> **Date**: 2026-03-05  
> **Scope**: Parallel orchestration, load balancing, and concurrency patterns across all MCP servers  
> **Standard**: 2026 enterprise agentic stability requirements

---

## Stability Risk Score

| Dimension | Score (1–10) | Notes |
|-----------|:----------:|-------|
| Deadlock risk | **8/10** | No shared mutable state across servers; each server is a standalone process |
| Race condition risk | **8/10** | Tools are stateless within a single call; minimal shared state |
| Retry storm risk | **6/10** | No built-in retry logic; clients control retries. Could amplify if mis-configured |
| Memory growth risk | **7/10** | Rate-limiter Maps grow with unique tenant keys; pruned per call |
| Failure cascade risk | **7/10** | Servers are independent processes; single server failure does not cascade |
| **Overall Stability** | **7.2/10** | Good isolation; retry storm is primary risk to mitigate |

> Score interpretation: 10 = fully stable, 1 = high instability risk.

---

## Findings

### STAB-001: Rate Limiter Memory — Bounded per-tenant pruning ✅ ADDRESSED
- **Risk**: Sliding-window rate limiters use in-memory `Map<string, { timestamps: number[] }>`. Without pruning, memory grows proportionally to unique tenants × call volume.
- **Current Implementation**: The `createRateLimiter()` helper in `shared/middleware.ts` prunes expired timestamps on every `checkLimit(key)` call (sliding window: cutoff = now - windowMs). Memory per bucket is bounded to `maxCalls` timestamps.
- **Residual Risk**: If a server has 10,000 tenants and none call after the window expires, stale Map entries accumulate until the server restarts. Maximum memory overhead ≈ `tenants × maxCalls × 8 bytes` ≈ 10,000 × 60 × 8 = ~4.8 MB (negligible).
- **Status**: ✅ Acceptable for current scale (1,000 tenants). Revisit if tenant count exceeds 100,000.

### STAB-002: Retry Storm Risk — No exponential backoff enforcement
- **Risk**: MCP clients (Claude, Copilot) may retry failed tool calls immediately on `5xx` or timeout. Without server-side retry headers or circuit breakers, a degraded external API (Tinybird, GA4, SEO APIs) could receive a storm of retries.
- **Affected Servers**: `marketing-analytics`, `seo-tools`, `campaign-automation`
- **Mitigation**: Rate limiters now in place for `seo-tools` (60/min) and `content-management` (30/min). Marketing analytics relies on Tinybird's own rate limiting.
- **Recommended Fix**: Add `Retry-After` semantics to rate-limit responses (already included in error text). Future: implement token-bucket with exponential backoff headers.
- **Status**: 🟡 Partially mitigated — rate limiting reduces storm impact; full fix deferred.

### STAB-003: No Deadlock Risk — Process-isolated servers
- **Architecture**: Each MCP server runs as an independent `node` subprocess (stdio transport). There is no shared memory, shared mutex, or cross-server locking.
- **Cross-server calls**: The `multi-tenant-orchestrator` can coordinate calls across servers, but uses sequential async/await — no parallel lock acquisition.
- **Status**: ✅ No deadlock risk identified.

### STAB-004: Race Condition Analysis — Tool handlers are async-safe
- **Analysis**: All tool handlers are `async` functions with no shared mutable state accessed without proper sequencing. The `content-management` server's `safePath()` uses `fs.realpath()` which is async but not subject to TOCTOU (time-of-check-time-of-use) because:
  1. `fs.realpath()` is called inside the handler before the write
  2. The CONTENT_ROOT boundary check is re-validated after symlink resolution
- **TOCTOU Fix**: `create_content` previously used `fs.access()` then `fs.writeFile()`. Two concurrent create operations for the same file could race, with one overwriting the other. **Fixed** by using `fs.writeFile(path, content, { flag: 'wx' })` which is atomic — `EEXIST` is returned immediately if the file exists at the OS level.
- **Status**: ✅ Fixed — `create_content` now uses atomic `O_EXCL` write semantics.

### STAB-005: Knowledge Graph Memory — Unbounded node accumulation
- **Server**: `knowledge-graph-memory-fixed.ts`
- **Risk**: The in-memory knowledge graph stores entities and relations without eviction. A long-running server session accumulating hundreds of entities could grow without bound.
- **Current Scale**: Knowledge graph is per-session (restarted per agent session); not a persistent store in production.
- **Status**: ✅ Acceptable for current usage pattern. Document that knowledge-graph server should be restarted periodically if used in persistent daemon mode.

### STAB-006: Failure Cascade — Enterprise auth gateway is a shared dependency
- **Risk**: The `enterprise-auth-gateway` is used by other servers for token validation. If it becomes unavailable, dependent servers cannot validate sessions.
- **Current Implementation**: `enterprise-auth-gateway` has an in-memory fallback when Redis is unavailable (TODO.md 1-C: ✅ implemented). The auth gateway itself is resilient.
- **Cascade Risk**: Servers that call `enterprise-auth-gateway` tools for validation would fail if the auth gateway MCP server is not running.
- **Mitigation**: Individual servers should implement circuit breaker logic when calling auth-gateway for validation. Current architecture uses stdio transport (same host), minimizing network failure risk.
- **Status**: 🟡 Low risk for current deployment model.

---

## Concurrency Improvements Implemented

### IMPR-001: In-memory rate limiting with sliding window (`shared/middleware.ts`)
- **Change**: Added `createRateLimiter({ maxCalls, windowMs })` factory function
- **Algorithm**: Sliding window with per-call timestamp pruning (O(maxCalls) per check)
- **Thread safety**: JavaScript single-threaded event loop; no mutex needed
- **Applied to**: `seo-tools` (60 req/min), `content-management` (30 req/min)

### IMPR-002: Tenant ID validation (`shared/middleware.ts`)
- **Change**: Added `assertTenantId(tenantId)` — UUID v4 validation with typed assertion
- **Purpose**: Ensures rate-limit keys (tenantId) are well-formed UUIDs, preventing key injection attacks that could pollute rate-limiter state
- **Applied to**: `seo-tools.audit_site_seo`, `content-management` write operations

---

## Recommendations

### Immediate (P0)
1. ✅ **Done** — Add rate limiting helpers to `shared/middleware.ts`
2. ✅ **Done** — Apply rate limiting to high-traffic external-API tools
3. ✅ **Done** — Fix `create_content` TOCTOU race with atomic `O_EXCL` write

### Short-term (P1)
4. Add `Retry-After` HTTP header semantics to rate-limit error responses
5. Add circuit breaker pattern to `multi-tenant-orchestrator` for auth-gateway calls

### Long-term (P2)
6. Add knowledge-graph eviction policy (LRU with max 10,000 nodes)
7. Implement token-bucket algorithm for `marketing-analytics` to smooth burst traffic
8. Add health-check endpoints (`/health`) to all long-running MCP servers for Kubernetes liveness probes
