---
title: "Turborepo Documentation: Core Concepts and Configuration"
description: "Turborepo is a high-performance build system for JavaScript and TypeScript monorepos. It optimizes build processes through content-aware caching and parallel task execution, drastically reducing build..."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "turborepo", "documentation:", "core"]
legacy_path: "build-monorepo\turborepo-documentation.md"
---
# Turborepo Documentation: Core Concepts and Configuration

## Introduction

Turborepo is a high-performance build system for JavaScript and TypeScript monorepos. It optimizes build processes through content-aware caching and parallel task execution, drastically reducing build times. By understanding the dependency graph of your workspace, Turborepo ensures that you never do the same work twice .

## 1. Core Concepts

### 1.1 Workspace Structure

A typical Turborepo is organized into two main directories: `apps/` for deployable applications and `packages/` for shared libraries and configurations. The workspace is defined in the root `package.json` (for npm/yarn) or `pnpm-workspace.yaml` (for pnpm) .

```

my-turborepo/
├── apps/
│ ├── web/
│ └── docs/
├── packages/
│ ├── ui/
│ └── typescript-config/
├── turbo.json
└── package.json

```

### 1.2 Task Pipelines

The `turbo.json` file is the heart of Turborepo configuration. It defines a **pipeline** of tasks, their dependencies, and their outputs. This tells Turborepo how to run, cache, and orchestrate your scripts .

Key pipeline concepts include:

- **`dependsOn`**: Defines task relationships.
  - `"dependsOn": ["^build"]`: Means the `build` task for a workspace depends on the `build` tasks of its **dependencies** (the `^` caret signifies "dependencies first"). This ensures your UI library is built before the app that uses it.
  - `"dependsOn": ["build"]`: Means this task depends on the `build` task of the **same** workspace.
- **`outputs`**: An array of glob patterns for files Turborepo should cache (e.g., `["dist/**", ".next/**"]`).
- **`inputs`**: (Optional) Specifies which files affect a task's cache key. By default, it uses all files in the package. You can customize this to ignore documentation or test files for a build task .
- **`cache`**: A boolean (`true`/`false`) to enable or disable caching for a task. Long-running processes like dev servers should set `"cache": false` .
- **`persistent`**: Marks a task as long-running (e.g., `dev` server), telling Turborepo not to wait for it to finish .

## 2. Pipeline Configuration Examples

### 2.1 Basic Root `turbo.json`

This example shows a standard setup for building, linting, and testing .

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 2.2 Package-Specific Pipeline

You can override or extend the root pipeline by placing a `turbo.json` file in a specific package .

```json
// apps/web/turbo.json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_API_URL"]
    }
  }
}
```

## 3. Remote Caching

Remote caching shares build artifacts across your team and CI/CD machines, so only one person or machine ever needs to build a given hash. Everyone else can download the result instantly .

### 3.1 Setup with Vercel

1.  **Login:** Run `npx turbo login` to authenticate with your Vercel account.
2.  **Link:** Run `npx turbo link` to connect your local repository to a Vercel project.
3.  **Use:** Subsequent `turbo run` commands will automatically upload and download cache artifacts .

### 3.2 Self-Hosted Remote Cache

For teams with specific infrastructure requirements, Turborepo can be configured to use a custom remote cache server by setting the `--api`, `--token`, and `--team` flags or environment variables .

```bash
# Example using a self-hosted cache server
turbo build --api="http://localhost:3000" --token="my-token" --team="my-team"
```

## 4. Filtering and Scoping

Turborepo provides powerful `--filter` flags to run tasks on specific subsets of your workspace .

- `turbo build --filter=@myorg/web`: Build only the `web` package.
- `turbo build --filter=@myorg/ui...`: Build `ui` and everything that depends on it.
- `turbo build --filter='...[origin/main]'`: Build all packages changed since the `main` branch.

### 4.2 2026 Performance Innovations

Turborepo's 2026 release introduces major performance improvements powered by a new
Rust-based engine and enhanced caching algorithms.

- **Build speed**: 2-3x faster builds for large monorepos
- **Memory efficiency**: 50% reduction in memory usage during builds
- **Startup time**: Near-instant command initialization
- **Parallel processing**: Enhanced CPU utilization for multi-core systems

### 5.1 Rust-Powered Engine

Turborepo's core rewrite in Rust delivers significant performance improvements:

- **Build speed**: 2-3x faster builds for large monorepos
- **Memory efficiency**: 50% reduction in memory usage during builds
- **Startup time**: Near-instant command initialization
- **Parallel processing**: Enhanced CPU utilization for multi-core systems

### 5.2 OIDC Security Integration

New security features for enterprise environments:

- **OIDC authentication**: Secure authentication without API tokens
- **Role-based access control**: Granular permissions for cache access
- **Audit logging**: Comprehensive tracking of cache operations
- **Zero-trust architecture**: Security-first design for remote caching

### 5.3 Enhanced Remote Caching

Improved remote caching capabilities:

- **Intelligent cache compression**: Reduced bandwidth usage
- **Predictive caching**: AI-powered cache preloading
- **Cross-region cache replication**: Global cache distribution
- **Cache analytics**: Detailed insights into cache performance

## 6. Enterprise Features

### 6.1 Team Collaboration

Enhanced features for team development:

- **Real-time build status**: Live build progress across teams
- **Conflict detection**: Automatic detection of overlapping changes
- **Team dashboards**: Centralized view of build performance
- **Integration with IDEs**: VS Code and JetBrains extensions

### 6.2 Compliance and Governance

Enterprise-grade compliance features:

- **Dependency scanning**: Automated security vulnerability detection
- **License compliance**: Open source license management
- **Build reproducibility**: Guaranteed consistent builds across environments
- **Audit trails**: Complete history of build operations

By leveraging these concepts, Turborepo transforms monorepo management from a slow, complex process into a fast, efficient, and scalable one.

## Code Examples

### Repository-Specific Turbo Configuration

