---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-005
title: 'Implement database connection health monitoring and alerting'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'codex' # agent or human responsible
branch: feat/DOMAIN-6-005-database-health-monitoring
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-005 · Implement database connection health monitoring and alerting

## Objective

Implement comprehensive database connection health monitoring with real-time metrics, automated alerting, connection pool monitoring, query performance tracking, and dashboard visualization for the marketing websites platform.

## Context

**Documentation Reference:**

- Connection Pooling Configuration: `docs/plan/domain-6/6.2-connection-pooling-configuration.md` ✅ **COMPLETED**
- PgBouncer/Supavisor Integration: `docs/plan/domain-6/6.3-pgbouncer-supavisor-connection-pooling.md` ✅ **COMPLETED**
- Database Architecture: `docs/plan/domain-6/6.1-philosophy.md` ✅ **COMPLETED**

**Current Status:** Connection pooling infrastructure exists. Missing comprehensive health monitoring and alerting.

**Codebase area:** `packages/database/src/health-monitor.ts` — Database health monitoring system

**Related files:** `packages/database/src/client.ts`, `packages/database/src/connection-pool.ts`, monitoring dashboard

**Dependencies:** Supabase health endpoints, Upstash Redis for caching, Tinybird for analytics

**Prior work:** Basic connection pooling implemented with Supavisor

**Constraints:** Must not impact database performance; monitoring should be lightweight

**2026 Standards Compliance:**

- Real-time health metrics with sub-second updates
- Automated alerting with Slack/Email integration
- Connection pool optimization recommendations
- Query performance trend analysis
- Multi-region health monitoring

## Tech Stack

| Layer             | Technology                                 |
| ----------------- | ------------------------------------------ |
| Health Monitoring | Supabase health endpoints + custom metrics |
| Alerting          | Upstash QStash + Slack/Email integration   |
| Metrics Storage   | Tinybird for time-series analytics         |
| Dashboard         | Next.js 16 with real-time updates          |
| Caching           | Upstash Redis for health status cache      |
| Notifications     | Webhook-based alerting system              |

## Acceptance Criteria

- [ ] **[Agent]** Implement database health monitoring with connection pool metrics
- [ ] **[Agent]** Add real-time health status tracking with sub-second updates
- [ ] **[Agent]** Create automated alerting system for health degradation
- [ ] **[Agent]** Implement connection pool performance monitoring
- [ ] **[Agent]** Add query performance trend analysis
- [ ] **[Agent]** Create health dashboard with real-time visualization
- [ ] **[Agent]** Implement health status caching with Redis
- [ ] **[Agent]** Add multi-region health monitoring
- [ ] **[Agent]** Create health check API endpoints
- [ ] **[Agent]** Implement health metrics export for monitoring tools
- [ ] **[Agent]** Add health monitoring documentation
- [ ] **[Agent]** Create comprehensive test suite for health monitoring
- [ ] **[Human]** Verify health monitoring provides accurate real-time metrics

## Implementation Plan

- [ ] **[Agent]** **Create health monitoring core** — Implement base health monitoring system
- [ ] **[Agent]** **Add connection pool metrics** — Monitor pool size, active connections, wait times
- [ ] **[Agent]** **Implement query performance tracking** — Track slow queries and optimization opportunities
- [ ] **[Agent]** **Create alerting system** — Implement threshold-based alerting with notifications
- [ ] **[Agent]** **Build health dashboard** — Create real-time dashboard with health metrics
- [ ] **[Agent]** **Add caching layer** — Implement Redis caching for health status
- [ ] **[Agent]** **Create API endpoints** — Add health check endpoints for monitoring tools
- [ ] **[Agent]** **Implement multi-region monitoring** — Monitor all database regions
- [ ] **[Agent]** **Add metrics export** — Export metrics for external monitoring tools
- [ ] **[Agent]** **Create documentation** — Document health monitoring setup and usage
- [ ] **[Agent]** **Add comprehensive tests** — Test all health monitoring scenarios
- [ ] **[Human]** **Validate monitoring accuracy** — Verify health metrics accuracy

