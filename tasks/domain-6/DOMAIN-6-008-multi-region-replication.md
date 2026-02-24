---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-008
title: 'Implement multi-region data replication and failover'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'codex' # agent or human responsible
branch: feat/DOMAIN-6-008-multi-region-replication
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-008 · Implement multi-region data replication and failover

## Objective

Implement comprehensive multi-region data replication with automatic failover, read replica routing, conflict resolution, replication monitoring, and disaster recovery for the marketing websites platform.

## Context

**Documentation Reference:**

- Connection Pooling Configuration: `docs/plan/domain-6/6.2-connection-pooling-configuration.md` ✅ **COMPLETED**
- Database Architecture: `docs/plan/domain-6/6.1-philosophy.md` ✅ **COMPLETED**
- Multi-Tenant Architecture: `docs/plan/domain-7/7.1-philosophy.md` ✅ **COMPLETED**

**Current Status:** Basic database exists. Missing multi-region replication and failover.

**Codebase area:** `packages/database/src/multi-region-replication.ts` — Multi-region replication system

**Related files:** `packages/database/src/client.ts`, `packages/database/src/health-monitor.ts`, replication dashboard

**Dependencies:** Supabase multi-region support, Upstash Redis for failover coordination, monitoring system

**Prior work:** Basic connection pooling and health monitoring implemented

**Constraints:** Must maintain data consistency; failover must be transparent

**2026 Standards Compliance:**

- Multi-region data replication with automatic failover
- Read replica routing for performance optimization
- Conflict resolution for multi-master replication
- Replication lag monitoring and alerting
- Geographic data proximity for users

## Tech Stack

| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| Replication         | Supabase multi-region replication       |
| Failover            | Automatic failover with health checks   |
| Routing             | Geographic read replica routing         |
| Monitoring          | Replication lag and status monitoring   |
| Conflict Resolution | Multi-master conflict resolution        |
| Coordination        | Upstash Redis for failover coordination |

## Acceptance Criteria

- [ ] **[Agent]** Implement multi-region database replication
- [ ] **[Agent]** Create automatic failover system with health checks
- [ ] **[Agent]** Add geographic read replica routing
- [ ] **[Agent]** Implement replication lag monitoring
- [ ] **[Agent]** Create conflict resolution for multi-master
- [ ] **[Agent]** Add replication status dashboard
- [ ] **[Agent]** Implement disaster recovery procedures
- [ ] **[Agent]** Create replication performance monitoring
- [ ] **[Agent]** Add data consistency verification
- [ ] **[Agent]** Create replication API endpoints
- [ ] **[Agent]** Add comprehensive replication documentation
- [ ] **[Agent]** Create test suite for replication scenarios
- [ ] **[Human]** Verify replication provides reliable failover

## Implementation Plan

- [ ] **[Agent]** **Create replication manager** — Implement multi-region replication
- [ ] **[Agent]** **Add failover system** — Implement automatic failover with health checks
- [ ] **[Agent]** **Create read routing** — Implement geographic read replica routing
- [ ] **[Agent]** **Add lag monitoring** — Implement replication lag tracking
- [ ] **[Agent]** **Implement conflict resolution** — Create multi-master conflict handling
- [ ] **[Agent]** **Build replication dashboard** — Create replication status visualization
- [ ] **[Agent]** **Add consistency checks** — Implement data consistency verification
- [ ] **[Agent]** **Create API endpoints** — Add replication management APIs
- [ ] **[Agent]** **Add documentation** — Document replication procedures
- [ ] **[Agent]** **Create comprehensive tests** — Test all replication scenarios
- [ ] **[Human]** **Validate failover reliability** — Verify failover works correctly

> ⚠️ **Agent Question**: Ask human before proceeding if replication affects production performance.

## Commands

```bash
# Test replication setup
pnpm test:replication

# Manual failover test
pnpm replication:test-failover

# Check replication status
curl http://localhost:3000/api/replication/status

# Monitor replication lag
curl http://localhost:3000/api/replication/lag

# View replication dashboard
pnpm dev
```

## Code Style

