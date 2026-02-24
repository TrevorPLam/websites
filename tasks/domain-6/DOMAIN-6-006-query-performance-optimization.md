---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-006
title: 'Implement query performance optimization with pg_stat_statements'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'codex' # agent or human responsible
branch: feat/DOMAIN-6-006-query-performance-optimization
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-006 · Implement query performance optimization with pg_stat_statements

## Objective

Implement comprehensive query performance optimization using pg_stat_statements, automated query analysis, performance recommendations, slow query detection, and optimization dashboard for the marketing websites platform.

## Context

**Documentation Reference:**

- Connection Pooling Configuration: `docs/plan/domain-6/6.2-connection-pooling-configuration.md` ✅ **COMPLETED**
- Database Architecture: `docs/plan/domain-6/6.1-philosophy.md` ✅ **COMPLETED**
- Performance Engineering: `docs/plan/domain-5/5.6-core-web-vitals-optimization.md` ✅ **COMPLETED**

**Current Status:** Basic database connection exists. Missing query performance optimization and analysis.

**Codebase area:** `packages/database/src/query-optimizer.ts` — Query performance optimization system

**Related files:** `packages/database/src/client.ts`, `packages/database/src/health-monitor.ts`, performance dashboard

**Dependencies:** PostgreSQL pg_stat_statements extension, Supabase analytics, Tinybird for metrics

**Prior work:** Basic connection pooling implemented with health monitoring

**Constraints:** Must not impact query performance; optimization should be automatic

**2026 Standards Compliance:**

- Real-time query performance monitoring
- Automated optimization recommendations
- Slow query detection and alerting
- Query execution plan analysis
- Performance trend analysis

## Tech Stack

| Layer                | Technology                              |
| -------------------- | --------------------------------------- |
| Query Analysis       | PostgreSQL pg_stat_statements           |
| Performance Tracking | Custom query performance collector      |
| Optimization         | Automated index recommendations         |
| Dashboard            | Next.js 16 with real-time query metrics |
| Analytics            | Tinybird for query performance trends   |
| Alerting             | Upstash QStash for slow query alerts    |

## Acceptance Criteria

- [ ] **[Agent]** Enable and configure pg_stat_statements extension
- [ ] **[Agent]** Implement query performance tracking system
- [ ] **[Agent]** Create slow query detection and alerting
- [ ] **[Agent]** Add automated optimization recommendations
- [ ] **[Agent]** Implement query execution plan analysis
- [ ] **[Agent]** Create query performance dashboard
- [ ] **[Agent]** Add performance trend analysis
- [ ] **[Agent]** Implement query caching recommendations
- [ ] **[Agent]** Create query optimization API endpoints
- [ ] **[Agent]** Add comprehensive query performance documentation
- [ ] **[Agent]** Create test suite for query optimization
- [ ] **[Human]** Verify query optimization improves performance

## Implementation Plan

- [ ] **[Agent]** **Enable pg_stat_statements** — Configure extension and tracking
- [ ] **[Agent]** **Create query collector** — Implement query performance data collection
- [ ] **[Agent]** **Add slow query detection** — Identify and alert on slow queries
- [ ] **[Agent]** **Implement optimization engine** — Create automated recommendations
- [ ] **[Agent]** **Build performance dashboard** — Create query metrics visualization
- [ ] **[Agent]** **Add execution plan analysis** — Analyze query execution plans
- [ ] **[Agent]** **Implement trend analysis** — Track performance over time
- [ ] **[Agent]** **Create API endpoints** — Add query optimization APIs
- [ ] **[Agent]** **Add documentation** — Document optimization features
- [ ] **[Agent]** **Create comprehensive tests** — Test all optimization features
- [ ] **[Human]** **Validate performance improvements** — Verify optimization effectiveness

> ⚠️ **Agent Question**: Ask human before proceeding if optimization affects existing queries.

## Commands

```bash
# Enable pg_stat_statements extension
psql -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

# Test query performance tracking
pnpm test:query-performance

# Check slow queries
curl http://localhost:3000/api/query-performance/slow

# Get optimization recommendations
curl http://localhost:3000/api/query-performance/recommendations

# View query performance dashboard
pnpm dev
```

## Code Style

