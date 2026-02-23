# reversibility-principles.md

## Overview

This Architecture Decision Record (ADR) establishes the principles and patterns for designing reversible systems within our monorepo. Reversibility is the ability to safely undo changes, rollback features, and recover from failures without compromising system stability or user experience.

## Context

In modern SaaS development, the ability to quickly and safely reverse decisions is critical for:

- **Risk Mitigation**: Reducing the blast radius of failed deployments
- **Continuous Delivery**: Enabling rapid iteration while maintaining stability
- **Customer Experience**: Minimizing disruption from problematic changes
- **Operational Resilience**: Ensuring systems can recover from failures gracefully

Traditional deployment patterns (big bang releases, manual rollbacks) are insufficient for modern SaaS platforms requiring 99.99% uptime and continuous delivery.

## Decision

We will implement a comprehensive reversibility framework based on the following principles:

### 1. Feature Flag-First Development

All non-trivial features must be gated behind feature flags before production deployment.

```typescript
// Example: Feature flag implementation
interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: FlagCondition[];
}

class FeatureService {
  isEnabled(flag: string, context: UserContext): boolean {
    const config = this.getFlagConfig(flag);
    if (!config.enabled) return false;

    // Percentage-based rollout
    if (config.rolloutPercentage) {
      return this.hashUserId(context.userId) % 100 < config.rolloutPercentage;
    }

    // Condition-based targeting
    if (config.conditions) {
      return this.evaluateConditions(config.conditions, context);
    }

    return true;
  }
}
```

### 2. Progressive Delivery Framework

Implement ring-based deployment with automated rollback triggers:

```typescript
// Ring deployment configuration
interface RingConfig {
  name: string;
  percentage: number;
  duration: number; // minutes
  metrics: MetricGate[];
  rollbackThresholds: RollbackThreshold[];
}

const deploymentRings: RingConfig[] = [
  {
    name: 'internal',
    percentage: 1,
    duration: 30,
    metrics: [{ type: 'error_rate', threshold: 0.01 }],
    rollbackThresholds: [{ type: 'error_rate', threshold: 0.05 }],
  },
  {
    name: 'beta',
    percentage: 10,
    duration: 60,
    metrics: [{ type: 'error_rate', threshold: 0.01 }],
    rollbackThresholds: [{ type: 'error_rate', threshold: 0.03 }],
  },
  {
    name: 'production',
    percentage: 100,
    duration: 120,
    metrics: [{ type: 'error_rate', threshold: 0.005 }],
    rollbackThresholds: [{ type: 'error_rate', threshold: 0.02 }],
  },
];
```

### 3. Database Schema Reversibility

All database changes must be reversible without data loss:

```sql
-- Example: Reversible database migration
-- Migration: 20260223_add_user_preferences.sql

-- Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- Step 2: Backfill data in batches
UPDATE users
SET preferences = COALESCE(
  jsonb_build_object(
    'theme', legacy_theme,
    'notifications', legacy_notifications
  ),
  '{}'
)
WHERE preferences IS NULL;

-- Step 3: Add constraint (after backfill complete)
ALTER TABLE users
ALTER COLUMN preferences SET NOT NULL;

-- Rollback script included
-- DROP COLUMN IF EXISTS preferences;
```

### 4. API Versioning Strategy

Maintain backward compatibility through API versioning:

```typescript
// API versioning with graceful degradation
interface APIVersion {
  version: string;
  deprecated?: boolean;
  sunsetDate?: Date;
  migrationPath?: string;
}

class APIRouter {
  route(request: Request, version: string): Response {
    const handler = this.getHandler(request.path, version);

    if (!handler) {
      // Fallback to latest stable version
      return this.getHandler(request.path, 'v1')(request);
    }

    return handler(request);
  }

  private getHandler(path: string, version: string): Handler | null {
    const handlers = {
      v1: this.v1Handlers,
      v2: this.v2Handlers,
      v3: this.v3Handlers,
    };

    return handlers[version]?.[path] || null;
  }
}
```

### 5. Configuration Management

Separate configuration from code with environment-specific overrides:

```typescript
// Configuration with rollback capability
interface ServiceConfig {
  version: string;
  features: Record<string, boolean>;
  externalServices: ExternalServiceConfig[];
  rollbackConfig?: RollbackConfig;
}

interface RollbackConfig {
  previousVersion: string;
  rollbackTimeout: number; // milliseconds
  healthCheckEndpoint: string;
  rollbackTriggers: string[];
}

class ConfigManager {
  async applyConfig(config: ServiceConfig): Promise<void> {
    // Store previous config for rollback
    const previousConfig = await this.getCurrentConfig();

    try {
      await this.validateConfig(config);
      await this.deployConfig(config);
      await this.healthCheck(config);

      // Store rollback configuration
      await this.saveRollbackConfig({
        previousVersion: previousConfig.version,
        rollbackTimeout: 300000, // 5 minutes
        healthCheckEndpoint: '/health',
        rollbackTriggers: ['error_rate > 0.05', 'response_time > 1000'],
      });
    } catch (error) {
      await this.rollbackToConfig(previousConfig);
      throw error;
    }
  }
}
```