```typescript
// ✅ Correct — Multi-region replication implementation
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { tinybird } from '@repo/analytics/tinybird';

// ============================================================================
// MULTI-REGION REPLICATION TYPES
// ============================================================================

export interface Region {
  id: string;
  name: string;
  endpoint: string;
  isPrimary: boolean;
  isHealthy: boolean;
  lag: number; // replication lag in seconds
  lastHealthCheck: string;
}

export interface ReplicationConfig {
  primaryRegion: string;
  replicaRegions: string[];
  failoverThreshold: number; // seconds
  healthCheckInterval: number; // seconds
  consistencyLevel: 'eventual' | 'strong';
}

export interface ReplicationStatus {
  primaryRegion: string;
  regions: Region[];
  overallHealth: 'healthy' | 'degraded' | 'failed';
  lastFailover?: string;
  replicationLag: number;
}

export interface ConflictResolution {
  type: 'last-write-wins' | 'merge' | 'manual';
  timestamp: string;
  region: string;
  data: any;
  resolution: any;
}

// ============================================================================
// MULTI-REGION REPLICATION MANAGER
// ============================================================================

export class MultiRegionReplicationManager {
  private redis: Redis;
  private config: ReplicationConfig;
  private regions: Map<string, Region> = new Map();
  private healthCheckInterval: NodeJS.Timeout;

  constructor() {
    this.redis = Redis.fromEnv();
    this.config = {
      primaryRegion: process.env.PRIMARY_REGION || 'us-east-1',
      replicaRegions: (process.env.REPLICA_REGIONS || '').split(','),
      failoverThreshold: 30, // 30 seconds
      healthCheckInterval: 10, // 10 seconds
      consistencyLevel: 'eventual',
    };

    this.initializeRegions();
    this.startHealthChecks();
  }

  private initializeRegions(): void {
    // Initialize primary region
    this.regions.set(this.config.primaryRegion, {
      id: this.config.primaryRegion,
      name: this.getRegionName(this.config.primaryRegion),
      endpoint: this.getRegionEndpoint(this.config.primaryRegion),
      isPrimary: true,
      isHealthy: true,
      lag: 0,
      lastHealthCheck: new Date().toISOString(),
    });

    // Initialize replica regions
    for (const regionId of this.config.replicaRegions) {
      this.regions.set(regionId, {
        id: regionId,
        name: this.getRegionName(regionId),
        endpoint: this.getRegionEndpoint(regionId),
        isPrimary: false,
        isHealthy: true,
        lag: 0,
        lastHealthCheck: new Date().toISOString(),
      });
    }
  }

  async getReplicationStatus(): Promise<ReplicationStatus> {
    const regions = Array.from(this.regions.values());
    const primaryRegion = regions.find((r) => r.isPrimary);

    if (!primaryRegion) {
      throw new Error('No primary region found');
    }

    const overallHealth = this.calculateOverallHealth(regions);
    const replicationLag = Math.max(...regions.map((r) => r.lag));

    return {
      primaryRegion: primaryRegion.id,
      regions,
      overallHealth,
      replicationLag,
    };
  }

  async promoteToPrimary(regionId: string): Promise<void> {
    const region = this.regions.get(regionId);

    if (!region) {
      throw new Error(`Region ${regionId} not found`);
    }

    if (!region.isHealthy) {
      throw new Error(`Region ${regionId} is not healthy`);
    }

    try {
      // Demote current primary
      const currentPrimary = Array.from(this.regions.values()).find((r) => r.isPrimary);
      if (currentPrimary) {
        await this.demotePrimary(currentPrimary.id);
      }

      // Promote new primary
      await this.promoteRegion(regionId);

      // Update configuration
      this.config.primaryRegion = regionId;
      await this.updateConfiguration();

      // Log failover event
      await this.logFailoverEvent(regionId);
    } catch (error) {
      throw new Error(`Failed to promote region ${regionId} to primary: ${error}`);
    }
  }

  async routeToOptimalRegion(queryType: 'read' | 'write'): Promise<string> {
    if (queryType === 'write') {
      // Always route writes to primary
      const primary = Array.from(this.regions.values()).find((r) => r.isPrimary);
      if (!primary || !primary.isHealthy) {
        throw new Error('No healthy primary region available');
      }
      return primary.id;
    }

    // Route reads to nearest healthy replica
    const healthyReplicas = Array.from(this.regions.values())
      .filter((r) => !r.isPrimary && r.isHealthy)
      .sort((a, b) => a.lag - b.lag); // Prefer replicas with lower lag

    if (healthyReplicas.length === 0) {
      // Fallback to primary if no healthy replicas
      const primary = Array.from(this.regions.values()).find((r) => r.isPrimary);
      if (!primary || !primary.isHealthy) {
        throw new Error('No healthy regions available');
      }
      return primary.id;
    }

    return healthyReplicas[0].id;
  }

  async getRegionClient(regionId: string) {
    const region = this.regions.get(regionId);

    if (!region) {
      throw new Error(`Region ${regionId} not found`);
    }

    if (!region.isHealthy) {
      throw new Error(`Region ${regionId} is not healthy`);
    }

    return createClient(region.endpoint, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  async checkReplicationConsistency(): Promise<boolean> {
    const primaryRegion = Array.from(this.regions.values()).find((r) => r.isPrimary);

    if (!primaryRegion) {
      return false;
    }

    const primaryClient = await this.getRegionClient(primaryRegion.id);

    // Get primary data checksum
    const { data: primaryChecksum } = await primaryClient
      .from('data_consistency')
      .select('checksum')
      .eq('region', primaryRegion.id)
      .single();

    // Check replica consistency
    for (const [regionId, region] of this.regions.entries()) {
      if (region.isPrimary || !region.isHealthy) continue;

      try {
        const replicaClient = await this.getRegionClient(regionId);
        const { data: replicaChecksum } = await replicaClient
          .from('data_consistency')
          .select('checksum')
          .eq('region', regionId)
          .single();

        if (primaryChecksum?.checksum !== replicaChecksum?.checksum) {
          await this.logConsistencyIssue(
            regionId,
            primaryChecksum?.checksum,
            replicaChecksum?.checksum
          );
          return false;
        }
      } catch (error) {
        await this.logConsistencyError(regionId, error);
        return false;
      }
    }

    return true;
  }

  async resolveConflict(conflictData: ConflictResolution): Promise<void> {
    switch (conflictData.type) {
      case 'last-write-wins':
        await this.resolveLastWriteWins(conflictData);
        break;
      case 'merge':
        await this.resolveMerge(conflictData);
        break;
      case 'manual':
        await this.resolveManual(conflictData);
        break;
    }

    await this.logConflictResolution(conflictData);
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheckInterval * 1000);
  }

  private async performHealthChecks(): Promise<void> {
    for (const [regionId, region] of this.regions.entries()) {
      try {
        const client = await this.getRegionClient(regionId);
        const startTime = Date.now();

        // Simple health check
        await client.from('health_check').select('timestamp').single();

        const responseTime = Date.now() - startTime;

        // Update region health
        region.isHealthy = true;
        region.lastHealthCheck = new Date().toISOString();

        // Update replication lag for replicas
        if (!region.isPrimary) {
          region.lag = await this.measureReplicationLag(regionId);
        }

        // Store health metrics
        await this.storeHealthMetrics(regionId, responseTime, region.lag);
      } catch (error) {
        region.isHealthy = false;
        region.lastHealthCheck = new Date().toISOString();

        await this.logHealthCheckFailure(regionId, error);

        // Check if failover is needed
        if (region.isPrimary && !region.isHealthy) {
          await this.initiateFailover();
        }
      }
    }
  }

  private async measureReplicationLag(regionId: string): Promise<number> {
    const primaryRegion = Array.from(this.regions.values()).find((r) => r.isPrimary);

    if (!primaryRegion) {
      return 0;
    }

    try {
      const primaryClient = await this.getRegionClient(primaryRegion.id);
      const replicaClient = await this.getRegionClient(regionId);

      // Get primary timestamp
      const { data: primaryData } = await primaryClient
        .from('replication_lag_test')
        .select('timestamp')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // Get replica timestamp
      const { data: replicaData } = await replicaClient
        .from('replication_lag_test')
        .select('timestamp')
        .eq('timestamp', primaryData?.timestamp)
        .single();

      if (!replicaData) {
        return this.config.failoverThreshold; // Assume max lag if not found
      }

      const primaryTime = new Date(primaryData.timestamp).getTime();
      const replicaTime = new Date(replicaData.timestamp).getTime();

      return (primaryTime - replicaTime) / 1000; // Convert to seconds
    } catch (error) {
      return this.config.failoverThreshold;
    }
  }

  private async initiateFailover(): Promise<void> {
    const healthyReplicas = Array.from(this.regions.values())
      .filter((r) => !r.isPrimary && r.isHealthy)
      .sort((a, b) => a.lag - b.lag);

    if (healthyReplicas.length === 0) {
      await this.logFailoverFailure('No healthy replicas available');
      return;
    }

    const newPrimary = healthyReplicas[0];

    try {
      await this.promoteToPrimary(newPrimary.id);
      await this.logSuccessfulFailover(newPrimary.id);
    } catch (error) {
      await this.logFailoverFailure(`Failed to promote ${newPrimary.id}: ${error}`);
    }
  }

  private calculateOverallHealth(regions: Region[]): 'healthy' | 'degraded' | 'failed' {
    const primary = regions.find((r) => r.isPrimary);

    if (!primary || !primary.isHealthy) {
      return 'failed';
    }

    const healthyReplicas = regions.filter((r) => !r.isPrimary && r.isHealthy);

    if (healthyReplicas.length === 0) {
      return 'degraded';
    }

    const maxLag = Math.max(...regions.map((r) => r.lag));

    if (maxLag > this.config.failoverThreshold) {
      return 'degraded';
    }

    return 'healthy';
  }

  private async demotePrimary(regionId: string): Promise<void> {
    const region = this.regions.get(regionId);
    if (region) {
      region.isPrimary = false;
      // Implementation would involve database-specific commands
    }
  }

  private async promoteRegion(regionId: string): Promise<void> {
    const region = this.regions.get(regionId);
    if (region) {
      region.isPrimary = true;
      // Implementation would involve database-specific commands
    }
  }

  private async updateConfiguration(): Promise<void> {
    await this.redis.setex(
      'replication:config',
      3600, // 1 hour cache
      JSON.stringify(this.config)
    );
  }

  private async logFailoverEvent(regionId: string): Promise<void> {
    await tinybird.insert('replication_failovers', [
      {
        timestamp: new Date().toISOString(),
        old_primary: this.config.primaryRegion,
        new_primary: regionId,
        reason: 'automatic_failover',
      },
    ]);
  }

  private async logConsistencyIssue(
    regionId: string,
    primaryChecksum: string,
    replicaChecksum: string
  ): Promise<void> {
    await tinybird.insert('replication_consistency_issues', [
      {
        timestamp: new Date().toISOString(),
        region: regionId,
        primary_checksum: primaryChecksum,
        replica_checksum: replicaChecksum,
      },
    ]);
  }

  private async logHealthCheckFailure(regionId: string, error: any): Promise<void> {
    await tinybird.insert('replication_health_failures', [
      {
        timestamp: new Date().toISOString(),
        region: regionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    ]);
  }

  private async storeHealthMetrics(
    regionId: string,
    responseTime: number,
    lag: number
  ): Promise<void> {
    await tinybird.insert('replication_health_metrics', [
      {
        timestamp: new Date().toISOString(),
        region: regionId,
        response_time: responseTime,
        replication_lag: lag,
      },
    ]);
  }

  private getRegionName(regionId: string): string {
    const names: Record<string, string> = {
      'us-east-1': 'US East',
      'us-west-2': 'US West',
      'eu-west-1': 'Europe',
      'ap-southeast-1': 'Asia Pacific',
    };
    return names[regionId] || regionId;
  }

  private getRegionEndpoint(regionId: string): string {
    const endpoints: Record<string, string> = {
      'us-east-1': process.env.SUPABASE_URL_EAST!,
      'us-west-2': process.env.SUPABASE_URL_WEST!,
      'eu-west-1': process.env.SUPABASE_URL_EUROPE!,
      'ap-southeast-1': process.env.SUPABASE_URL_ASIA!,
    };
    return endpoints[regionId] || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  }

  private async resolveLastWriteWins(conflict: ConflictResolution): Promise<void> {
    // Implementation for last-write-wins conflict resolution
  }

  private async resolveMerge(conflict: ConflictResolution): Promise<void> {
    // Implementation for merge conflict resolution
  }

  private async resolveManual(conflict: ConflictResolution): Promise<void> {
    // Implementation for manual conflict resolution
  }

  private async logConflictResolution(conflict: ConflictResolution): Promise<void> {
    await tinybird.insert('replication_conflict_resolutions', [
      {
        timestamp: conflict.timestamp,
        type: conflict.type,
        region: conflict.region,
        resolution: conflict.resolution,
      },
    ]);
  }

  private async logSuccessfulFailover(regionId: string): Promise<void> {
    await tinybird.insert('replication_failover_success', [
      {
        timestamp: new Date().toISOString(),
        new_primary: regionId,
      },
    ]);
  }

  private async logFailoverFailure(reason: string): Promise<void> {
    await tinybird.insert('replication_failover_failures', [
      {
        timestamp: new Date().toISOString(),
        reason,
      },
    ]);
  }

  private async logConsistencyError(regionId: string, error: any): Promise<void> {
    await tinybird.insert('replication_consistency_errors', [
      {
        timestamp: new Date().toISOString(),
        region: regionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    ]);
  }
}

// ============================================================================
// MULTI-REGION REPLICATION MANAGER INSTANCE
// ============================================================================

export const replicationManager = new MultiRegionReplicationManager();

// ============================================================================
// API ENDPOINTS
// ============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'status':
        const status = await replicationManager.getReplicationStatus();
        return Response.json({ status: 'ok', data: status });

      case 'health':
        const healthy = await replicationManager.checkReplicationConsistency();
        return Response.json({ status: 'ok', data: { healthy } });

      case 'route':
        const queryType = (searchParams.get('type') as 'read' | 'write') || 'read';
        const region = await replicationManager.routeToOptimalRegion(queryType);
        return Response.json({ status: 'ok', data: { region } });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Replication operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'failover':
        const regionId = searchParams.get('region');
        if (!regionId) {
          return Response.json({ error: 'Region ID required' }, { status: 400 });
        }
        await replicationManager.promoteToPrimary(regionId);
        return Response.json({ status: 'ok', message: 'Failover initiated' });

      case 'resolve-conflict':
        const conflictData = await request.json();
        await replicationManager.resolveConflict(conflictData);
        return Response.json({ status: 'ok', message: 'Conflict resolved' });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Replication operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

**Multi-region replication principles:**

- Automatic failover ensures high availability
- Geographic routing reduces latency for users
- Replication lag monitoring prevents stale data
- Conflict resolution maintains data consistency
- Health checks ensure system reliability

## Boundaries

| Tier             | Scope                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Monitor replication health; route queries optimally; handle failover automatically; maintain data consistency            |
| ⚠️ **Ask first** | Changing replication topology; modifying failover thresholds; altering consistency levels; changing region configuration |
| 🚫 **Never**     | Ignore replication lag; bypass health checks; allow split-brain scenarios; compromise data consistency                   |

## Success Verification

- [ ] **[Agent]** Test replication setup — multi-region replication active
- [ ] **[Agent]** Test health monitoring — region health tracked
- [ ] **[Agent]** Test automatic failover — failover works correctly
- [ ] **[Agent]** Test read routing — queries routed optimally
- [ ] **[Agent]** Test lag monitoring — replication lag tracked
- [ ] **[Agent]** Test conflict resolution — conflicts resolved
- [ ] **[Agent]** Test consistency checks — data consistency verified
- [ ] **[Agent]** Test API endpoints — all endpoints responding
- [ ] **[Agent]** Run performance tests — replication overhead < 5%
- [ ] **[Human]** Validate failover reliability — system remains available
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Network Partitions**: Handle split-brain scenarios carefully
- **Replication Lag**: Account for lag in consistency requirements
- **Failover Timing**: Ensure failover happens quickly but safely
- **Data Conflicts**: Implement robust conflict resolution
- **Region Health**: Monitor all regions continuously
- **Consistency Levels**: Choose appropriate consistency for use cases

## Out of Scope

- Global database sharding
- Cross-region data migration
- Multi-cloud replication
- Database server configuration
- Network infrastructure management

## References

- [Supabase Multi-Region](https://supabase.com/docs/guides/platform/multi-region)
- [PostgreSQL Replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Database Failover Strategies](https://www.postgresql.org/docs/current/failover.html)
- [Conflict Resolution Patterns](<https://en.wikipedia.org/wiki/Conflict_(computer_science)>)
- [Geographic Routing](https://aws.amazon.com/route53/)