```typescript
// ✅ Correct — Query performance optimization implementation
import { createClient } from '@supabase/supabase-js';
import { tinybird } from '@repo/analytics/tinybird';

// ============================================================================
// QUERY PERFORMANCE TYPES
// ============================================================================

export interface QueryPerformanceMetrics {
  query: string;
  calls: number;
  total_exec_time: number;
  mean_exec_time: number;
  rows: number;
  shared_blks_hit: number;
  shared_blks_read: number;
  local_blks_hit: number;
  local_blks_read: number;
  temp_blks_read: number;
  temp_blks_written: number;
  blk_read_time: number;
  blk_write_time: number;
}

export interface SlowQuery {
  id: string;
  query: string;
  execution_time: number;
  timestamp: string;
  tenant_id?: string;
  user_id?: string;
  plan?: QueryExecutionPlan;
  recommendations: string[];
}

export interface QueryExecutionPlan {
  cost: number;
  rows: number;
  width: number;
  actual_time: number;
  actual_rows: number;
  actual_loops: number;
  nodes: ExecutionPlanNode[];
}

export interface OptimizationRecommendation {
  type: 'index' | 'query_rewrite' | 'partition' | 'cache';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  query: string;
  recommendation: string;
  estimated_improvement: number; // percentage
}

// ============================================================================
// QUERY PERFORMANCE OPTIMIZER
// ============================================================================

export class QueryPerformanceOptimizer {
  private supabase: ReturnType<typeof createClient>;
  private slowQueryThreshold = 1000; // 1 second
  private optimizationCache = new Map<string, OptimizationRecommendation[]>();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async enablePgStatStatements(): Promise<void> {
    // Enable pg_stat_statements extension
    await this.supabase.rpc('enable_pg_stat_statements');

    // Configure tracking parameters
    await this.supabase.rpc('configure_pg_stat_statements', {
      track: 'all',
      max: 10000,
      save: true,
    });
  }

  async collectQueryMetrics(): Promise<QueryPerformanceMetrics[]> {
    const { data } = await this.supabase
      .from('pg_stat_statements')
      .select('*')
      .order('mean_exec_time', { ascending: false })
      .limit(100);

    return data || [];
  }

  async detectSlowQueries(): Promise<SlowQuery[]> {
    const metrics = await this.collectQueryMetrics();
    const slowQueries: SlowQuery[] = [];

    for (const metric of metrics) {
      if (metric.mean_exec_time > this.slowQueryThreshold) {
        const recommendations = await this.generateRecommendations(metric.query);

        slowQueries.push({
          id: crypto.randomUUID(),
          query: metric.query,
          execution_time: metric.mean_exec_time,
          timestamp: new Date().toISOString(),
          recommendations,
        });
      }
    }

    // Store slow queries for analysis
    await this.storeSlowQueries(slowQueries);

    return slowQueries;
  }

  async generateRecommendations(query: string): Promise<OptimizationRecommendation[]> {
    // Check cache first
    const cacheKey = this.hashQuery(query);
    if (this.optimizationCache.has(cacheKey)) {
      return this.optimizationCache.get(cacheKey)!;
    }

    const recommendations: OptimizationRecommendation[] = [];

    // Analyze query for optimization opportunities
    const analysis = await this.analyzeQuery(query);

    // Check for missing indexes
    if (analysis.missingIndexes.length > 0) {
      recommendations.push({
        type: 'index',
        priority: 'high',
        description: 'Missing index detected',
        impact: 'Reduce query execution time by 50-90%',
        query,
        recommendation: `CREATE INDEX CONCURRENTLY idx_${analysis.table}_${analysis.column} ON ${analysis.table}(${analysis.column});`,
        estimated_improvement: 75,
      });
    }

    // Check for query rewrite opportunities
    if (analysis.canBeOptimized) {
      recommendations.push({
        type: 'query_rewrite',
        priority: 'medium',
        description: 'Query can be rewritten for better performance',
        impact: 'Reduce query complexity and execution time',
        query,
        recommendation: analysis.optimizedQuery,
        estimated_improvement: 40,
      });
    }

    // Check for partitioning opportunities
    if (analysis.shouldPartition) {
      recommendations.push({
        type: 'partition',
        priority: 'low',
        description: 'Table partitioning recommended',
        impact: 'Improve query performance on large tables',
        query,
        recommendation: `PARTITION TABLE ${analysis.table} BY ${analysis.partitionColumn};`,
        estimated_improvement: 60,
      });
    }

    // Cache recommendations
    this.optimizationCache.set(cacheKey, recommendations);

    return recommendations;
  }

  async analyzeQuery(query: string): Promise<QueryAnalysis> {
    // Get query execution plan
    const { data: planData } = await this.supabase.rpc('explain_query', { query_text: query });

    const plan = this.parseExecutionPlan(planData);

    // Analyze for optimization opportunities
    const analysis: QueryAnalysis = {
      query,
      table: this.extractTable(query),
      column: this.extractColumn(query),
      cost: plan.cost,
      rows: plan.rows,
      missingIndexes: this.findMissingIndexes(plan),
      canBeOptimized: this.canOptimizeQuery(query),
      optimizedQuery: this.optimizeQuery(query),
      shouldPartition: plan.rows > 1000000,
      partitionColumn: this.suggestPartitionColumn(query),
    };

    return analysis;
  }

  async getExecutionPlan(query: string): Promise<QueryExecutionPlan> {
    const { data } = await this.supabase.rpc('explain_query', {
      query_text: query,
      analyze: true,
      format: 'json',
    });

    return this.parseExecutionPlan(data);
  }

  async optimizeQuery(query: string): Promise<string> {
    let optimized = query;

    // Remove unnecessary subqueries
    optimized = this.removeUnnecessarySubqueries(optimized);

    // Optimize JOIN order
    optimized = this.optimizeJoinOrder(optimized);

    // Add appropriate LIMIT clauses
    optimized = this.addLimitClauses(optimized);

    // Optimize WHERE conditions
    optimized = this.optimizeWhereConditions(optimized);

    return optimized;
  }

  async getPerformanceTrends(timeRange: '1h' | '24h' | '7d' | '30d'): Promise<PerformanceTrend[]> {
    const endTime = new Date();
    const startTime = new Date();

    switch (timeRange) {
      case '1h':
        startTime.setHours(startTime.getHours() - 1);
        break;
      case '24h':
        startTime.setDate(startTime.getDate() - 1);
        break;
      case '7d':
        startTime.setDate(startTime.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(startTime.getDate() - 30);
        break;
    }

    // Get performance data from Tinybird
    const trends = await tinybird.query(`
      SELECT 
        timestamp,
        AVG(mean_exec_time) as avg_execution_time,
        COUNT(*) as query_count,
        AVG(rows) as avg_rows
      FROM query_performance_metrics 
      WHERE timestamp >= toDateTime('${startTime.toISOString()}')
        AND timestamp <= toDateTime('${endTime.toISOString()}')
      GROUP BY timestamp
      ORDER BY timestamp
    `);

    return trends.data || [];
  }

  // Helper methods
  private hashQuery(query: string): string {
    return Buffer.from(query).toString('base64').slice(0, 16);
  }

  private parseExecutionPlan(data: any): QueryExecutionPlan {
    // Parse PostgreSQL execution plan JSON
    return {
      cost: data['Execution Plan'][0].Plan['Total Cost'],
      rows: data['Execution Plan'][0].Plan['Plan Rows'],
      width: data['Execution Plan'][0].Plan['Plan Width'],
      actual_time: data['Execution Plan'][0].Plan['Actual Total Time'],
      actual_rows: data['Execution Plan'][0].Plan['Actual Rows'],
      actual_loops: data['Execution Plan'][0].Plan['Actual Loops'],
      nodes: this.parsePlanNodes(data['Execution Plan'][0].Plan),
    };
  }

  private parsePlanNodes(plan: any): ExecutionPlanNode[] {
    // Parse execution plan nodes recursively
    const nodes: ExecutionPlanNode[] = [];

    const node: ExecutionPlanNode = {
      type: plan['Node Type'],
      cost: plan['Total Cost'],
      rows: plan['Plan Rows'],
      width: plan['Plan Width'],
      actual_time: plan['Actual Total Time'],
      actual_rows: plan['Actual Rows'],
      actual_loops: plan['Actual Loops'],
    };

    nodes.push(node);

    if (plan['Plans']) {
      for (const subPlan of plan['Plans']) {
        nodes.push(...this.parsePlanNodes(subPlan));
      }
    }

    return nodes;
  }

  private extractTable(query: string): string {
    const match = query.match(/FROM\s+(\w+)/i);
    return match ? match[1] : '';
  }

  private extractColumn(query: string): string {
    const match = query.match(/WHERE\s+(\w+)\s*=/i);
    return match ? match[1] : '';
  }

  private findMissingIndexes(plan: QueryExecutionPlan): string[] {
    const missingIndexes: string[] = [];

    // Look for sequential scans that could benefit from indexes
    for (const node of plan.nodes) {
      if (node.type === 'Seq Scan' && node.rows > 1000) {
        missingIndexes.push(`${node.type}_index`);
      }
    }

    return missingIndexes;
  }

  private canOptimizeQuery(query: string): boolean {
    // Check if query can be optimized
    return (
      query.includes('SELECT *') || // Avoid SELECT *
      (query.includes('ORDER BY') && !query.includes('LIMIT')) || // ORDER BY without LIMIT
      (query.includes('LIKE') && !query.includes('ILIKE')) // Case-sensitive LIKE
    );
  }

  private removeUnnecessarySubqueries(query: string): string {
    // Remove unnecessary subqueries and optimize
    return query.replace(/\(SELECT \* FROM (\w+) WHERE id = .+\)/g, '$1');
  }

  private optimizeJoinOrder(query: string): string {
    // Optimize JOIN order based on table sizes
    // This is a simplified implementation
    return query;
  }

  private addLimitClauses(query: string): string {
    // Add LIMIT clauses where appropriate
    if (!query.includes('LIMIT') && query.includes('ORDER BY')) {
      return `${query} LIMIT 100`;
    }
    return query;
  }

  private optimizeWhereConditions(query: string): string {
    // Optimize WHERE conditions
    return query.replace(/WHERE\s+(\w+)\s*=\s*'([^']+)'/g, 'WHERE $1 = $2');
  }

  private suggestPartitionColumn(query: string): string {
    // Suggest partition column based on query patterns
    if (query.includes('created_at')) return 'created_at';
    if (query.includes('updated_at')) return 'updated_at';
    if (query.includes('tenant_id')) return 'tenant_id';
    return 'id';
  }

  private async storeSlowQueries(slowQueries: SlowQuery[]): Promise<void> {
    // Store slow queries in Tinybird for analysis
    await tinybird.insert(
      'slow_queries',
      slowQueries.map((q) => ({
        id: q.id,
        query: q.query,
        execution_time: q.execution_time,
        timestamp: q.timestamp,
        recommendations_count: q.recommendations.length,
      }))
    );
  }
}

// ============================================================================
// QUERY PERFORMANCE OPTIMIZER INSTANCE
// ============================================================================

export const queryOptimizer = new QueryPerformanceOptimizer();

// ============================================================================
// API ENDPOINTS
// ============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'metrics':
        const metrics = await queryOptimizer.collectQueryMetrics();
        return Response.json({ status: 'ok', data: metrics });

      case 'slow':
        const slowQueries = await queryOptimizer.detectSlowQueries();
        return Response.json({ status: 'ok', data: slowQueries });

      case 'recommendations':
        const query = searchParams.get('query');
        if (!query) {
          return Response.json({ error: 'Query parameter required' }, { status: 400 });
        }
        const recommendations = await queryOptimizer.generateRecommendations(query);
        return Response.json({ status: 'ok', data: recommendations });

      case 'trends':
        const timeRange = (searchParams.get('range') as '1h' | '24h' | '7d' | '30d') || '24h';
        const trends = await queryOptimizer.getPerformanceTrends(timeRange);
        return Response.json({ status: 'ok', data: trends });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Query performance optimization failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

**Query optimization principles:**

- Automatic performance monitoring without manual intervention
- Proactive slow query detection and alerting
- Data-driven optimization recommendations
- Real-time performance trend analysis
- Minimal impact on existing query performance

## Boundaries

| Tier             | Scope                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Monitor all query performance; provide optimization recommendations; detect slow queries; maintain < 1% overhead       |
| ⚠️ **Ask first** | Modifying existing queries; changing database schema; adding indexes; altering query structure                         |
| 🚫 **Never**     | Impact application performance; ignore slow queries; modify production data without review; bypass optimization system |

## Success Verification

- [ ] **[Agent]** Enable pg_stat_statements — extension active and tracking
- [ ] **[Agent]** Test query metrics collection — performance data accurate
- [ ] **[Agent]** Test slow query detection — slow queries identified
- [ ] **[Agent]** Test optimization recommendations — recommendations valid
- [ ] **[Agent]** Test execution plan analysis — plans parsed correctly
- [ ] **[Agent]** Test performance dashboard — real-time metrics working
- [ ] **[Agent]** Test trend analysis — performance trends accurate
- [ ] **[Agent]** Test API endpoints — all endpoints responding
- [ ] **[Agent]** Run performance tests — optimization overhead < 1%
- [ ] **[Human]** Validate performance improvements — queries faster after optimization
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Query Privacy**: Ensure sensitive query data is properly anonymized
- **Performance Overhead**: Keep monitoring overhead to minimum
- **False Positives**: Avoid flagging complex but necessary queries
- **Index Recommendations**: Validate index suggestions before implementation
- **Plan Caching**: Account for PostgreSQL plan caching in analysis
- **Multi-tenant Isolation**: Ensure query analysis respects tenant boundaries

## Out of Scope

- Application-level performance monitoring
- Database server optimization
- Network performance analysis
- Frontend query optimization
- Hardware performance tuning

## References

- [PostgreSQL pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [Query Performance Analysis](https://www.postgresql.org/docs/current/sql-explain.html)
- [Database Optimization Best Practices](https://www.postgresql.org/docs/current/performance-tips.html)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)
- [Query Optimization Techniques](https://www.postgresql.org/docs/current/sql-optimize.html)