## Implementation Guidelines

### Feature Flag Lifecycle

1. **Creation**: Each flag must have:
   - Clear purpose and success criteria
   - Assigned owner and expiration date
   - Documentation of rollback plan

2. **Testing**: Both flag states must be tested:

   ```typescript
   describe('Feature Flag Tests', () => {
     it('works when flag is enabled', async () => {
       await withFeatureFlag('new-feature', true, async () => {
         // Test enabled behavior
       });
     });

     it('works when flag is disabled', async () => {
       await withFeatureFlag('new-feature', false, async () => {
         // Test disabled behavior
       });
     });
   });
   ```

3. **Rollout**: Use progressive delivery with monitoring

4. **Cleanup**: Remove flags within 90 days of stabilization

### Rollback Procedures

1. **Automated Rollbacks**:
   - Monitor key metrics during deployment
   - Auto-rollback on threshold breaches
   - Alert on rollback events

2. **Manual Rollbacks**:
   - Documented runbook for each service
   - Rollback verification steps
   - Post-rollback incident analysis

3. **Database Rollbacks**:
   - Always include rollback scripts
   - Test rollback procedures in staging
   - Use blue-green database deployments for critical changes

### Monitoring and Alerting

```typescript
// Reversibility monitoring
interface ReversibilityMetrics {
  featureFlagHealth: {
    activeFlags: number;
    expiredFlags: number;
    orphanedFlags: number;
  };
  deploymentHealth: {
    rollbackRate: number;
    rollbackSuccessRate: number;
    meanTimeToRecovery: number;
  };
  configurationHealth: {
    configDrift: number;
    rollbackConfigAge: number;
  };
}

class ReversibilityMonitor {
  async checkFeatureFlagHealth(): Promise<void> {
    const flags = await this.getAllFlags();
    const expiredFlags = flags.filter((f) => f.expirationDate < new Date());

    if (expiredFlags.length > 0) {
      await this.alert('expired-flags', {
        count: expiredFlags.length,
        flags: expiredFlags.map((f) => f.key),
      });
    }
  }

  async checkDeploymentHealth(): Promise<void> {
    const deployments = await this.getRecentDeployments();
    const rollbackRate = deployments.filter((d) => d.rolledBack).length / deployments.length;

    if (rollbackRate > 0.1) {
      // 10% rollback rate threshold
      await this.alert('high-rollback-rate', { rate: rollbackRate });
    }
  }
}
```

## Consequences

### Positive

- **Reduced Deployment Risk**: Features can be disabled instantly if issues arise
- **Faster Recovery**: Automated rollbacks reduce mean time to recovery
- **Increased Confidence**: Teams can deploy more frequently with safety nets
- **Better Customer Experience**: Minimized disruption from failed changes

### Negative

- **Increased Complexity**: Additional infrastructure and code complexity
- **Performance Overhead**: Feature flag evaluation in hot paths
- **Testing Burden**: Need to test multiple code paths
- **Maintenance Overhead**: Flag lifecycle management requires discipline

### Mitigation Strategies

- Implement feature flag performance monitoring
- Use automated flag cleanup tools
- Establish clear flag governance policies
- Provide developer tooling for flag management

## Compliance Requirements

This ADR ensures compliance with:

- **SRE Best Practices**: Error budget management and rapid recovery
- **DevOps Principles**: Continuous delivery with safety mechanisms
- **Security Standards**: Quick rollback of compromised features
- **Regulatory Requirements**: Ability to disable non-compliant features immediately

## References

- [Feature Flags Best Practices: Complete Guide (2026) | DesignRevision](https://designrevision.com/blog/feature-flags-best-practices)
- [Progressive Delivery: The Rollout Framework | DesignRevision](https://designrevision.com/blog/feature-flags-best-practices#progressive-delivery-the-rollout-framework)
- [Google SRE Workbook: Managing Risk](https://sre.google/workbook/managing-risk/)
- [GitHub Actions: Deployment Strategies](https://docs.github.com/en/actions/deployment)
- [LaunchDarkly: Feature Flag Governance](https://docs.launchdarkly.com/home/governance)
- [AWS Database Migration Service: Schema Conversion](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.SchemaConversion.html)
- [API Versioning Best Practices | Microsoft](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)

---

**Status**: Accepted  
**Date**: 2026-02-23  
**Author**: Architecture Team  
**Reviewers**: SRE Team, Security Team, Product Team
