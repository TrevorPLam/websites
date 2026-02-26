---
name: codex-patterns
description: |
  **REFERENCE SKILL** - Codex-specific development patterns and best practices.
  USE FOR: Understanding Codex agent optimization patterns.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# Codex Development Patterns

## Overview
This reference document outlines Codex-specific development patterns and optimizations for the marketing websites monorepo.

## Codex Agent Characteristics

### 1. Code-First Approach
Codex excels at:
- Direct code generation and modification
- Pattern recognition and application
- Automated refactoring
- Code optimization suggestions
- Test generation

### 2. Structured Problem Solving
Codex prefers:
- Step-by-step problem decomposition
- Algorithmic thinking
- Data structure optimization
- Performance analysis
- Systematic debugging

### 3. Integration Focus
Codex specializes in:
- API integration patterns
- Database schema design
- System architecture
- Performance optimization
- Security implementation

## Development Patterns

### 1. Multi-Tenant Architecture Patterns

#### Tenant Isolation Implementation
```typescript
// Codex-optimized tenant context pattern
interface TenantContext {
  tenantId: string;
  plan: 'basic' | 'professional' | 'enterprise';
  features: string[];
  limits: {
    storage: number;
    bandwidth: number;
    users: number;
  };
}

// Automatic tenant injection
function withTenant<T>(
  fn: (context: TenantContext) => T
): (tenantId: string) => T {
  return (tenantId: string) => {
    const context = getTenantContext(tenantId);
    return fn(context);
  };
}
```

#### Database Pattern Optimization
```typescript
// Codex-preferred query pattern with tenant isolation
class TenantRepository<T> {
  constructor(
    private db: Database,
    private tenantId: string
  ) {}

  async find(criteria: Partial<T>): Promise<T[]> {
    return this.db.query(`
      SELECT * FROM ${this.getTableName()}
      WHERE tenant_id = $1 
      AND ${this.buildCriteria(criteria)}
    `, [this.tenantId, ...this.getValues(criteria)]);
  }

  private buildCriteria(criteria: Partial<T>): string {
    return Object.keys(criteria)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(' AND ');
  }
}
```

### 2. Performance Optimization Patterns

#### Bundle Size Optimization
```typescript
// Codex-optimized code splitting pattern
const LazyComponent = lazy(() => 
  import('./heavy-component').then(module => ({
    default: module.HeavyComponent
  }))
);

// Automatic bundle analysis
function analyzeBundleImpact(component: Component): BundleMetrics {
  return {
    size: estimateComponentSize(component),
    dependencies: getComponentDependencies(component),
    loadTime: estimateLoadTime(component),
    renderTime: estimateRenderTime(component)
  };
}
```

#### Caching Strategy Implementation
```typescript
// Codex-preferred multi-layer caching
interface CacheStrategy {
  level1: () => Promise<T | null>; // Memory cache
  level2: () => Promise<T | null>; // Redis cache
  level3: () => Promise<T>;        // Database/source
}

async function getCachedData<T>(strategy: CacheStrategy): Promise<T> {
  // Try memory cache first
  const cached = await strategy.level1();
  if (cached) return cached;

  // Try Redis cache
  const redisCached = await strategy.level2();
  if (redisCached) {
    await strategy.level1(redisCached); // Populate memory cache
    return redisCached;
  }

  // Fetch from source
  const data = await strategy.level3();
  await strategy.level2(data); // Populate Redis
  await strategy.level1(data); // Populate memory
  return data;
}
```

### 3. Security Implementation Patterns

#### Authentication Flow Optimization
```typescript
// Codex-optimized OAuth 2.1 with PKCE
class PKCEAuthFlow {
  async generateAuthChallenge(): Promise<AuthChallenge> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.hashVerifier(codeVerifier);
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256',
      authUrl: this.buildAuthUrl(codeChallenge)
    };
  }

  async exchangeCodeForToken(
    code: string, 
    codeVerifier: string
  ): Promise<AuthToken> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        client_id: this.clientId,
        redirect_uri: this.redirectUri
      })
    });
    
    return response.json();
  }
}
```

#### Input Validation Patterns
```typescript
// Codex-preferred Zod validation with tenant context
const tenantSchema = z.object({
  tenantId: z.string().uuid(),
  domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  plan: z.enum(['basic', 'professional', 'enterprise']),
  features: z.array(z.string()).default([])
});

function validateTenantInput(input: unknown): TenantConfig {
  const result = tenantSchema.safeParse(input);
  
  if (!result.success) {
    throw new ValidationError(
      'Invalid tenant configuration',
      result.error.issues
    );
  }
  
  return result.data;
}
```

### 4. API Integration Patterns

#### REST API Client Optimization
```typescript
// Codex-optimized API client with retry and rate limiting
class OptimizedApiClient {
  private rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
  private retryPolicy = new ExponentialBackoff(3, 1000);

  async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    await this.rateLimiter.acquire();
    
    return this.retryPolicy.execute(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MarketingWebsites/1.0',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      return response.json();
    });
  }
}
```