> ⚠️ **Agent Question**: Ask human before proceeding if health monitoring impacts database performance.

## Commands

```bash
# Test health monitoring in development
pnpm dev

# Check database health status
curl http://localhost:3000/api/health/database

# Test health monitoring alerts
pnpm test:health-monitoring

# Build health monitoring dashboard
pnpm build:dashboard

# Test health metrics export
curl http://localhost:3000/api/health/metrics
```

## Code Style

```typescript
// ✅ Correct — Comprehensive health monitoring implementation
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { tinybird } from '@repo/analytics/tinybird';

// ============================================================================
// HEALTH METRICS TYPES
// ============================================================================

export interface DatabaseHealthMetrics {
  timestamp: string;
  connectionPool: {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    waitingClients: number;
    averageWaitTime: number;
    maxWaitTime: number;
  };
  queryPerformance: {
    averageQueryTime: number;
    slowQueries: number;
    totalQueries: number;
    errorRate: number;
  };
  database: {
    size: number;
    activeConnections: number;
    maxConnections: number;
    cacheHitRatio: number;
  };
  region: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
}

export interface HealthAlert {
  id: string;
  type: 'connection_pool' | 'query_performance' | 'database_size' | 'region_health';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metrics: Partial<DatabaseHealthMetrics>;
  timestamp: string;
  resolved: boolean;
}

// ============================================================================
// HEALTH MONITORING CLASS
// ============================================================================

export class DatabaseHealthMonitor {
  private redis: Redis;
  private supabase: ReturnType<typeof createClient>;
  private alertThresholds = {
    connectionPoolUtilization: 0.8,
    averageQueryTime: 1000, // ms
    slowQueryRate: 0.05,
    errorRate: 0.01,
    databaseSizeGrowth: 0.1, // 10% per day
  };

  constructor() {
    this.redis = Redis.fromEnv();
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async collectHealthMetrics(): Promise<DatabaseHealthMetrics> {
    const timestamp = new Date().toISOString();

    // Collect connection pool metrics
    const connectionPool = await this.getConnectionPoolMetrics();

    // Collect query performance metrics
    const queryPerformance = await this.getQueryPerformanceMetrics();

    // Collect database metrics
    const database = await this.getDatabaseMetrics();

    // Determine overall health status
    const status = this.calculateHealthStatus({
      connectionPool,
      queryPerformance,
      database,
    });

    const metrics: DatabaseHealthMetrics = {
      timestamp,
      connectionPool,
      queryPerformance,
      database,
      region: process.env.SUPABASE_REGION || 'us-east-1',
      status,
    };

    // Cache metrics for dashboard
    await this.cacheMetrics(metrics);

    // Store metrics in Tinybird for analytics
    await this.storeMetrics(metrics);

    // Check for alerts
    await this.checkAlerts(metrics);

    return metrics;
  }

  private async getConnectionPoolMetrics() {
    // Get connection pool metrics from Supabase
    const { data } = await this.supabase
      .from('pg_stat_activity')
      .select('count(*) as total_connections, state')
      .eq('datname', 'postgres');

    const totalConnections = data?.[0]?.total_connections || 0;
    const activeConnections = data?.filter((d) => d.state === 'active').length || 0;

    return {
      totalConnections,
      activeConnections,
      idleConnections: totalConnections - activeConnections,
      waitingClients: 0, // Would need custom implementation
      averageWaitTime: 0, // Would need custom implementation
      maxWaitTime: 0, // Would need custom implementation
    };
  }

  private async getQueryPerformanceMetrics() {
    // Get query performance metrics from pg_stat_statements
    const { data } = await this.supabase
      .from('pg_stat_statements')
      .select('calls, total_exec_time, rows')
      .order('total_exec_time', { ascending: false })
      .limit(100);

    const totalQueries = data?.reduce((sum, stat) => sum + stat.calls, 0) || 0;
    const totalTime = data?.reduce((sum, stat) => sum + stat.total_exec_time, 0) || 0;
    const averageQueryTime = totalQueries > 0 ? totalTime / totalQueries : 0;

    const slowQueries =
      data?.filter((stat) => stat.total_exec_time / stat.calls > 1000).length || 0;

    return {
      averageQueryTime,
      slowQueries,
      totalQueries,
      errorRate: 0, // Would need custom error tracking
    };
  }

  private async getDatabaseMetrics() {
    // Get database size and connection metrics
    const { data: sizeData } = await this.supabase
      .from('pg_database')
      .select('pg_size_pretty(pg_database_size(current_database())) as size')
      .single();

    const { data: connData } = await this.supabase
      .from('pg_settings')
      .select('setting')
      .eq('name', 'max_connections')
      .single();

    return {
      size: this.parseDatabaseSize(sizeData?.size || '0 MB'),
      activeConnections: await this.getActiveConnections(),
      maxConnections: parseInt(connData?.setting || '100'),
      cacheHitRatio: await this.getCacheHitRatio(),
    };
  }

  private calculateHealthStatus(
    metrics: Partial<DatabaseHealthMetrics>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const { connectionPool, queryPerformance, database } = metrics;

    // Check connection pool utilization
    const poolUtilization = connectionPool?.totalConnections / database?.maxConnections;
    if (poolUtilization > this.alertThresholds.connectionPoolUtilization) {
      return 'unhealthy';
    }

    // Check query performance
    if (queryPerformance?.averageQueryTime > this.alertThresholds.averageQueryTime) {
      return 'degraded';
    }

    // Check error rate
    if (queryPerformance?.errorRate > this.alertThresholds.errorRate) {
      return 'unhealthy';
    }

    return 'healthy';
  }

  private async checkAlerts(metrics: DatabaseHealthMetrics) {
    const alerts: HealthAlert[] = [];

    // Check connection pool alerts
    const poolUtilization =
      metrics.connectionPool.totalConnections / metrics.database.maxConnections;
    if (poolUtilization > this.alertThresholds.connectionPoolUtilization) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'connection_pool',
        severity: 'high',
        message: `Connection pool utilization at ${(poolUtilization * 100).toFixed(1)}%`,
        metrics: { connectionPool: metrics.connectionPool },
        timestamp: metrics.timestamp,
        resolved: false,
      });
    }

    // Check query performance alerts
    if (metrics.queryPerformance.averageQueryTime > this.alertThresholds.averageQueryTime) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'query_performance',
        severity: 'medium',
        message: `Average query time at ${metrics.queryPerformance.averageQueryTime.toFixed(1)}ms`,
        metrics: { queryPerformance: metrics.queryPerformance },
        timestamp: metrics.timestamp,
        resolved: false,
      });
    }

    // Send alerts if any
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }
  }

  private async sendAlerts(alerts: HealthAlert[]) {
    // Send alerts to Slack/Email via QStash
    for (const alert of alerts) {
      await fetch('https://q.stash.upstash.com/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.UPSTASH_QSTASH_TOKEN}`,
        },
        body: JSON.stringify({
          type: 'database_health',
          alert,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }

  private async cacheMetrics(metrics: DatabaseHealthMetrics) {
    // Cache latest metrics for dashboard
    await this.redis.setex(
      'database:health:latest',
      60, // 1 minute cache
      JSON.stringify(metrics)
    );
  }

  private async storeMetrics(metrics: DatabaseHealthMetrics) {
    // Store metrics in Tinybird for analytics
    await tinybird.insert('database_health_metrics', [
      {
        timestamp: metrics.timestamp,
        connection_pool_utilization:
          metrics.connectionPool.totalConnections / metrics.database.maxConnections,
        average_query_time: metrics.queryPerformance.averageQueryTime,
        slow_queries: metrics.queryPerformance.slowQueries,
        database_size: metrics.database.size,
        status: metrics.status,
        region: metrics.region,
      },
    ]);
  }

  // Helper methods
  private parseDatabaseSize(sizeStr: string): number {
    const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*(MB|GB|TB)/);
    if (!match) return 0;

    const [, size, unit] = match;
    const multiplier = unit === 'MB' ? 1 : unit === 'GB' ? 1024 : 1024 * 1024;
    return parseFloat(size) * multiplier;
  }

  private async getActiveConnections(): Promise<number> {
    const { data } = await this.supabase
      .from('pg_stat_activity')
      .select('count(*)')
      .eq('state', 'active')
      .single();

    return data?.count || 0;
  }

  private async getCacheHitRatio(): Promise<number> {
    const { data } = await this.supabase
      .from('pg_stat_database')
      .select('blks_hit, blks_read')
      .eq('datname', 'postgres')
      .single();

    if (!data || data.blks_hit + data.blks_read === 0) return 0;
    return data.blks_hit / (data.blks_hit + data.blks_read);
  }
}