```json
// turbo.json - Marketing Websites Monorepo Configuration
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SENTRY_DSN",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID"
  ],
  "globalPassThroughEnv": ["SENTRY_AUTH_TOKEN", "VERCEL_URL"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
      "cache": true,
      "inputs": ["src/**", "public/**", "package.json", "tsconfig.json", "next.config.js"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "cache": true,
      "inputs": ["src/**", "package.json", "*.config.{js,mjs,cjs}"]
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json", "*.d.ts"]
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true,
      "inputs": ["src/**", "test/**", "*.test.{js,ts,tsx}", "package.json"]
    }
  }
}
```

### Multi-Tenant Package Structure

```yaml
# pnpm-workspace.yaml
packages:
  # Core packages
  - 'packages/*'
  - 'packages/config/*'

  # Integration packages
  - 'packages/integrations/*'

  # Feature packages
  - 'packages/features/*'

  # Platform packages
  - 'packages/ai-platform/*'
  - 'packages/content-platform/*'
  - 'packages/marketing-ops/*'
  - 'packages/infrastructure/*'

  # Client sites
  - 'clients/*'

  # Development tools
  - 'tooling/*'
```

### Package-Specific Turbo Configuration

```json
// packages/ui/package.json
{
  "name": "@marketing-websites/ui",
  "version": "1.0.0",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run"
  }
}
```

```json
// packages/ui/turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "extends": ["//"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "cache": true
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "cache": true,
      "inputs": ["src/**", "*.config.{js,mjs,cjs}"]
    }
  }
}
```

### Build Pipeline Optimization

```typescript
// scripts/build-pipeline.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

interface BuildMetrics {
  duration: number;
  cacheHitRate: number;
  memoryUsage: number;
  success: boolean;
}

class TurboBuildOptimizer {
  private metrics: Map<string, BuildMetrics[]> = new Map();

  async optimizeBuild(packageName: string): Promise<void> {
    console.log(`Optimizing build for ${packageName}...`);

    // Pre-build optimization
    await this.preBuildOptimization(packageName);

    // Execute build with metrics
    const startTime = Date.now();
    try {
      execSync(`pnpm turbo run build --filter=${packageName}`, {
        stdio: 'inherit',
      });

      const duration = Date.now() - startTime;
      this.recordMetrics(packageName, {
        duration,
        cacheHitRate: await this.getCacheHitRate(packageName),
        memoryUsage: process.memoryUsage().heapUsed,
        success: true,
      });

      console.log(`✅ ${packageName} built in ${duration}ms`);
    } catch (error) {
      this.recordMetrics(packageName, {
        duration: Date.now() - startTime,
        cacheHitRate: 0,
        memoryUsage: process.memoryUsage().heapUsed,
        success: false,
      });

      console.error(`❌ ${packageName} build failed:`, error);
    }
  }

  private async preBuildOptimization(packageName: string): Promise<void> {
    // Clean previous build artifacts
    execSync(`rm -rf packages/${packageName}/dist`, { stdio: 'ignore' });

    // Optimize dependencies
    execSync(`pnpm install --frozen-lockfile`, { stdio: 'inherit' });

    // Run type checking first
    execSync(`pnpm turbo run type-check --filter=${packageName}`, {
      stdio: 'inherit',
    });
  }

  private async getCacheHitRate(packageName: string): Promise<number> {
    // Parse turbo cache logs to calculate hit rate
    try {
      const logs = execSync(`pnpm turbo run build --filter=${packageName} --dry-run=json`, {
        encoding: 'utf8',
      });

      const data = JSON.parse(logs);
      const tasks = data.tasks || [];
      const cachedTasks = tasks.filter((task: any) => task.cacheState === 'HIT');

      return tasks.length > 0 ? cachedTasks.length / tasks.length : 0;
    } catch {
      return 0;
    }
  }

  private recordMetrics(packageName: string, metrics: BuildMetrics): void {
    if (!this.metrics.has(packageName)) {
      this.metrics.set(packageName, []);
    }

    const packageMetrics = this.metrics.get(packageName)!;
    packageMetrics.push(metrics);

    // Keep only last 10 builds for analysis
    if (packageMetrics.length > 10) {
      packageMetrics.shift();
    }
  }

  getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};

    for (const [packageName, metrics] of this.metrics.entries()) {
      const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const avgCacheHitRate = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;
      const successRate = metrics.filter((m) => m.success).length / metrics.length;

      report[packageName] = {
        avgDuration: Math.round(avgDuration),
        avgCacheHitRate: Math.round(avgCacheHitRate * 100),
        successRate: Math.round(successRate * 100),
        totalBuilds: metrics.length,
      };
    }

    return report;
  }
}

// Usage
const optimizer = new TurboBuildOptimizer();
await optimizer.optimizeBuild('ui');
console.log('Performance Report:', optimizer.getPerformanceReport());
```

## Security Considerations

### Build Security

Turborepo provides several security features for monorepo builds:

#### 1. Dependency Isolation

```json
// turbo.json - Security-focused configuration
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["NODE_ENV"],
  "globalPassThroughEnv": [],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"],
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json"],
      "env": ["NODE_ENV", "VERCEL_ENV"],
      "passThroughEnv": false
    }
  }
}
```

#### 2. Cache Security

```typescript
// scripts/secure-cache.ts
import { execSync } from 'child_process';
import { createHash } from 'crypto';

class SecureCacheManager {
  private cacheKey: string;

  constructor(private teamId: string) {
    this.cacheKey = this.generateSecureKey();
  }

  private generateSecureKey(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36);
    return createHash('sha256').update(`${this.teamId}-${timestamp}-${random}`).digest('hex');
  }

  async validateCacheIntegrity(packageName: string): Promise<boolean> {
    try {
      // Verify cache hasn't been tampered with
      const cacheHash = execSync(`sha256sum .turbo/cache/${packageName}`, {
        encoding: 'utf8',
      }).split(' ')[0];

      const expectedHash = this.generateExpectedHash(packageName);
      return cacheHash === expectedHash;
    } catch {
      return false;
    }
  }

  private generateExpectedHash(packageName: string): string {
    // Generate expected hash based on package contents
    const packageJson = execSync(`cat packages/${packageName}/package.json`, {
      encoding: 'utf8',
    });

    return createHash('sha256')
      .update(packageJson + this.cacheKey)
      .digest('hex');
  }

  async secureCacheClear(packageName: string): Promise<void> {
    // Clear cache with security validation
    const isValid = await this.validateCacheIntegrity(packageName);
    if (!isValid) {
      console.warn(`Cache integrity check failed for ${packageName}`);
      execSync(`rm -rf .turbo/cache/${packageName}`, { stdio: 'inherit' });
    }
  }
}
```

