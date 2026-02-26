---
name: codex-orchestration
description: |
  **AGENT CONFIGURATION** - Codex agent orchestration patterns and multi-agent coordination.
  USE FOR: Understanding Codex agent behavior, optimization patterns, and coordination strategies.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "agent-config"
---

# Codex Agent Orchestration Patterns

## Overview
This document defines Codex agent orchestration patterns, optimization strategies, and coordination mechanisms for the marketing websites monorepo.

## Codex Agent Architecture

### Core Agent Characteristics
- **Code-First Approach**: Direct code generation and modification
- **Structured Problem Solving**: Step-by-step algorithmic thinking
- **Integration Focus**: API integration and system architecture
- **Performance Optimization**: Algorithm selection and efficiency analysis
- **Security Implementation**: Zero-trust patterns and validation

### Agent Capabilities Matrix

| Capability | Level | Description |
|------------|-------|-------------|
| Code Generation | Expert | Full-stack TypeScript/React/Next.js |
| System Architecture | Expert | Multi-tenant SaaS patterns |
| API Integration | Expert | REST, GraphQL, third-party services |
| Database Design | Advanced | PostgreSQL, multi-tenant schemas |
| Performance Optimization | Advanced | Core Web Vitals, bundle analysis |
| Security Implementation | Advanced | OAuth 2.1, RLS, tenant isolation |
| Testing Strategy | Advanced | Unit, integration, E2E patterns |

## Orchestration Patterns

### 1. Sequential Execution Pattern

```typescript
interface SequentialTask {
  id: string;
  name: string;
  dependencies: string[];
  executor: 'codex' | 'claude' | 'external';
  parameters: Record<string, any>;
  timeout: number;
  retryPolicy: RetryConfig;
}

class SequentialOrchestrator {
  async execute(tasks: SequentialTask[]): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    
    for (const task of tasks) {
      // Check dependencies
      await this.validateDependencies(task, results);
      
      // Execute task
      const result = await this.executeTask(task);
      results.push(result);
      
      // Handle failures
      if (!result.success && task.critical) {
        throw new TaskExecutionError(`Critical task ${task.id} failed`);
      }
    }
    
    return results;
  }
}
```

### 2. Parallel Execution Pattern

```typescript
interface ParallelTaskGroup {
  id: string;
  tasks: Task[];
  concurrency: number;
  resourceLimits: ResourceLimits;
}

class ParallelOrchestrator {
  async execute(group: ParallelTaskGroup): Promise<TaskResult[]> {
    const chunks = this.chunkTasks(group.tasks, group.concurrency);
    const results: TaskResult[] = [];
    
    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(task => this.executeTask(task))
      );
      
      results.push(...this.processChunkResults(chunkResults));
    }
    
    return results;
  }
}
```

### 3. Pipeline Pattern

```typescript
interface PipelineStage {
  name: string;
  processor: (input: any) => Promise<any>;
  validator?: (output: any) => boolean;
  errorHandler?: (error: Error) => Promise<any>;
}

class CodexPipeline {
  constructor(private stages: PipelineStage[]) {}
  
  async execute(input: any): Promise<any> {
    let current = input;
    
    for (const stage of this.stages) {
      try {
        current = await stage.processor(current);
        
        if (stage.validator && !stage.validator(current)) {
          throw new ValidationError(`Stage ${stage.name} validation failed`);
        }
      } catch (error) {
        if (stage.errorHandler) {
          current = await stage.errorHandler(error);
        } else {
          throw error;
        }
      }
    }
    
    return current;
  }
}
```

## Specialized Agent Configurations

### 1. Code Generation Agent

```typescript
interface CodeGenAgent {
  name: 'codex-codegen';
  capabilities: [
    'component-generation',
    'api-endpoint-creation',
    'database-schema-design',
    'test-generation',
    'migration-scripts'
  ];
  
  optimization: {
    patterns: ['fsd-compliance', 'tenant-isolation', 'performance-first'];
    constraints: ['typescript-strict', 'security-first', 'test-coverage'];
  };
  
  execution: {
    timeout: 300000; // 5 minutes
    retryPolicy: { attempts: 3, backoff: 'exponential' };
    memoryLimit: '512MB';
  };
}
```