// ============================================================================
// HEALTH MONITORING INSTANCE
// ============================================================================

export const healthMonitor = new DatabaseHealthMonitor();

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

export async function GET() {
  try {
    const metrics = await healthMonitor.collectHealthMetrics();

    return Response.json({
      status: 'ok',
      data: metrics,
    });
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

**Health monitoring principles:**

- Real-time metrics collection without performance impact
- Automated alerting for proactive issue detection
- Historical trend analysis for optimization
- Multi-region monitoring for global deployments
- Integration with existing monitoring tools

## Boundaries

| Tier             | Scope                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Monitor all database connections; track query performance; send alerts for issues; maintain performance impact < 1%   |
| ⚠️ **Ask first** | Changing alert thresholds; modifying monitoring frequency; adding new metrics; changing alert destinations            |
| 🚫 **Never**     | Impact database performance; expose sensitive metrics publicly; ignore critical health issues; bypass alerting system |

## Success Verification

- [ ] **[Agent]** Run health monitoring — metrics collected successfully
- [ ] **[Agent]** Test connection pool monitoring — pool metrics accurate
- [ ] **[Agent]** Test query performance tracking — slow queries identified
- [ ] **[Agent]** Test alerting system — alerts sent for threshold breaches
- [ ] **[Agent]** Test health dashboard — real-time updates working
- [ ] **[Agent]** Test caching — health status cached properly
- [ ] **[Agent]** Test API endpoints — health checks responding correctly
- [ ] **[Agent]** Test multi-region monitoring — all regions monitored
- [ ] **[Agent]** Run performance tests — monitoring impact < 1%
- [ ] **[Human]** Validate monitoring accuracy — metrics match database reality
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Database Connection Limits**: Health monitoring should not consume significant connections
- **Metric Collection Overhead**: Keep monitoring queries lightweight and efficient
- **Alert Fatigue**: Configure appropriate thresholds to avoid false positives
- **Multi-Region Latency**: Account for network latency in health checks
- **Cache Invalidation**: Ensure cached metrics expire appropriately
- **Error Handling**: Health monitoring should not fail the application

## Out of Scope

- Application performance monitoring (separate system)
- Infrastructure monitoring (servers, networks)
- User experience monitoring
- Business metrics tracking
- Advanced predictive analytics

## References

- [Supabase Health Endpoints](https://supabase.com/docs/guides/platform/health-checks)
- [PostgreSQL pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [Upstash QStash Documentation](https://upstash.com/docs/qstash)
- [Tinybird Analytics](https://www.tinybird.co/)
- [Database Monitoring Best Practices](https://www.pganalyze.com/)