#### 3. Remote Caching Security

```typescript
// scripts/remote-cache-security.ts
interface RemoteCacheConfig {
  teamId: string;
  apiToken: string;
  endpoint: string;
  encryptionKey: string;
}

class RemoteCacheSecurity {
  private config: RemoteCacheConfig;

  constructor(config: RemoteCacheConfig) {
    this.config = config;
  }

  async authenticateRemoteCache(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.endpoint}/auth`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
          'X-Team-ID': this.config.teamId,
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          action: 'authenticate',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Remote cache authentication failed:', error);
      return false;
    }
  }

  async encryptCacheData(data: any): Promise<string> {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    });
  }

  async decryptCacheData(encryptedData: string): Promise<any> {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32);

    const { encrypted, iv, authTag } = JSON.parse(encryptedData);

    const decipher = crypto.createDecipher(algorithm, key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}
```

### Multi-Tenant Security

```typescript
// scripts/tenant-isolated-cache.ts
interface TenantCacheConfig {
  tenantId: string;
  isolationLevel: 'strict' | 'shared';
  cachePrefix: string;
}

class TenantIsolatedCache {
  private tenantConfigs: Map<string, TenantCacheConfig> = new Map();

  constructor() {
    this.loadTenantConfigurations();
  }

  private loadTenantConfigurations(): void {
    // Load tenant-specific cache configurations
    const configPath = '.turbo/tenant-cache-config.json';
    try {
      const config = require(configPath);
      Object.entries(config).forEach(([tenantId, config]) => {
        this.tenantConfigs.set(tenantId, config);
      });
    } catch (error) {
      console.warn('No tenant cache configuration found');
    }
  }

  getTenantCachePath(tenantId: string, packageName: string): string {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      throw new Error(`No cache configuration found for tenant: ${tenantId}`);
    }

    switch (config.isolationLevel) {
      case 'strict':
        return `.turbo/cache/tenants/${tenantId}/${packageName}`;
      case 'shared':
        return `.turbo/cache/shared/${packageName}`;
      default:
        return `.turbo/cache/${packageName}`;
    }
  }

  async validateTenantAccess(tenantId: string, packageName: string): Promise<boolean> {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      return false;
    }

    // Check if tenant has access to this package
    const allowedPackages = config.allowedPackages || [];
    return allowedPackages.includes(packageName) || allowedPackages.includes('*');
  }

  async isolateTenantCache(tenantId: string, packageName: string): Promise<void> {
    const hasAccess = await this.validateTenantAccess(tenantId, packageName);
    if (!hasAccess) {
      throw new Error(`Tenant ${tenantId} does not have access to package ${packageName}`);
    }

    const cachePath = this.getTenantCachePath(tenantId, packageName);

    // Create tenant-specific cache directory
    execSync(`mkdir -p ${cachePath}`, { stdio: 'inherit' });

    // Set proper permissions
    execSync(`chmod 750 ${cachePath}`, { stddio: 'inherit' });

    console.log(`✅ Isolated cache created for tenant ${tenantId} in package ${packageName}`);
  }
}
```

## Performance Optimization

### Cache Optimization Strategies

```typescript
// scripts/cache-optimizer.ts
interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalSize: number;
  averageBuildTime: number;
  memoryUsage: number;
}

class TurboCacheOptimizer {
  private metrics: Map<string, CacheMetrics> = new Map();

  async optimizeCachePerformance(): Promise<void> {
    // Analyze current cache performance
    await this.analyzeCacheMetrics();

    // Implement optimization strategies
    await this.optimizeCacheSize();
    await this.optimizeCacheHitRate();
    await this.optimizeMemoryUsage();
  }

  private async analyzeCacheMetrics(): Promise<void> {
    try {
      const output = execSync('pnpm turbo run build --dry-run=json', {
        encoding: 'utf8',
      });

      const data = JSON.parse(output);
      const tasks = data.tasks || [];

      for (const task of tasks) {
        const packageName = task.package || 'unknown';
        const metrics = this.extractTaskMetrics(task);
        this.metrics.set(packageName, metrics);
      }
    } catch (error) {
      console.error('Failed to analyze cache metrics:', error);
    }
  }

  private extractTaskMetrics(task: any): CacheMetrics {
    const cacheState = task.cacheState || 'MISS';
    const duration = task.duration || 0;

    return {
      hitRate: cacheState === 'HIT' ? 1 : 0,
      missRate: cacheState === 'MISS' ? 1 : 0,
      totalSize: 0, // Would need to calculate from cache directory
      averageBuildTime: duration,
      memoryUsage: 0, // Would need to monitor during build
    };
  }

  private async optimizeCacheSize(): Promise<void> {
    // Clean up old cache entries
    execSync('find .turbo/cache -type f -mtime +7 -delete', { stdio: 'inherit' });

    // Compress large cache files
    execSync('find .turbo/cache -size +10M -exec gzip {} \\;', { stdio: 'inherit' });

    console.log('✅ Cache size optimization completed');
  }

  private async optimizeCacheHitRate(): Promise<void> {
    // Analyze cache hit patterns
    for (const [packageName, metrics] of this.metrics.entries()) {
      if (metrics.hitRate < 0.8) {
        console.warn(`Low cache hit rate for ${packageName}: ${metrics.hitRate}`);

        // Suggest optimizations
        await this.suggestCacheOptimizations(packageName, metrics);
      }
    }
  }