### 2. Architecture Review Agent

```typescript
interface ArchitectureAgent {
  name: 'codex-architect';
  capabilities: [
    'system-design-review',
    'performance-analysis',
    'security-audit',
    'scalability-assessment',
    'integration-validation'
  ];
  
  analysis: {
    patterns: ['multi-tenant', 'microservices', 'event-driven'];
    metrics: ['cwv-scores', 'bundle-size', 'query-performance'];
    standards: ['oauth-2.1', 'rls-compliance', 'gdpr-ccpa'];
  };
  
  reporting: {
    format: 'structured-json';
    severity: ['critical', 'high', 'medium', 'low'];
    recommendations: true;
    remediation: true;
  };
}
```

### 3. Integration Agent

```typescript
interface IntegrationAgent {
  name: 'codex-integration';
  capabilities: [
    'api-client-generation',
    'webhook-configuration',
    'third-party-setup',
    'data-sync-implementation',
    'error-handling-patterns'
  ];
  
  connectors: {
    authentication: ['oauth-2.1', 'api-keys', 'jwt'];
    protocols: ['rest', 'graphql', 'webhook', 'grpc'];
    formats: ['json', 'xml', 'csv', 'protobuf'];
  };
  
  security: {
    validation: 'input-sanitization';
    encryption: 'tls-1.3';
    rateLimit: 'token-bucket';
    audit: 'comprehensive-logging';
  };
}
```

## Coordination Protocols

### 1. Agent Communication

```typescript
interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'notification';
  payload: any;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class AgentCommunication {
  async send(message: AgentMessage): Promise<void> {
    // Validate message format
    this.validateMessage(message);
    
    // Apply security checks
    await this.validateSecurity(message);
    
    // Route to destination
    await this.routeMessage(message);
    
    // Log for audit
    await this.logMessage(message);
  }
}
```

### 2. Resource Management

```typescript
interface ResourcePool {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
}

class ResourceManager {
  private pools = new Map<string, ResourcePool>();
  
  async allocate(agentId: string, request: ResourceRequest): Promise<ResourceAllocation> {
    const pool = this.pools.get(agentId) || this.createPool(agentId);
    
    if (this.canAllocate(pool, request)) {
      return this.allocateResources(pool, request);
    }
    
    throw new InsufficientResourcesError(`Cannot allocate resources for ${agentId}`);
  }
  
  async release(allocation: ResourceAllocation): Promise<void> {
    const pool = this.pools.get(allocation.agentId);
    if (pool) {
      this.releaseResources(pool, allocation);
    }
  }
}
```

### 3. State Management

```typescript
interface AgentState {
  id: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string;
  resources: ResourceAllocation;
  metrics: AgentMetrics;
  lastActivity: number;
}

class StateManager {
  private states = new Map<string, AgentState>();
  
  async updateState(agentId: string, update: Partial<AgentState>): Promise<void> {
    const current = this.states.get(agentId) || this.createInitialState(agentId);
    const updated = { ...current, ...update, lastActivity: Date.now() };
    
    this.states.set(agentId, updated);
    await this.persistState(agentId, updated);
    
    // Notify interested parties
    await this.notifyStateChange(agentId, current, updated);
  }
}
```

## Performance Optimization

### 1. Caching Strategy

```typescript
interface CacheConfig {
  ttl: number;
  maxSize: number;
  evictionPolicy: 'lru' | 'lfu' | 'ttl';
  compression: boolean;
}

class AgentCache {
  private cache = new Map<string, CacheEntry>();
  
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl
    };
    
    this.cache.set(key, entry);
    await this.evictIfNecessary();
  }
}
```

### 2. Load Balancing

```typescript
interface LoadBalancer {
  strategy: 'round-robin' | 'least-connections' | 'weighted';
  agents: AgentInstance[];
  healthCheck: HealthCheckConfig;
}

class AgentLoadBalancer {
  async selectAgent(capability: string): Promise<AgentInstance> {
    const availableAgents = this.getAvailableAgents(capability);
    
    switch (this.strategy) {
      case 'round-robin':
        return this.selectRoundRobin(availableAgents);
      case 'least-connections':
        return this.selectLeastConnections(availableAgents);
      case 'weighted':
        return this.selectWeighted(availableAgents);
      default:
        throw new Error(`Unknown load balancing strategy: ${this.strategy}`);
    }
  }
}
```