#### GraphQL Integration Pattern
```typescript
// Codex-preferred GraphQL client with caching
class GraphQLClient {
  private cache = new Map<string, any>();

  async query<T>(
    query: string, 
    variables: Record<string, any> = {},
    cacheKey?: string
  ): Promise<T> {
    if (cacheKey && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(this.graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    
    if (cacheKey) {
      this.cache.set(cacheKey, result.data);
    }

    return result.data;
  }
}
```

### 5. Testing Patterns

#### Automated Test Generation
```typescript
// Codex-optimized test generation pattern
function generateComponentTest(component: Component): string {
  const props = extractComponentProps(component);
  const hooks = extractComponentHooks(component);
  const dependencies = extractComponentDependencies(component);

  return `
describe('${component.name}', () => {
  ${generatePropsTests(props)}
  ${generateHooksTests(hooks)}
  ${generateIntegrationTests(dependencies)}
  
  it('should render without errors', () => {
    render(<${component.name} ${generateDefaultProps(props)} />);
    expect(screen.getByTestId('${component.name.toLowerCase()}')).toBeInTheDocument();
  });
});
  `;
}
```

#### Performance Test Patterns
```typescript
// Codex-preferred performance testing
class PerformanceTest {
  async measureRenderTime(
    component: Component,
    iterations: number = 100
  ): Promise<PerformanceMetrics> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      render(component);
      const end = performance.now();
      times.push(end - start);
      cleanup();
    }

    return {
      average: times.reduce((a, b) => a + b) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      p95: this.calculatePercentile(times, 0.95)
    };
  }
}
```

## Code Optimization Strategies

### 1. Algorithm Selection
Codex excels at:
- Time complexity analysis
- Space complexity optimization
- Data structure selection
- Algorithm implementation

### 2. Memory Management
Preferred patterns:
- Object pooling for frequently created objects
- Lazy loading for heavy resources
- Memory leak detection and prevention
- Garbage collection optimization

### 3. Concurrency Patterns
Codex-optimized approaches:
- Promise-based async patterns
- Worker thread utilization
- Concurrent request handling
- Race condition prevention

## Error Handling Patterns

### 1. Structured Error Handling
```typescript
// Codex-preferred error handling pattern
class ErrorHandler {
  handle(error: Error, context: ErrorContext): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      tenantId: context.tenantId
    };

    this.logError(errorInfo);
    this.notifyMonitoring(errorInfo);
    this.attemptRecovery(error, context);
  }

  private async attemptRecovery(
    error: Error, 
    context: ErrorContext
  ): Promise<void> {
    if (error instanceof NetworkError) {
      await this.retryWithBackoff(context.operation);
    } else if (error instanceof ValidationError) {
      await this.sanitizeInput(context);
    }
  }
}
```

### 2. Resilience Patterns
```typescript
// Codex-optimized circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitBreakerOpenError();
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

## Monitoring and Observability

### 1. Metrics Collection
```typescript
// Codex-optimized metrics collection
class MetricsCollector {
  private metrics = new Map<string, Metric[]>();

  recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    const metric = {
      name,
      value,
      tags,
      timestamp: Date.now()
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(metric);
  }

  getMetricsSummary(name: string): MetricSummary {
    const metrics = this.metrics.get(name) || [];
    return {
      count: metrics.length,
      average: metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length,
      min: Math.min(...metrics.map(m => m.value)),
      max: Math.max(...metrics.map(m => m.value))
    };
  }
}
```

### 2. Health Check Patterns
```typescript
// Codex-preferred health check implementation
class HealthChecker {
  private checks: Map<string, HealthCheck> = new Map();

  registerCheck(name: string, check: HealthCheck): void {
    this.checks.set(name, check);
  }

  async runHealthChecks(): Promise<HealthStatus> {
    const results = await Promise.allSettled(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        const start = Date.now();
        try {
          await check.execute();
          return { name, status: 'healthy', duration: Date.now() - start };
        } catch (error) {
          return { name, status: 'unhealthy', duration: Date.now() - start, error: error.message };
        }
      })
    );

    const healthy = results.filter(r => 
      r.status === 'fulfilled' && r.value.status === 'healthy'
    ).length;

    return {
      overall: healthy === this.checks.size ? 'healthy' : 'degraded',
      checks: results.map(r => r.status === 'fulfilled' ? r.value : r.reason),
      timestamp: new Date().toISOString()
    };
  }
}
```

## Best Practices Summary

### 1. Code Organization
- Use clear, descriptive naming conventions
- Implement proper separation of concerns
- Follow consistent architectural patterns
- Maintain comprehensive documentation

### 2. Performance Optimization
- Profile before optimizing
- Use appropriate data structures
- Implement efficient algorithms
- Monitor performance metrics

### 3. Security Implementation
- Validate all inputs
- Implement proper authentication
- Use secure communication protocols
- Follow principle of least privilege

### 4. Testing Strategy
- Write comprehensive unit tests
- Implement integration tests
- Perform end-to-end testing
- Monitor test coverage

### 5. Error Handling
- Use structured error handling
- Implement proper logging
- Provide meaningful error messages
- Design for graceful degradation

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