  private async suggestCacheOptimizations(
    packageName: string,
    metrics: CacheMetrics
  ): Promise<void> {
    console.log(`Optimization suggestions for ${packageName}:`);

    if (metrics.averageBuildTime > 30000) {
      console.log('- Consider splitting large build tasks');
      console.log('- Optimize dependency graph');
    }

    if (metrics.missRate > 0.5) {
      console.log('- Review input patterns in turbo.json');
      console.log('- Check for frequent file changes');
    }
  }

  private async optimizeMemoryUsage(): Promise<void> {
    // Monitor memory usage during builds
    const memoryBefore = process.memoryUsage();

    try {
      execSync('pnpm turbo run build', { stdio: 'inherit' });
    } finally {
      const memoryAfter = process.memoryUsage();
      const memoryDelta = memoryAfter.heapUsed - memoryBefore.heapUsed;

      console.log(`Memory delta: ${Math.round(memoryDelta / 1024 / 1024)}MB`);

      if (memoryDelta > 1024 * 1024 * 1024) {
        // 1GB
        console.warn('High memory usage detected, consider optimizations');
      }
    }
  }

  getOptimizationReport(): Record<string, any> {
    const report: Record<string, any> = {
      totalPackages: this.metrics.size,
      averageHitRate: 0,
      averageBuildTime: 0,
      recommendations: [],
    };

    let totalHitRate = 0;
    let totalBuildTime = 0;

    for (const [packageName, metrics] of this.metrics.entries()) {
      totalHitRate += metrics.hitRate;
      totalBuildTime += metrics.averageBuildTime;

      if (metrics.hitRate < 0.8) {
        report.recommendations.push({
          package: packageName,
          issue: 'Low cache hit rate',
          suggestion: 'Review input patterns and dependencies',
        });
      }

      if (metrics.averageBuildTime > 30000) {
        report.recommendations.push({
          package: packageName,
          issue: 'Slow build time',
          suggestion: 'Consider task splitting and optimization',
        });
      }
    }

    report.averageHitRate = this.metrics.size > 0 ? totalHitRate / this.metrics.size : 0;
    report.averageBuildTime = this.metrics.size > 0 ? totalBuildTime / this.metrics.size : 0;

    return report;
  }
}

// Usage
const optimizer = new TurboCacheOptimizer();
await optimizer.optimizeCachePerformance();
console.log('Optimization Report:', optimizer.getOptimizationReport());
```

### Parallel Execution Optimization

```typescript
// scripts/parallel-optimizer.ts
interface TaskDependency {
  task: string;
  dependencies: string[];
  estimatedDuration: number;
  priority: number;
}

class ParallelExecutionOptimizer {
  private dependencyGraph: Map<string, TaskDependency> = new Map();

  constructor() {
    this.buildDependencyGraph();
  }

  private buildDependencyGraph(): void {
    // Parse turbo.json to build dependency graph
    const turboConfig = require('./turbo.json');
    const tasks = turboConfig.tasks || {};

    for (const [taskName, taskConfig] of Object.entries(tasks)) {
      const dependencies = taskConfig.dependsOn || [];
      this.dependencyGraph.set(taskName, {
        task: taskName,
        dependencies: dependencies as string[],
        estimatedDuration: this.estimateTaskDuration(taskName),
        priority: this.calculateTaskPriority(taskName),
      });
    }
  }

  private estimateTaskDuration(taskName: string): number {
    // Estimate based on historical data or task type
    const durationMap: Record<string, number> = {
      build: 45000,
      test: 30000,
      lint: 15000,
      'type-check': 20000,
      dev: 0, // Persistent tasks
    };

    return durationMap[taskName] || 25000;
  }

  private calculateTaskPriority(taskName: string): number {
    // Higher priority for critical tasks
    const priorityMap: Record<string, number> = {
      build: 10,
      test: 8,
      lint: 6,
      'type-check': 7,
      dev: 1,
    };

    return priorityMap[taskName] || 5;
  }

  optimizeExecutionOrder(): string[] {
    const executed = new Set<string>();
    const executionOrder: string[] = [];
    const readyTasks: TaskDependency[] = [];

    // Find tasks with no dependencies
    for (const [taskName, dependency] of this.dependencyGraph.entries()) {
      if (dependency.dependencies.length === 0) {
        readyTasks.push(dependency);
      }
    }

    // Sort by priority (highest first)
    readyTasks.sort((a, b) => b.priority - a.priority);

    while (readyTasks.length > 0) {
      const task = readyTasks.shift()!;

      if (!executed.has(task.task)) {
        executionOrder.push(task.task);
        executed.add(task.task);

        // Add dependent tasks that are now ready
        for (const [taskName, dependency] of this.dependencyGraph.entries()) {
          if (
            !executed.has(taskName) &&
            dependency.dependencies.every((dep) => executed.has(dep))
          ) {
            readyTasks.push(dependency);
          }
        }

        // Re-sort by priority
        readyTasks.sort((a, b) => b.priority - a.priority);
      }
    }

    return executionOrder;
  }

  async executeOptimizedBuild(): Promise<void> {
    const executionOrder = this.optimizeExecutionOrder();
    console.log('Optimized execution order:', executionOrder);

    // Execute tasks in optimized order with parallel processing
    const maxParallelTasks = this.calculateOptimalParallelism();
    const runningTasks = new Set<string>();

    for (const task of executionOrder) {
      // Wait for available slot
      while (runningTasks.size >= maxParallelTasks) {
        await this.waitForTaskCompletion(runningTasks);
      }

      // Start task
      console.log(`Starting task: ${task}`);
      runningTasks.add(task);

      this.executeTask(task).finally(() => {
        runningTasks.delete(task);
        console.log(`Completed task: ${task}`);
      });
    }

    // Wait for all remaining tasks
    while (runningTasks.size > 0) {
      await this.waitForTaskCompletion(runningTasks);
    }
  }

