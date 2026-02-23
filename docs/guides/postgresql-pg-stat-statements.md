<!--
/**
 * @file postgresql-pg-stat-statements.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for postgresql pg stat statements.
 * @entrypoints docs/guides/postgresql-pg-stat-statements.md
 * @exports postgresql pg stat statements
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# PostgreSQL pg_stat_statements — Query Monitoring & Noisy Neighbor Detection

> **Version Reference:** PostgreSQL 14+ | pg_stat_statements 1.10+ | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for query performance monitoring, bottleneck identification, and
> multi-tenant noisy neighbor detection using pg_stat_statements.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Configuration](#installation--configuration)
3. [View Schema Reference](#view-schema-reference)
4. [Core Query Patterns](#core-query-patterns)
5. [Noisy Neighbor Detection](#noisy-neighbor-detection)
6. [Multi-Tenant Monitoring](#multi-tenant-monitoring)
7. [Performance Bottleneck Identification](#performance-bottleneck-identification)
8. [Index & Cache Analysis](#index--cache-analysis)
9. [Automated Alerting Queries](#automated-alerting-queries)
10. [pg_stat_statements vs pg_stat_monitor](#pg_stat_statements-vs-pg_stat_monitor)
11. [Maintenance & Lifecycle](#maintenance--lifecycle)
12. [Best Practices](#best-practices)

---

## Overview

`pg_stat_statements` is the **definitive PostgreSQL observability extension**, aggregating detailed
execution statistics for every unique SQL statement executed on the server. It normalizes query
text by replacing literal values with placeholders, enabling teams to identify systemic performance
patterns rather than one-off outliers.

**What it tracks:**

- Total and mean execution time (planning + execution)
- Call count per query pattern
- Row counts returned/affected
- Block I/O (shared, local, temp)
- WAL usage
- JIT compilation statistics (PostgreSQL 15+)

---

## Installation & Configuration

### Step 1: Enable the Extension

```sql
-- Add to postgresql.conf BEFORE starting PostgreSQL
-- shared_preload_libraries = 'pg_stat_statements'

-- Then create the extension:
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Step 2: Recommended postgresql.conf Settings

```ini
# Load the extension at startup
shared_preload_libraries = 'pg_stat_statements'

# Maximum number of query statements tracked (default 5000)
pg_stat_statements.max = 10000

# What to track: top (only top-level), all (including nested), none
pg_stat_statements.track = all

# Track utility commands (VACUUM, ANALYZE, etc.)
pg_stat_statements.track_utility = on

# Persist stats across server restarts
pg_stat_statements.save = on

# Enable per-query I/O timing (adds minor overhead but critical for I/O analysis)
track_io_timing = on

# Enable planning time tracking (PostgreSQL 13+)
track_planning = on
```

### Step 3: Verify Installation

```sql
SELECT * FROM pg_stat_statements LIMIT 1;

-- Check extension version
SELECT extversion FROM pg_extension WHERE extname = 'pg_stat_statements';
```

### Permissions

```sql
-- Grant read access to monitoring users (non-superuser)
GRANT pg_read_all_stats TO monitoring_user;

-- Or grant execute on the function directly
GRANT EXECUTE ON FUNCTION pg_stat_statements_reset() TO dba_role;
```

---

## View Schema Reference

Key columns in `pg_stat_statements` (PostgreSQL 14+):

| Column                | Type   | Description                                                 |
| --------------------- | ------ | ----------------------------------------------------------- |
| `userid`              | OID    | User who executed the query                                 |
| `dbid`                | OID    | Database where query was executed                           |
| `queryid`             | BIGINT | Stable hash identifier for query pattern                    |
| `query`               | TEXT   | Normalized query text (literals replaced with $1, $2...)    |
| `calls`               | BIGINT | Number of times query was executed                          |
| `total_exec_time`     | FLOAT8 | Total execution time (ms)                                   |
| `mean_exec_time`      | FLOAT8 | Average execution time (ms)                                 |
| `stddev_exec_time`    | FLOAT8 | Standard deviation of execution time                        |
| `min_exec_time`       | FLOAT8 | Minimum execution time (ms)                                 |
| `max_exec_time`       | FLOAT8 | Maximum execution time (ms)                                 |
| `total_plan_time`     | FLOAT8 | Total planning time (ms) — PG13+                            |
| `rows`                | BIGINT | Total rows retrieved or affected                            |
| `shared_blks_hit`     | BIGINT | Shared buffer cache hits                                    |
| `shared_blks_read`    | BIGINT | Blocks read from disk                                       |
| `shared_blks_written` | BIGINT | Blocks written                                              |
| `temp_blks_read`      | BIGINT | Temp block reads (indicates sort/hash spills)               |
| `temp_blks_written`   | BIGINT | Temp block writes                                           |
| `blk_read_time`       | FLOAT8 | Time spent reading blocks (ms) — requires `track_io_timing` |
| `blk_write_time`      | FLOAT8 | Time spent writing blocks (ms)                              |
| `wal_records`         | BIGINT | WAL records generated — PG13+                               |
| `wal_bytes`           | BIGINT | WAL bytes generated — PG13+                                 |
| `jit_functions`       | BIGINT | JIT compiled functions — PG15+                              |

---

## Core Query Patterns

### Top 10 Slowest Queries by Total Time

```sql
SELECT
  userid::regrole AS username,
  dbid::regdatabase AS database,
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(stddev_exec_time::numeric, 2) AS stddev_ms,
  round((total_exec_time / sum(total_exec_time) OVER ()) * 100, 2) AS pct_total,
  rows,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 5
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Top 10 by Mean Execution Time (Worst Single-Call Performance)

```sql
SELECT
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(max_exec_time::numeric, 2) AS max_ms,
  round(stddev_exec_time::numeric, 2) AS stddev_ms,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 10
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Most Frequently Called Queries

```sql
SELECT
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 4) AS avg_ms,
  rows,
  left(query, 120) AS query_preview
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

---

## Noisy Neighbor Detection

In multi-tenant environments, a "noisy neighbor" is a tenant consuming disproportionate
CPU, I/O, or memory. Use the following queries to identify and isolate them.

### Identify Resource-Heavy Sessions in Real Time

```sql
-- Combine pg_stat_activity with pg_stat_statements for live visibility
SELECT
  sa.pid,
  sa.usename,
  sa.application_name,
  sa.client_addr,
  sa.state,
  sa.wait_event_type,
  sa.wait_event,
  round(EXTRACT(EPOCH FROM (now() - sa.query_start)) * 1000) AS duration_ms,
  sa.query
FROM pg_stat_activity sa
WHERE sa.state = 'active'
  AND sa.query NOT LIKE '%pg_stat_activity%'
ORDER BY sa.query_start
LIMIT 20;
```

### Top CPU/Time Consumers by User

```sql
SELECT
  userid::regrole AS username,
  count(*) AS distinct_queries,
  sum(calls) AS total_calls,
  round(sum(total_exec_time)::numeric, 2) AS total_time_ms,
  round((sum(total_exec_time) / sum(sum(total_exec_time)) OVER ()) * 100, 2) AS pct_server_time
FROM pg_stat_statements
GROUP BY userid
ORDER BY total_time_ms DESC
LIMIT 20;
```

### Identify I/O-Heavy Tenants

```sql
-- High disk reads suggest missing indexes or inefficient queries
SELECT
  userid::regrole AS username,
  dbid::regdatabase AS database,
  sum(shared_blks_read) AS total_disk_reads,
  sum(shared_blks_hit) AS total_cache_hits,
  round(
    100.0 * sum(shared_blks_hit) /
    NULLIF(sum(shared_blks_hit) + sum(shared_blks_read), 0), 2
  ) AS cache_hit_pct,
  round(sum(blk_read_time)::numeric, 2) AS total_read_time_ms,
  left(query, 80) AS query_preview
FROM pg_stat_statements
GROUP BY userid, dbid, query
ORDER BY total_disk_reads DESC
LIMIT 20;
```

### Temp File Writers (Memory Pressure Detection)

```sql
-- High temp_blks_written = query is spilling to disk (sort/hash operations)
-- Indicates: insufficient work_mem, missing indexes, or massive result sets
SELECT
  userid::regrole AS username,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  temp_blks_written,
  round(temp_blks_written / NULLIF(calls, 0)::numeric, 0) AS temp_blks_per_call,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE temp_blks_written > 0
ORDER BY temp_blks_written DESC
LIMIT 20;
```

### High WAL Generators (Write-Heavy Tenants)

```sql
-- PostgreSQL 13+: identifies tenants generating excessive write load
SELECT
  userid::regrole AS username,
  dbid::regdatabase AS database,
  calls,
  wal_records,
  pg_size_pretty(wal_bytes) AS wal_size,
  round(wal_bytes::numeric / NULLIF(calls, 0), 0) AS wal_bytes_per_call,
  left(query, 80) AS query_preview
FROM pg_stat_statements
WHERE wal_bytes > 0
ORDER BY wal_bytes DESC
LIMIT 20;
```

---

## Multi-Tenant Monitoring

### Per-Database Resource Summary

```sql
SELECT
  dbid::regdatabase AS database,
  count(*) AS distinct_query_patterns,
  sum(calls) AS total_calls,
  round(sum(total_exec_time)::numeric, 0) AS total_exec_ms,
  round(sum(total_plan_time)::numeric, 0) AS total_plan_ms,
  sum(shared_blks_read) AS total_disk_reads,
  sum(shared_blks_hit) AS total_cache_hits,
  sum(temp_blks_written) AS total_temp_writes
FROM pg_stat_statements
GROUP BY dbid
ORDER BY total_exec_ms DESC;
```

### Application-Level Tenant Tagging

```sql
-- When application sets a session variable: SET app.tenant_id = 'acme-corp'
-- You can correlate via pg_stat_activity:
SELECT
  current_setting('app.tenant_id') AS tenant_id,
  sa.pid,
  sa.state,
  sa.query,
  ss.calls,
  ss.mean_exec_time
FROM pg_stat_activity sa
JOIN pg_stat_statements ss
  ON ss.queryid = hashtext(sa.query)  -- Approximate match
WHERE sa.state = 'active';
```

### Detect Runaway Queries

```sql
-- Queries with extremely high variance = inconsistent performance
SELECT
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(max_exec_time::numeric, 2) AS max_ms,
  round(stddev_exec_time::numeric, 2) AS stddev_ms,
  round(stddev_exec_time / NULLIF(mean_exec_time, 0), 2) AS coefficient_of_variation,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 10
  AND mean_exec_time > 100   -- Only queries taking >100ms on average
ORDER BY coefficient_of_variation DESC
LIMIT 20;
```

---

## Performance Bottleneck Identification

### Planning vs Execution Time Ratio

```sql
-- High planning time relative to execution = complex query structure
-- Consider: prepared statements, simplifying CTEs, reducing subqueries
SELECT
  calls,
  round(total_plan_time::numeric, 2) AS total_plan_ms,
  round(total_exec_time::numeric, 2) AS total_exec_ms,
  round(total_plan_time / NULLIF(total_exec_time + total_plan_time, 0) * 100, 1) AS plan_pct,
  round(mean_exec_time::numeric, 2) AS avg_exec_ms,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 100
  AND (total_plan_time + total_exec_time) > 10000  -- Total >10 seconds
ORDER BY plan_pct DESC
LIMIT 20;
```

### Missing Index Candidates

```sql
-- Queries with high disk reads per call and slow execution = likely missing index
SELECT
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(shared_blks_read::numeric / NULLIF(calls, 0), 0) AS reads_per_call,
  round(shared_blks_hit::numeric / NULLIF(calls, 0), 0) AS hits_per_call,
  round(
    100.0 * shared_blks_hit /
    NULLIF(shared_blks_hit + shared_blks_read, 0), 2
  ) AS cache_hit_pct,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 50
  AND mean_exec_time > 50  -- Slower than 50ms average
ORDER BY reads_per_call DESC
LIMIT 20;
```

### N+1 Query Detection

```sql
-- Very high call count relative to complexity = likely N+1 pattern
SELECT
  calls,
  round(mean_exec_time::numeric, 4) AS avg_ms,
  round(total_exec_time::numeric, 0) AS total_ms,
  rows / NULLIF(calls, 0) AS avg_rows_per_call,
  left(query, 120) AS query_preview
FROM pg_stat_statements
WHERE calls > 1000
  AND rows / NULLIF(calls, 0) < 5  -- Each call returns very few rows
  AND mean_exec_time > 1
ORDER BY total_exec_time DESC
LIMIT 20;
```

---

## Index & Cache Analysis

### Server-Wide Cache Hit Rate

```sql
-- Target: >99% cache hit rate; below 95% indicates need for more shared_buffers
SELECT
  sum(shared_blks_hit) AS total_cache_hits,
  sum(shared_blks_read) AS total_disk_reads,
  round(
    100.0 * sum(shared_blks_hit) /
    NULLIF(sum(shared_blks_hit) + sum(shared_blks_read), 0), 4
  ) AS cache_hit_pct
FROM pg_stat_statements;
```

### Table-Level I/O (Cross-Reference with pg_statio_user_tables)

```sql
-- Use alongside pg_statio_user_tables for table-level cache analysis
SELECT
  schemaname,
  tablename,
  heap_blks_read,
  heap_blks_hit,
  round(100.0 * heap_blks_hit / NULLIF(heap_blks_hit + heap_blks_read, 0), 2) AS cache_hit_pct,
  idx_blks_read,
  idx_blks_hit,
  round(100.0 * idx_blks_hit / NULLIF(idx_blks_hit + idx_blks_read, 0), 2) AS idx_cache_hit_pct
FROM pg_statio_user_tables
ORDER BY heap_blks_read DESC
LIMIT 20;
```

---

## Automated Alerting Queries

### Queries Exceeding SLA Threshold

```sql
-- Save as a monitoring job; alert if any query avg > 500ms with >100 calls
SELECT
  queryid,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(max_exec_time::numeric, 2) AS max_ms,
  left(query, 200) AS query_text
FROM pg_stat_statements
WHERE mean_exec_time > 500  -- 500ms threshold
  AND calls > 100
ORDER BY mean_exec_time DESC;
```

### New Slow Queries (Snapshot Comparison Pattern)

```sql
-- Save snapshots to a monitoring table for before/after comparison
CREATE TABLE IF NOT EXISTS query_stat_snapshots (
  snapshot_time  TIMESTAMPTZ DEFAULT now(),
  queryid        BIGINT,
  calls          BIGINT,
  total_exec_ms  FLOAT8,
  mean_exec_ms   FLOAT8,
  query_preview  TEXT
);

-- Capture snapshot
INSERT INTO query_stat_snapshots (queryid, calls, total_exec_ms, mean_exec_ms, query_preview)
SELECT queryid, calls, total_exec_time, mean_exec_time, left(query, 200)
FROM pg_stat_statements
WHERE calls > 10;

-- Compare snapshots (detect regressions)
SELECT
  curr.queryid,
  curr.mean_exec_ms - prev.mean_exec_ms AS regression_ms,
  round(((curr.mean_exec_ms - prev.mean_exec_ms) / NULLIF(prev.mean_exec_ms, 0)) * 100, 1) AS pct_regression,
  curr.calls - prev.calls AS new_calls,
  curr.query_preview
FROM query_stat_snapshots curr
JOIN query_stat_snapshots prev
  ON curr.queryid = prev.queryid
  AND prev.snapshot_time = (SELECT max(snapshot_time) FROM query_stat_snapshots WHERE snapshot_time < curr.snapshot_time)
WHERE curr.snapshot_time = (SELECT max(snapshot_time) FROM query_stat_snapshots)
  AND curr.mean_exec_ms > prev.mean_exec_ms * 1.5  -- >50% regression
ORDER BY regression_ms DESC;
```

---

## pg_stat_statements vs pg_stat_monitor

| Feature                        | pg_stat_statements | pg_stat_monitor (PGDG) |
| ------------------------------ | ------------------ | ---------------------- |
| Basic query stats              | ✅                 | ✅                     |
| Planning time tracking         | ✅ (PG13+)         | ✅                     |
| Histogram of response times    | ❌                 | ✅                     |
| Per-bucket time windows        | ❌                 | ✅                     |
| Query plan details             | ❌                 | ✅                     |
| Tables accessed per query      | ❌                 | ✅                     |
| Caller info (application name) | ❌                 | ✅                     |
| JIT stats                      | ✅ (PG15+)         | ✅                     |
| Setup complexity               | Low                | Medium                 |
| Overhead                       | Minimal            | Low                    |

> **Recommendation:** Use `pg_stat_statements` as baseline; add `pg_stat_monitor` for
> production multi-tenant environments requiring histogram and per-tenant bucket analysis.

---

## Maintenance & Lifecycle

### Reset Statistics

```sql
-- Reset ALL statistics (do during maintenance windows or after major deployments)
SELECT pg_stat_statements_reset();

-- Reset for a specific user only (PostgreSQL 14+)
SELECT pg_stat_statements_reset(userid) FROM pg_user WHERE usename = 'app_user';

-- Reset for a specific query ID
SELECT pg_stat_statements_reset(0, 0, queryid)
FROM pg_stat_statements
WHERE query LIKE '%problematic_table%'
LIMIT 1;
```

### Recommended Reset Schedule

```sql
-- Create a periodic reset procedure (run weekly via pg_cron)
CREATE OR REPLACE PROCEDURE reset_query_stats_weekly()
LANGUAGE plpgsql AS $$
BEGIN
  -- Archive top queries before reset
  INSERT INTO query_stat_snapshots (queryid, calls, total_exec_ms, mean_exec_ms, query_preview)
  SELECT queryid, calls, total_exec_time, mean_exec_time, left(query, 200)
  FROM pg_stat_statements
  WHERE calls > 100;

  -- Reset
  PERFORM pg_stat_statements_reset();
END;
$$;

-- Schedule with pg_cron (if installed)
SELECT cron.schedule('weekly-stats-reset', '0 3 * * 0', 'CALL reset_query_stats_weekly()');
```

---

## Best Practices

1. **Reset periodically** — Weekly or after major schema/code changes to keep data actionable
2. **Set `pg_stat_statements.max = 10000`** — Default 5000 fills up quickly in large apps
3. **Enable `track_io_timing = on`** — Essential for I/O bottleneck detection; minimal overhead
4. **Enable `track_planning = on`** (PG13+) — Identifies over-complex query structures
5. **Use `queryid` as a stable identifier** — It remains consistent even when parameters change
6. **Filter noise** — Exclude `pg_stat_statements` and monitoring queries from your own reports
7. **Save snapshots** before optimizations to measure improvement objectively
8. **Focus on `total_exec_time`** — A query called 10,000 times at 10ms > one call at 50ms
9. **Monitor `stddev_exec_time`** — High variance indicates inconsistent plans or data skew
10. **Combine with `pg_stat_activity`** — Real-time correlation of current load to historical patterns
11. **Alert on `temp_blks_written`** — Any significant value indicates work_mem pressure
12. **Cross-reference with `pg_statio_user_tables`** — Correlate query patterns with table I/O


--- 

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns


## Implementation

[Add content here]


## Testing

[Add content here]