## Error Handling and Recovery

### 1. Error Classification

```typescript
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum ErrorCategory {
  VALIDATION = 'validation',
  NETWORK = 'network',
  SYSTEM = 'system',
  BUSINESS = 'business',
  SECURITY = 'security'
}

interface AgentError {
  id: string;
  agentId: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: number;
  recoverable: boolean;
}
```

### 2. Recovery Strategies

```typescript
interface RecoveryStrategy {
  name: string;
  condition: (error: AgentError) => boolean;
  action: (error: AgentError) => Promise<void>;
  maxAttempts: number;
  backoff: number;
}

class ErrorRecovery {
  private strategies: RecoveryStrategy[] = [
    {
      name: 'retry-network-errors',
      condition: (e) => e.category === ErrorCategory.NETWORK,
      action: async (e) => await this.retryOperation(e),
      maxAttempts: 3,
      backoff: 1000
    },
    {
      name: 'restart-agent',
      condition: (e) => e.severity === ErrorSeverity.CRITICAL,
      action: async (e) => await this.restartAgent(e.agentId),
      maxAttempts: 1,
      backoff: 5000
    }
  ];
  
  async handleError(error: AgentError): Promise<void> {
    const strategy = this.strategies.find(s => s.condition(error));
    
    if (strategy) {
      await this.executeRecovery(strategy, error);
    } else {
      await this.escalateError(error);
    }
  }
}
```

## Monitoring and Observability

### 1. Metrics Collection

```typescript
interface AgentMetrics {
  taskCount: number;
  successRate: number;
  averageLatency: number;
  errorRate: number;
  resourceUtilization: ResourceUtilization;
  lastUpdated: number;
}

class MetricsCollector {
  private metrics = new Map<string, AgentMetrics>();
  
  recordTaskCompletion(agentId: string, duration: number, success: boolean): void {
    const current = this.metrics.get(agentId) || this.createEmptyMetrics();
    
    current.taskCount++;
    current.successRate = this.calculateSuccessRate(current, success);
    current.averageLatency = this.calculateAverageLatency(current, duration);
    current.lastUpdated = Date.now();
    
    this.metrics.set(agentId, current);
  }
}
```

### 2. Health Monitoring

```typescript
interface HealthCheck {
  name: string;
  interval: number;
  timeout: number;
  check: () => Promise<boolean>;
}

class HealthMonitor {
  private checks = new Map<string, HealthCheck>();
  
  async runHealthChecks(): Promise<HealthReport> {
    const results = await Promise.allSettled(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        const start = Date.now();
        try {
          const healthy = await Promise.race([
            check.check(),
            this.timeout(check.timeout)
          ]);
          return { name, healthy: healthy as boolean, duration: Date.now() - start };
        } catch (error) {
          return { name, healthy: false, duration: Date.now() - start, error: error.message };
        }
      })
    );
    
    return this.generateHealthReport(results);
  }
}
```

## Security Considerations

### 1. Agent Authentication

```typescript
interface AgentCredentials {
  id: string;
  token: string;
  permissions: string[];
  expires: number;
}

class AgentAuth {
  async authenticate(credentials: AgentCredentials): Promise<boolean> {
    // Validate token format
    if (!this.validateToken(credentials.token)) {
      return false;
    }
    
    // Check expiration
    if (Date.now() > credentials.expires) {
      return false;
    }
    
    // Verify permissions
    return this.verifyPermissions(credentials.permissions);
  }
}
```

### 2. Access Control

```typescript
interface AccessPolicy {
  resource: string;
  actions: string[];
  conditions: Record<string, any>;
}

class AccessController {
  private policies = new Map<string, AccessPolicy>();
  
  async canAccess(agentId: string, resource: string, action: string): Promise<boolean> {
    const policy = this.policies.get(resource);
    
    if (!policy) {
      return false;
    }
    
    if (!policy.actions.includes(action)) {
      return false;
    }
    
    return this.evaluateConditions(policy.conditions, agentId);
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