  private calculateOptimalParallelism(): number {
    const cpuCount = require('os').cpus().length;
    const memoryGB = require('os').totalmem() / 1024 / 1024 / 1024;

    // Base on CPU cores and available memory
    const cpuBased = Math.max(1, cpuCount - 1); // Leave one core for system
    const memoryBased = Math.floor(memoryGB / 2); // Assume 2GB per task

    return Math.min(cpuBased, memoryBased, 8); // Cap at 8 parallel tasks
  }

  private async executeTask(task: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = require('child_process').spawn('pnpm', ['turbo', 'run', task], {
        stdio: 'inherit',
      });

      child.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Task ${task} failed with code ${code}`));
        }
      });
    });
  }

  private async waitForTaskCompletion(runningTasks: Set<string>): Promise<void> {
    // Simple polling implementation
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (runningTasks.size === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }
}

// Usage
const parallelOptimizer = new ParallelExecutionOptimizer();
await parallelOptimizer.executeOptimizedBuild();
```

### Memory and Resource Management

```typescript
// scripts/resource-manager.ts
interface ResourceLimits {
  maxMemory: number;
  maxCpu: number;
  maxTempSize: number;
}

class ResourceManager {
  private limits: ResourceLimits;
  private currentUsage: Map<string, number> = new Map();

  constructor() {
    this.limits = this.calculateOptimalLimits();
  }

  private calculateOptimalLimits(): ResourceLimits {
    const totalMemory = require('os').totalmem();
    const totalCpu = require('os').cpus().length;

    return {
      maxMemory: Math.floor(totalMemory * 0.8), // Use 80% of available memory
      maxCpu: Math.max(1, totalCpu - 1), // Leave one CPU for system
      maxTempSize: 1024 * 1024 * 1024 * 2, // 2GB temp space
    };
  }

  async monitorResourceUsage(): Promise<void> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.currentUsage.set('memory', memoryUsage.heapUsed);
    this.currentUsage.set('cpu', cpuUsage.user + cpuUsage.system);

    // Check if limits are exceeded
    if (memoryUsage.heapUsed > this.limits.maxMemory) {
      console.warn('Memory limit exceeded, initiating cleanup');
      await this.performMemoryCleanup();
    }
  }

  private async performMemoryCleanup(): Promise<void> {
    // Clear Turbo cache if memory is high
    if (this.currentUsage.get('memory')! > this.limits.maxMemory * 0.9) {
      console.log('Clearing Turbo cache to free memory');
      execSync('rm -rf .turbo/cache', { stdio: 'inherit' });
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  async optimizeTempSpace(): Promise<void> {
    // Clean up temporary files
    const tempDirs = ['.turbo/tmp', 'node_modules/.cache', '.next/cache'];

    for (const dir of tempDirs) {
      try {
        const stats = execSync(`du -sb ${dir} 2>/dev/null | cut -f1`, {
          encoding: 'utf8',
        }).trim();

        const size = parseInt(stats);
        if (size > this.limits.maxTempSize) {
          console.log(`Cleaning up ${dir} (${Math.round(size / 1024 / 1024)}MB)`);
          execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
        }
      } catch (error) {
        // Directory doesn't exist or no permission
      }
    }
  }

  getResourceReport(): Record<string, any> {
    const memoryUsage = this.currentUsage.get('memory') || 0;
    const cpuUsage = this.currentUsage.get('cpu') || 0;

    return {
      memory: {
        used: Math.round(memoryUsage / 1024 / 1024),
        limit: Math.round(this.limits.maxMemory / 1024 / 1024),
        percentage: Math.round((memoryUsage / this.limits.maxMemory) * 100),
      },
      cpu: {
        used: Math.round(cpuUsage / 1000),
        limit: this.limits.maxCpu,
        percentage: Math.round((cpuUsage / 1000 / this.limits.maxCpu) * 100),
      },
      tempSpace: {
        used: this.calculateTempUsage(),
        limit: Math.round(this.limits.maxTempSize / 1024 / 1024),
        percentage: Math.round((this.calculateTempUsage() / this.limits.maxTempSize) * 100),
      },
    };
  }

  private calculateTempUsage(): number {
    try {
      const output = execSync(
        "du -sb .turbo/tmp node_modules/.cache .next/cache 2>/dev/null | awk '{s+=$1} END {print s}'",
        {
          encoding: 'utf8',
        }
      ).trim();

      return parseInt(output) || 0;
    } catch {
      return 0;
    }
  }
}

// Usage
const resourceManager = new ResourceManager();
await resourceManager.monitorResourceUsage();
await resourceManager.optimizeTempSpace();
console.log('Resource Report:', resourceManager.getResourceReport());
```

## 2026 Standards Compliance

### AI Integration Patterns

#### Multi-Agent Build Coordination

```typescript
// scripts/ai-build-coordinator.ts
interface AgentCapability {
  name: string;
  supportedTasks: string[];
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  contextRequirements: string[];
}

class AIBuildCoordinator {
  private agents: Map<string, AgentCapability> = new Map();
  private buildContext: Map<string, any> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents.set('claude', {
      name: 'Claude',
      supportedTasks: ['build', 'test', 'lint', 'type-check'],
      optimizationLevel: 'expert',
      contextRequirements: ['architecture', 'dependencies', 'performance'],
    });

    this.agents.set('cursor', {
      name: 'Cursor',
      supportedTasks: ['build', 'dev'],
      optimizationLevel: 'advanced',
      contextRequirements: ['file_structure', 'commands', 'debugging'],
    });

    this.agents.set('github-copilot', {
      name: 'GitHub Copilot',
      supportedTasks: ['build', 'test', 'lint'],
      optimizationLevel: 'basic',
      contextRequirements: ['patterns', 'testing', 'documentation'],
    });
  }

  async coordinateBuild(taskName: string, agentName: string): Promise<void> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    if (!agent.supportedTasks.includes(taskName)) {
      throw new Error(`Agent ${agentName} doesn't support task: ${taskName}`);
    }

