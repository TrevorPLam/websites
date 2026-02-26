---
title: System Architecture Guide
description: Complete system architecture patterns and decision-making framework for multi-tenant SaaS applications
last_updated: 2026-02-26
tags: [#architecture #patterns #fsd #multi-tenant #decisions]
estimated_read_time: 60 minutes
difficulty: advanced
---

# System Architecture Guide

## Overview

Comprehensive system architecture guide for multi-tenant SaaS applications using Feature-Sliced Design 2.1, Next.js 16, and modern architectural patterns. This guide consolidates architectural decisions, design patterns, and implementation strategies.

## Key Features

- **Feature-Sliced Design 2.1**: Scalable layer architecture with strict isolation
- **Multi-Tenant SaaS**: Enterprise-grade tenant isolation and scalability
- **Architecture Decision Records**: Systematic decision documentation
- **2026 Standards Compliance**: Latest patterns and best practices
- **Production-Ready Patterns**: Battle-tested architectural solutions

---

## 🏗️ Feature-Sliced Design Architecture

### Layer Hierarchy

```
app/           ← App-level setup (providers, routing, layouts)
pages/         ← Full pages composed of widgets/features
widgets/       ← Composite blocks (SiteCard, TenantHeader)
features/      ← User interactions (CreateSite, UpdateBilling)
entities/      ← Business entities (Tenant, User, Site)
shared/        ← Utilities, UI primitives, constants
```

### Package-Level Implementation

```typescript
// packages/shared/entities/index.ts
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'professional' | 'enterprise';
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: Permission[];
}

// packages/features/site-management/index.ts
export { SiteCreationForm } from './ui/SiteCreationForm';
export { siteCreationAction } from './api/site-creation';
export { siteValidationSchema } from './lib/validation';

// packages/widgets/site-dashboard/index.ts
export { SiteDashboard } from './ui/SiteDashboard';
export { SiteMetrics } from './ui/SiteMetrics';
export { SiteActions } from './ui/SiteActions';
```

### Cross-Slice Communication

```typescript
// Using @x notation for cross-slice imports
import { TenantContext } from '@x/entities/tenant';
import { SiteCreationForm } from '@x/features/site-management';
import { SiteDashboard } from '@x/widgets/site-dashboard';

// Proper layer isolation
export function SiteManagementPage() {
  return (
    <TenantContext>
      <SiteCreationForm />
      <SiteDashboard />
    </TenantContext>
  );
}
```

---

## 📋 Architecture Decision Records (ADRs)

### ADR Template

```markdown
# ADR-XXX: [Decision Title]

Date: YYYY-MM-DD

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Background and problem statement]

## Decision
[The decision we made]

## Consequences
[Results of applying this decision]

## Implementation
[How we implemented it]
```

### Key ADR Examples

#### ADR-001: Adopt Next.js 16 with App Router

**Context**: Need modern framework with Server Components and performance optimization.

**Decision**: Use Next.js 16 as primary framework with App Router architecture.

**Consequences**: 
- ✅ Server Components by default
- ✅ Improved performance with PPR
- ✅ Better developer experience
- ❌ Learning curve for team

#### ADR-002: Multi-Tenant Architecture Pattern

**Context**: Support multiple clients with isolated data and configurations.

**Decision**: Implement tenant isolation at database and application levels.

**Consequences**:
- ✅ Scalable multi-tenancy
- ✅ Data security and isolation
- ❌ Increased complexity
- ❌ Performance overhead

#### ADR-003: Feature-Sliced Design Implementation

**Context**: Need scalable code organization for large team.

**Decision**: Adopt FSD 2.1 with strict layer isolation.

**Consequences**:
- ✅ Clear separation of concerns
- ✅ Improved maintainability
- ❌ Initial learning curve
- ❌ More boilerplate code

---

## 🏢 Multi-Tenant SaaS Architecture

### Tenant Isolation Strategies

#### Database-Level Isolation

```typescript
// Row Level Security (RLS) Implementation
CREATE POLICY tenant_isolation ON sites
  FOR ALL
  TO authenticated_users
  USING (tenant_id = current_setting('app.current_tenant_id'));

// Application-level tenant context
export function getTenantContext(): TenantContext {
  const tenantId = getCurrentTenantId();
  return {
    tenantId,
    isolation: 'row_level',
    cacheKey: `tenant:${tenantId}`,
  };
}
```

#### Application-Level Isolation

```typescript
// Tenant-aware data access
export class TenantAwareRepository<T> {
  constructor(
    private baseRepository: Repository<T>,
    private tenantContext: TenantContext
  ) {}

  async find(id: string): Promise<T | null> {
    return this.baseRepository.findOne({
      where: { id, tenantId: this.tenantContext.tenantId }
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.baseRepository.create({
      ...data,
      tenantId: this.tenantContext.tenantId
    });
  }
}
```

### Tenant Resolution Patterns

```typescript
// Multi-strategy tenant resolution
export class TenantResolver {
  async resolve(request: NextRequest): Promise<Tenant> {
    // Priority: Custom domain > Subdomain > Path > Header
    const strategies = [
      new CustomDomainStrategy(),
      new SubdomainStrategy(),
      new PathStrategy(),
      new HeaderStrategy()
    ];

    for (const strategy of strategies) {
      const tenant = await strategy.resolve(request);
      if (tenant) return tenant;
    }

    throw new Error('Unable to resolve tenant');
  }
}
```

---

## 🔄 System Design Patterns

### CQRS Pattern

```typescript
// Command Query Responsibility Segregation
interface Command<T> {
  type: string;
  payload: T;
}

interface Query<T> {
  type: string;
  params: Record<string, any>;
  resolve: () => Promise<T>;
}

// Command handler
export class CommandBus {
  async execute<T>(command: Command<T>): Promise<void> {
    const handler = this.getHandler(command.type);
    await handler.handle(command.payload);
  }
}

// Query handler
export class QueryBus {
  async execute<T>(query: Query<T>): Promise<T> {
    return query.resolve();
  }
}
```

### Event-Driven Architecture

```typescript
// Domain events
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  payload: any;
  timestamp: Date;
}

// Event bus
export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(handler => handler.handle(event)));
  }

  subscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }
}
```

### Repository Pattern

```typescript
// Generic repository interface
export interface Repository<T> {
  find(id: string): Promise<T | null>;
  findMany(filter: Filter<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Concrete implementation
export class SiteRepository implements Repository<Site> {
  constructor(private db: Database) {}

  async find(id: string): Promise<Site | null> {
    return this.db.site.findUnique({ where: { id } });
  }

  async create(data: CreateSiteData): Promise<Site> {
    return this.db.site.create({ data });
  }

  // ... other methods
}
```

---

## 🔧 Component Architecture

### Server Components Pattern

```typescript
// Server Component (default)
export async function SiteList({ tenantId }: { tenantId: string }) {
  const sites = await getSitesByTenant(tenantId);
  
  return (
    <div className="site-list">
      {sites.map(site => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}

// Client Component (interactive)
'use client';

export function SiteCard({ site }: { site: Site }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="site-card">
      <h3>{site.name}</h3>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && <SiteDetails site={site} />}
    </div>
  );
}
```

### Composite Widget Pattern

```typescript
// Widget composition
export function SiteDashboard({ siteId }: { siteId: string }) {
  return (
    <div className="site-dashboard">
      <SiteHeader siteId={siteId} />
      <SiteMetrics siteId={siteId} />
      <SiteActions siteId={siteId} />
      <RecentActivity siteId={siteId} />
    </div>
  );
}

// Individual components
export function SiteHeader({ siteId }: { siteId: string }) {
  const site = useSite(siteId);
  return <header>{site.name}</header>;
}

export function SiteMetrics({ siteId }: { siteId: string }) {
  const metrics = useSiteMetrics(siteId);
  return <MetricsDisplay data={metrics} />;
}
```

---

## 🚀 Performance Architecture

### Caching Strategies

```typescript
// Multi-level caching
export class CacheManager {
  constructor(
    private memoryCache: MemoryCache,
    private redisCache: RedisCache,
    private cdnCache: CDNCache
  ) {}

  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    let result = await this.memoryCache.get<T>(key);
    if (result) return result;

    // L2: Redis cache (fast)
    result = await this.redisCache.get<T>(key);
    if (result) {
      await this.memoryCache.set(key, result);
      return result;
    }

    // L3: CDN cache (slowest)
    result = await this.cdnCache.get<T>(key);
    if (result) {
      await this.redisCache.set(key, result);
      await this.memoryCache.set(key, result);
      return result;
    }

    return null;
  }
}
```

### Database Optimization

```typescript
// Connection pooling
export class DatabasePool {
  private pools = new Map<string, Pool>();

  getPool(tenantId: string): Pool {
    if (!this.pools.has(tenantId)) {
      this.pools.set(tenantId, new Pool({
        connectionString: this.getConnectionString(tenantId),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }));
    }
    return this.pools.get(tenantId)!;
  }
}

// Query optimization
export class QueryOptimizer {
  optimizeQuery(query: string, params: any[]): {
    query: string;
    params: any[];
  } {
    // Add appropriate indexes
    // Optimize JOIN order
    // Add query hints
    return { query, params };
  }
}
```

---

## 📊 Monitoring & Observability

### Distributed Tracing

```typescript
// OpenTelemetry integration
import { trace, context } from '@opentelemetry/api';

export function tracedOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('marketing-websites');
  const span = tracer.startSpan(name);
  
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: error.message 
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Metrics Collection

```typescript
// Custom metrics
export class MetricsCollector {
  private counter = new Counter('requests_total');
  private histogram = new Histogram('request_duration');
  private gauge = new Gauge('active_connections');

  recordRequest(duration: number): void {
    this.counter.inc();
    this.histogram.record(duration);
  }

  setActiveConnections(count: number): void {
    this.gauge.set(count);
  }
}
```

---

## 🔄 Migration Strategies

### Database Migrations

```typescript
// Zero-downtime migration strategy
export class MigrationManager {
  async migrate(migration: Migration): Promise<void> {
    // Phase 1: Add new column (nullable)
    await this.addColumn(migration.newColumn);
    
    // Phase 2: Backfill data
    await this.backfillData(migration.backfillQuery);
    
    // Phase 3: Update application logic
    await this.deployNewCode();
    
    // Phase 4: Remove old column
    await this.removeColumn(migration.oldColumn);
  }
}
```

### Application Migrations

```typescript
// Feature flag migration
export class FeatureFlagMigration {
  async migrate(feature: string, rollout: RolloutStrategy): Promise<void> {
    for (const stage of rollout.stages) {
      await this.enableFeature(feature, stage.percentage);
      await this.monitor(stage.duration);
      
      if (await this.shouldRollback()) {
        await this.disableFeature(feature);
        throw new Error('Migration rolled back');
      }
    }
    
    await this.enableFeature(feature, 100);
  }
}
```

---

## 📋 Architecture Checklist

### Design Review Checklist

- [ ] **Layer Isolation**: FSD layers properly isolated
- [ ] **Tenant Isolation**: Multi-tenant security implemented
- [ ] **Performance**: Caching and optimization strategies
- [ ] **Scalability**: Horizontal scaling capabilities
- [ ] **Security**: Authentication and authorization patterns
- [ ] **Monitoring**: Observability and alerting
- [ ] **Documentation**: ADRs and design documentation
- [ ] **Testing**: Architecture validation tests

### Implementation Checklist

- [ ] **Code Structure**: Follows FSD layer hierarchy
- [ ] **Type Safety**: TypeScript strict mode
- [ ] **Error Handling**: Comprehensive error boundaries
- [ ] **Logging**: Structured logging with correlation
- [ ] **Configuration**: Environment-specific settings
- [ ] **Deployment**: Zero-downtime deployment
- [ ] **Backup**: Data backup and recovery
- [ ] **Compliance**: Regulatory requirements met

---

## Related Resources

- [Development Patterns Guide](../development/)
- [Security Implementation](../security/security-implementation-guide.md)
- [Infrastructure Patterns](../infrastructure/)
- [Multi-Tenant Patterns](../integrations/multi-tenant.md)