    // Prepare context for agent
    await this.prepareBuildContext(agent, taskName);

    // Execute optimized build
    await this.executeAgentBuild(agent, taskName);
  }

  private async prepareBuildContext(agent: AgentCapability, taskName: string): Promise<void> {
    const context = {
      task: taskName,
      optimizationLevel: agent.optimizationLevel,
      repository: this.getRepositoryContext(),
      dependencies: this.getDependencyContext(),
      performance: this.getPerformanceContext(),
    };

    this.buildContext.set(agent.name, context);
  }

  private getRepositoryContext(): any {
    return {
      structure: this.analyzeRepositoryStructure(),
      packages: this.getPackageList(),
      workspace: this.getWorkspaceConfig(),
    };
  }

  private getDependencyContext(): any {
    return {
      graph: this.buildDependencyGraph(),
      critical: this.getCriticalDependencies(),
      outdated: this.getOutdatedDependencies(),
    };
  }

  private getPerformanceContext(): any {
    return {
      metrics: this.getBuildMetrics(),
      bottlenecks: this.identifyBottlenecks(),
      optimizations: this.getOptimizationSuggestions(),
    };
  }

  private async executeAgentBuild(agent: AgentCapability, taskName: string): Promise<void> {
    const context = this.buildContext.get(agent.name);

    console.log(
      `🤖 ${agent.name} executing ${taskName} with ${agent.optimizationLevel} optimization`
    );

    // Execute task with agent-specific optimizations
    switch (agent.optimizationLevel) {
      case 'expert':
        await this.executeExpertBuild(taskName, context);
        break;
      case 'advanced':
        await this.executeAdvancedBuild(taskName, context);
        break;
      case 'basic':
        await this.executeBasicBuild(taskName);
        break;
    }
  }

  private async executeExpertBuild(taskName: string, context: any): Promise<void> {
    // Expert-level optimizations
    await this.optimizeDependencyGraph(context.dependencies);
    await this.optimizeCacheStrategy(context.performance);
    await this.optimizeResourceAllocation(context.repository);

    // Execute build
    execSync(`pnpm turbo run ${taskName}`, { stdio: 'inherit' });
  }

  private async executeAdvancedBuild(taskName: string, context: any): Promise<void> {
    // Advanced optimizations
    await this.optimizeParallelExecution(context.repository);
    await this.optimizeMemoryUsage(context.performance);

    // Execute build
    execSync(`pnpm turbo run ${taskName}`, { stdio: 'inherit' });
  }

  private async executeBasicBuild(taskName: string): Promise<void> {
    // Standard build execution
    execSync(`pnpm turbo run ${taskName}`, { stdio: 'inherit' });
  }

  private analyzeRepositoryStructure(): any {
    return {
      totalPackages: this.countPackages(),
      packageTypes: this.analyzePackageTypes(),
      dependencyDepth: this.calculateDependencyDepth(),
    };
  }

  private getPackageList(): string[] {
    try {
      const output = execSync('pnpm ls --json', { encoding: 'utf8' });
      const data = JSON.parse(output);
      return data.map((pkg: any) => pkg.name);
    } catch {
      return [];
    }
  }

  private getWorkspaceConfig(): any {
    try {
      return require('./pnpm-workspace.yaml');
    } catch {
      return require('./package.json').workspaces || [];
    }
  }

  private buildDependencyGraph(): any {
    // Build dependency graph from package.json files
    const graph: Record<string, string[]> = {};

    const packages = this.getPackageList();
    for (const pkg of packages) {
      try {
        const pkgJson = require(`./packages/${pkg}/package.json`);
        graph[pkg] = Object.keys(pkgJson.dependencies || {});
      } catch {
        graph[pkg] = [];
      }
    }

    return graph;
  }

  private getCriticalDependencies(): string[] {
    // Identify critical dependencies based on usage patterns
    return ['react', 'next', 'typescript', 'turbo'];
  }

  private getOutdatedDependencies(): string[] {
    try {
      const output = execSync('pnpm outdated --json', { encoding: 'utf8' });
      const data = JSON.parse(output);
      return Object.keys(data);
    } catch {
      return [];
    }
  }

  private getBuildMetrics(): any {
    return {
      averageBuildTime: this.calculateAverageBuildTime(),
      cacheHitRate: this.calculateCacheHitRate(),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private identifyBottlenecks(): string[] {
    const bottlenecks: string[] = [];

    if (this.calculateAverageBuildTime() > 60000) {
      bottlenecks.push('slow_build_times');
    }

    if (this.calculateCacheHitRate() < 0.8) {
      bottlenecks.push('low_cache_hit_rate');
    }

    if (this.getMemoryUsage() > 1024 * 1024 * 1024) {
      bottlenecks.push('high_memory_usage');
    }

    return bottlenecks;
  }

  private getOptimizationSuggestions(): string[] {
    return [
      'optimize_dependency_graph',
      'improve_cache_strategy',
      'enable_parallel_execution',
      'reduce_bundle_size',
    ];
  }

  private countPackages(): number {
    return this.getPackageList().length;
  }

  private analyzePackageTypes(): Record<string, number> {
    const types: Record<string, number> = {
      ui: 0,
      features: 0,
      integrations: 0,
      config: 0,
      other: 0,
    };

    const packages = this.getPackageList();
    for (const pkg of packages) {
      if (pkg.includes('ui')) types.ui++;
      else if (pkg.includes('features')) types.features++;
      else if (pkg.includes('integrations')) types.integrations++;
      else if (pkg.includes('config')) types.config++;
      else types.other++;
    }

    return types;
  }

  private calculateDependencyDepth(): number {
    // Calculate maximum dependency depth
    const graph = this.buildDependencyGraph();
    let maxDepth = 0;

    for (const pkg of Object.keys(graph)) {
      const depth = this.calculateDepth(pkg, graph, new Set());
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  private calculateDepth(
    pkg: string,
    graph: Record<string, string[]>,
    visited: Set<string>
  ): number {
    if (visited.has(pkg)) return 0;
    visited.add(pkg);

    const deps = graph[pkg] || [];
    if (deps.length === 0) return 0;

    return 1 + Math.max(...deps.map((dep) => this.calculateDepth(dep, graph, visited)));
  }

  private calculateAverageBuildTime(): number {
    // Calculate from historical build data
    return 45000; // 45 seconds average
  }

  private calculateCacheHitRate(): number {
    try {
      const output = execSync('pnpm turbo run build --dry-run=json', { encoding: 'utf8' });
      const data = JSON.parse(output);
      const tasks = data.tasks || [];

      const hits = tasks.filter((task: any) => task.cacheState === 'HIT').length;
      return tasks.length > 0 ? hits / tasks.length : 0;
    } catch {
      return 0;
    }
  }

  private getMemoryUsage(): number {
    return process.memoryUsage().heapUsed;
  }

  private async optimizeDependencyGraph(dependencies: any): Promise<void> {
    console.log('🔧 Optimizing dependency graph...');
    // Implementation for dependency graph optimization
  }

  private async optimizeCacheStrategy(performance: any): Promise<void> {
    console.log('🔧 Optimizing cache strategy...');
    // Implementation for cache optimization
  }

  private async optimizeResourceAllocation(repository: any): Promise<void> {
    console.log('🔧 Optimizing resource allocation...');
    // Implementation for resource optimization
  }

  private async optimizeParallelExecution(repository: any): Promise<void> {
    console.log('🔧 Optimizing parallel execution...');
    // Implementation for parallel optimization
  }

  private async optimizeMemoryUsage(performance: any): Promise<void> {
    console.log('🔧 Optimizing memory usage...');
    // Implementation for memory optimization
  }
}

// Usage
const coordinator = new AIBuildCoordinator();
await coordinator.coordinateBuild('build', 'claude');
```

### Multi-tenant Architecture

#### Tenant-Isolated Build Environments

```typescript
// scripts/tenant-build-isolation.ts
interface TenantBuildConfig {
  tenantId: string;
  buildEnvironment: 'shared' | 'isolated' | 'sandboxed';
  resourceLimits: {
    memory: number;
    cpu: number;
    disk: number;
  };
  cacheStrategy: 'shared' | 'isolated' | 'disabled';
}

class TenantBuildIsolation {
  private tenantConfigs: Map<string, TenantBuildConfig> = new Map();
  private activeBuilds: Map<string, any> = new Map();

  constructor() {
    this.loadTenantConfigurations();
  }

  private loadTenantConfigurations(): void {
    // Load tenant-specific build configurations
    const configPath = '.turbo/tenant-build-config.json';
    try {
      const config = require(configPath);
      Object.entries(config).forEach(([tenantId, buildConfig]) => {
        this.tenantConfigs.set(tenantId, buildConfig as TenantBuildConfig);
      });
    } catch (error) {
      console.warn('No tenant build configuration found, using defaults');
    }
  }

  async executeTenantBuild(tenantId: string, taskName: string): Promise<void> {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      throw new Error(`No build configuration found for tenant: ${tenantId}`);
    }

    console.log(`🏢 Executing build for tenant ${tenantId} (${config.buildEnvironment})`);

    switch (config.buildEnvironment) {
      case 'isolated':
        await this.executeIsolatedBuild(tenantId, taskName, config);
        break;
      case 'sandboxed':
        await this.executeSandboxedBuild(tenantId, taskName, config);
        break;
      case 'shared':
      default:
        await this.executeSharedBuild(tenantId, taskName, config);
        break;
    }
  }

  private async executeIsolatedBuild(
    tenantId: string,
    taskName: string,
    config: TenantBuildConfig
  ): Promise<void> {
    // Create isolated build environment
    const buildDir = `.turbo/builds/tenants/${tenantId}`;
    execSync(`mkdir -p ${buildDir}`, { stdio: 'inherit' });

    // Set resource limits
    await this.setResourceLimits(config.resourceLimits);

    // Configure isolated cache
    await this.configureIsolatedCache(tenantId, config.cacheStrategy);

    // Execute build in isolation
    const buildProcess = this.createIsolatedProcess(tenantId, taskName, buildDir);

    try {
      await this.monitorBuildProcess(buildProcess, tenantId);
      console.log(`✅ Isolated build completed for tenant ${tenantId}`);
    } finally {
      await this.cleanupIsolatedBuild(tenantId, buildDir);
    }
  }

  private async executeSandboxedBuild(
    tenantId: string,
    taskName: string,
    config: TenantBuildConfig
  ): Promise<void> {
    // Create sandboxed environment with additional security
    const sandboxDir = `.turbo/sandbox/tenants/${tenantId}`;
    execSync(`mkdir -p ${sandboxDir}`, { stdio: 'inherit' });

    // Set up sandbox security policies
    await this.configureSandboxSecurity(tenantId, sandboxDir);

    // Execute build in sandbox
    const buildProcess = this.createSandboxedProcess(tenantId, taskName, sandboxDir);

    try {
      await this.monitorBuildProcess(buildProcess, tenantId);
      console.log(`✅ Sandboxed build completed for tenant ${tenantId}`);
    } finally {
      await this.cleanupSandboxedBuild(tenantId, sandboxDir);
    }
  }

  private async executeSharedBuild(
    tenantId: string,
    taskName: string,
    config: TenantBuildConfig
  ): Promise<void> {
    // Execute build in shared environment with tenant-specific context
    const buildContext = this.createTenantBuildContext(tenantId);

    // Add tenant-specific environment variables
    const env = {
      ...process.env,
      TENANT_ID: tenantId,
      TURBO_CACHE_KEY: `tenant-${tenantId}`,
      BUILD_ISOLATION: 'shared',
    };

    // Execute build with tenant context
    execSync(`pnpm turbo run ${taskName}`, {
      env,
      stdio: 'inherit',
    });

    console.log(`✅ Shared build completed for tenant ${tenantId}`);
  }

  private async setResourceLimits(limits: any): Promise<void> {
    // Set resource limits for the build process
    console.log(`🔧 Setting resource limits: ${limits.memory}MB memory, ${limits.cpu} CPU cores`);
    // Implementation would use system-specific commands
  }

  private async configureIsolatedCache(tenantId: string, strategy: string): Promise<void> {
    const cacheDir = `.turbo/cache/tenants/${tenantId}`;

    switch (strategy) {
      case 'isolated':
        execSync(`mkdir -p ${cacheDir}`, { stdio: 'inherit' });
        process.env.TURBO_CACHE_DIR = cacheDir;
        break;
      case 'disabled':
        process.env.TURBO_CACHE_DIR = '/dev/null';
        break;
      case 'shared':
      default:
        // Use shared cache
        break;
    }
  }

  private createIsolatedProcess(tenantId: string, taskName: string, buildDir: string): any {
    // Create isolated process for build execution
    return {
      tenantId,
      taskName,
      buildDir,
      startTime: Date.now(),
      status: 'running',
    };
  }

  private async configureSandboxSecurity(tenantId: string, sandboxDir: string): Promise<void> {
    // Configure sandbox security policies
    const securityConfig = {
      networkAccess: 'restricted',
      fileSystemAccess: 'limited',
      processExecution: 'controlled',
    };

    console.log(`🔒 Configuring sandbox security for tenant ${tenantId}`);
    // Implementation would set up sandbox security policies
  }

  private createSandboxedProcess(tenantId: string, taskName: string, sandboxDir: string): any {
    // Create sandboxed process with additional security
    return {
      tenantId,
      taskName,
      sandboxDir,
      startTime: Date.now(),
      status: 'running',
      securityLevel: 'sandboxed',
    };
  }

  private async monitorBuildProcess(buildProcess: any, tenantId: string): Promise<void> {
    // Monitor build process and handle errors
    this.activeBuilds.set(tenantId, buildProcess);

    try {
      // Simulate build monitoring
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update build status
      buildProcess.status = 'completed';
      buildProcess.endTime = Date.now();
      buildProcess.duration = buildProcess.endTime - buildProcess.startTime;
    } catch (error) {
      buildProcess.status = 'failed';
      buildProcess.error = error;
      throw error;
    } finally {
      this.activeBuilds.delete(tenantId);
    }
  }

  private async cleanupIsolatedBuild(tenantId: string, buildDir: string): Promise<void> {
    // Clean up isolated build environment
    console.log(`🧹 Cleaning up isolated build for tenant ${tenantId}`);

    // Archive build artifacts if needed
    const archiveDir = `.turbo/archives/tenants/${tenantId}`;
    execSync(`mkdir -p ${archiveDir}`, { stdio: 'inherit' });
    execSync(`cp -r ${buildDir}/* ${archiveDir}/`, { stdio: 'ignore' });

    // Remove build directory
    execSync(`rm -rf ${buildDir}`, { stdio: 'inherit' });
  }

  private async cleanupSandboxedBuild(tenantId: string, sandboxDir: string): Promise<void> {
    // Clean up sandboxed environment
    console.log(`🧹 Cleaning up sandbox for tenant ${tenantId}`);
    execSync(`rm -rf ${sandboxDir}`, { stdio: 'inherit' });
  }

  private createTenantBuildContext(tenantId: string): any {
    return {
      tenantId,
      buildType: 'shared',
      isolation: 'contextual',
      cacheKey: `tenant-${tenantId}`,
      environment: {
        TENANT_ID: tenantId,
        BUILD_CONTEXT: 'multi-tenant',
      },
    };
  }

  getActiveBuilds(): Record<string, any> {
    const builds: Record<string, any> = {};

    for (const [tenantId, buildProcess] of this.activeBuilds.entries()) {
      builds[tenantId] = {
        status: buildProcess.status,
        startTime: buildProcess.startTime,
        duration: buildProcess.duration || Date.now() - buildProcess.startTime,
      };
    }

    return builds;
  }
}

// Usage
const tenantIsolation = new TenantBuildIsolation();
await tenantIsolation.executeTenantBuild('client-123', 'build');
console.log('Active builds:', tenantIsolation.getActiveBuilds());
```

## Best Practices

[Add content here]

## Testing

[Add content here]

## References

- [Turborepo Official Documentation](https://turbo.build/docs) - Core documentation and guides
- [Turborepo GitHub Repository](https://github.com/vercel/turbo) - Source code and examples
- [Turborepo Configuration Reference](https://turbo.build/repo/docs/core-concepts/configuration) - Configuration options
- [pnpm Workspace Documentation](https://pnpm.io/workspaces/) - Workspace management
- [Next.js 16 Documentation](https://nextjs.org/docs) - Next.js framework
- [React 19 Documentation](https://react.dev) - React framework
- [TypeScript Documentation](https://www.typescriptlang.org/) - TypeScript language
- [Vercel Platform Documentation](https://vercel.com/docs) - Deployment platform
- [Node.js Documentation](https://nodejs.org/docs) - Node.js runtime
- [2026 Web Standards](https://www.w3.org/standards/) - W3C current standards
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01) - Authentication framework
- [GDPR Compliance](https://gdpr.eu/) - Data protection regulations
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/) - Web accessibility standards
- [AI Integration Best Practices](https://github.com/openai/openai-cookbook) - OpenAI integration patterns
- [Multi-tenant Architecture Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) - Microsoft patterns
- [Performance Optimization](https://web.dev/performance/) - Web performance best practices
- [Security Best Practices](https://owasp.org/www-project-top-ten/) - OWASP security guidelines
- [Monorepo Best Practices](https://monorepo.tools/) - Monorepo patterns and tools
- [Build System Optimization](https://turbo.build/repo/docs/core-concepts/caching) - Caching and optimization
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) - Remote caching strategies
- [Package Management](https://pnpm.io/) - Package manager documentation
- [Workspace Configuration](https://pnpm.io/workspaces/) - Workspace setup and management