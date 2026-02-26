---
name: codex-automation
description: |
  **SCRIPTING SKILL** - Codex-optimized automation scripts for development workflows.
  USE FOR: Code generation, automated refactoring, performance optimization.
  DO NOT USE FOR: Manual development tasks - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Codex Automation Scripts

## Overview
This skill provides Codex-optimized automation scripts for common development tasks in the marketing websites monorepo.

## Available Scripts

### 1. Code Generation Scripts

#### Component Generator
```bash
# Generate React component with TypeScript
pnpm run generate:component --name=UserProfile --type=feature --tenant-aware

# Generate page component with SEO optimization
pnpm run generate:page --name=AboutUs --seo-optimized --multilingual

# Generate API endpoint with validation
pnpm run generate:api --endpoint=user-profile --method=POST --validation=zod
```

**Generated Features:**
- TypeScript interfaces and types
- Proper component structure with hooks
- SEO metadata and optimization
- Multi-tenant context integration
- Error handling and loading states
- Test templates and examples

#### Hook Generator
```bash
# Generate custom hook with state management
pnpm run generate:hook --name=useTenantData --state-management --cache

# Generate API integration hook
pnpm run generate:hook --name=useUserProfile --api-integration --retry

# Generate form handling hook
pnpm run generate:hook --name=useContactForm --validation --submission
```

**Hook Patterns:**
- Custom React hooks with TypeScript
- State management integration
- API integration with error handling
- Form validation and submission
- Caching and optimization strategies

### 2. Refactoring Scripts

#### Tenant Isolation Refactor
```bash
# Add tenant context to existing components
pnpm run refactor:add-tenant-context --component=UserProfile --scope=feature

# Update database queries with tenant isolation
pnpm run refactor:tenant-queries --table=users --add-tenant-filter

# Refactor API endpoints for multi-tenancy
pnpm run refactor:api-tenancy --endpoint=user-data --add-tenant-validation
```

**Refactoring Features:**
- Automatic tenant context injection
- Database query updates with RLS
- API endpoint security hardening
- Component prop updates for tenant awareness
- Test updates for tenant scenarios

#### Performance Optimization
```bash
# Optimize component rendering performance
pnpm run optimize:component --name=HeavyComponent --memoization --lazy-loading

# Bundle size optimization
pnpm run optimize:bundle --analyze --split-chunks --tree-shaking

# Database query optimization
pnpm run optimize:queries --table=sessions --add-indexes --analyze-performance
```

**Optimization Strategies:**
- React.memo and useMemo implementation
- Code splitting and lazy loading
- Bundle analysis and optimization
- Database query performance tuning
- Caching strategy implementation

### 3. Migration Scripts

#### Database Migration Generator
```bash
# Generate tenant-aware migration
pnpm run migrate:generate --name=add_tenant_fields --tenant-aware --rollback

# Run migration with validation
pnpm run migrate:run --name=add_tenant_fields --validate --dry-run

# Rollback migration safely
pnpm run migrate:rollback --name=add_tenant_fields --backup --validate
```

**Migration Features:**
- SQL migration generation with tenant support
- Rollback script generation
- Data validation and integrity checks
- Backup and recovery procedures
- Migration testing and validation

#### Configuration Migration
```bash
# Migrate configuration to new format
pnpm run migrate:config --from=legacy --to=v2 --validate

# Update environment variables
pnpm run migrate:env --add-tenant-vars --validate --backup

# Migrate tenant data structure
pnpm run migrate:tenant-data --from=v1 --to=v2 --transform
```

### 4. Testing Scripts

#### Test Generation
```bash
# Generate unit tests for component
pnpm run generate:tests --component=UserProfile --type=unit --coverage

# Generate integration tests for API
pnpm run generate:tests --api=user-profile --type=integration --mocks

# Generate E2E tests for user flow
pnpm run generate:tests --flow=user-registration --type=e2e --multilingual
```

**Test Generation Features:**
- Comprehensive test templates
- Mock data generation
- Coverage analysis
- Multi-tenant test scenarios
- Performance test integration

#### Test Execution
```bash
# Run tests with performance analysis
pnpm run test:performance --component=UserProfile --benchmark

# Run security-focused tests
pnpm run test:security --scope=authentication --vulnerability-scan

# Run multi-tenant isolation tests
pnpm run test:tenant-isolation --comprehensive --report
```

### 5. Security Scripts

#### Security Audit
```bash
# Run comprehensive security audit
pnpm run security:audit --scope=full --report --fix

# Check for tenant isolation vulnerabilities
pnpm run security:tenant-check --comprehensive --report

# Validate authentication and authorization
pnpm run security:auth-validation --comprehensive --report
```

**Security Features:**
- Dependency vulnerability scanning
- Code security analysis
- Tenant isolation validation
- Authentication flow testing
- Authorization pattern verification

#### Security Hardening
```bash
# Harden API endpoints
pnpm run security:harden-api --endpoint=user-data --add-rate-limiting

# Update security headers
pnpm run security:update-headers --csp-upgrade --hsts

# Implement tenant data encryption
pnpm run security:encrypt-tenant-data --algorithm=aes-256 --key-rotation
```

### 6. Performance Scripts

#### Performance Analysis
```bash
# Analyze bundle size impact
pnpm run analyze:bundle --compare-with=main --report

# Analyze Core Web Vitals
pnpm run analyze:cwv --pages=all --thresholds --report

# Database performance analysis
pnpm run analyze:database --queries=slow --optimization-suggestions
```

**Performance Analysis:**
- Bundle size tracking and analysis
- Core Web Vitals monitoring
- Database query performance
- API response time analysis
- Memory usage profiling

#### Performance Optimization
```bash
# Optimize images and assets
pnpm run optimize:assets --images --compression --webp-conversion

# Optimize database queries
pnpm run optimize:database --queries=slow --add-indexes

# Optimize API responses
pnpm run optimize:api --responses=add-caching --compression
```

## Script Implementation Patterns

### 1. Error Handling Pattern
```typescript
interface ScriptResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  warnings?: string[];
}

async function executeScript<T>(
  scriptName: string,
  options: T
): Promise<ScriptResult> {
  try {
    const result = await runScript(scriptName, options);
    return {
      success: true,
      message: `Script ${scriptName} completed successfully`,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: `Script ${scriptName} failed: ${error.message}`,
      errors: [error.message]
    };
  }
}
```

### 2. Validation Pattern
```typescript
interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array';
  pattern?: RegExp;
  min?: number;
  max?: number;
}

function validateInput(
  input: any,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of rules) {
    const value = input[rule.field];
    
    if (rule.required && (value === undefined || value === null)) {
      errors.push(`${rule.field} is required`);
      continue;
    }
    
    if (value !== undefined) {
      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${rule.field} must be a string`);
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 3. Progress Reporting Pattern
```typescript
interface ProgressCallback {
  (stage: string, progress: number, total: number): void;
}

async function executeWithProgress<T>(
  operation: () => Promise<T>,
  onProgress: ProgressCallback
): Promise<T> {
  onProgress('Starting', 0, 100);
  
  try {
    const result = await operation();
    onProgress('Completed', 100, 100);
    return result;
  } catch (error) {
    onProgress('Failed', 0, 100);
    throw error;
  }
}
```

## Configuration Management

### Script Configuration
```typescript
interface ScriptConfig {
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  environment: Record<string, string>;
  options: Record<string, any>;
  validation: ValidationRule[];
}

function loadScriptConfig(scriptName: string): ScriptConfig {
  const configPath = path.join(process.cwd(), 'scripts', 'config', `${scriptName}.json`);
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}
```

### Environment Configuration
```typescript
interface Environment {
  development: ScriptConfig;
  staging: ScriptConfig;
  production: ScriptConfig;
}

function getEnvironmentConfig(env: string): ScriptConfig {
  const configs: Environment = loadEnvironmentConfigs();
  return configs[env] || configs.development;
}
```

## Integration Patterns

### MCP Server Integration
```typescript
// Script with MCP server integration
async function generateComponentWithMCP(options: ComponentOptions): Promise<void> {
  // Use filesystem MCP server for file operations
  await filesystem.createDirectory(options.path);
  
  // Use sequential-thinking for code generation
  const code = await sequentialThinking.generateCode({
    componentType: options.type,
    features: options.features,
    patterns: options.patterns
  });
  
  // Write generated code
  await filesystem.writeFile(`${options.path}/${options.name}.tsx`, code);
  
  // Update knowledge graph
  await knowledgeGraph.createEntity({
    type: 'component',
    name: options.name,
    properties: options
  });
}
```

### Git Integration
```typescript
// Script with Git integration
async function refactorWithGit(options: RefactorOptions): Promise<void> {
  // Create feature branch
  await git.createBranch(`refactor/${options.feature}`);
  
  // Execute refactoring
  await executeRefactoring(options);
  
  // Run tests
  await runTests();
  
  // Commit changes
  await git.commit({
    message: `Refactor: ${options.feature}`,
    files: options.changedFiles
  });
  
  // Create pull request
  await git.createPullRequest({
    title: `Refactor ${options.feature}`,
    description: options.description,
    branch: `refactor/${options.feature}`
  });
}
```

## Performance Considerations

### Parallel Processing
```typescript
// Parallel script execution
async function executeScriptsInParallel(
  scripts: string[],
  options: any
): Promise<ScriptResult[]> {
  const chunks = chunkArray(scripts, 4); // Execute 4 scripts concurrently
  
  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map(script => executeScript(script, options))
    );
    
    // Handle results and continue
    processResults(results);
  }
  
  return getAllResults();
}
```

### Caching Strategy
```typescript
// Script result caching
class ScriptCache {
  private cache = new Map<string, CacheEntry>();
  
  async getOrExecute<T>(
    key: string,
    script: () => Promise<T>,
    ttl: number = 3600000 // 1 hour
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const result = await script();
    this.cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  }
}
```

## Error Recovery

### Retry Pattern
```typescript
// Retry mechanism for failed scripts
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### Rollback Pattern
```typescript
// Rollback mechanism for failed operations
class RollbackManager {
  private operations: RollbackOperation[] = [];
  
  addOperation(operation: RollbackOperation): void {
    this.operations.push(operation);
  }
  
  async rollback(): Promise<void> {
    for (const operation of this.operations.reverse()) {
      try {
        await operation.rollback();
      } catch (error) {
        console.error(`Rollback failed for ${operation.name}:`, error);
      }
    }
    
    this.operations = [];
  }
}
```

## Monitoring and Logging

### Script Monitoring
```typescript
// Script execution monitoring
class ScriptMonitor {
  private metrics = new Map<string, ScriptMetrics>();
  
  recordExecution(scriptName: string, duration: number, success: boolean): void {
    const metrics = this.metrics.get(scriptName) || {
      executions: 0,
      totalDuration: 0,
      successes: 0,
      failures: 0
    };
    
    metrics.executions++;
    metrics.totalDuration += duration;
    
    if (success) {
      metrics.successes++;
    } else {
      metrics.failures++;
    }
    
    this.metrics.set(scriptName, metrics);
  }
  
  getReport(): ScriptReport {
    return {
      totalScripts: this.metrics.size,
      totalExecutions: Array.from(this.metrics.values())
        .reduce((sum, m) => sum + m.executions, 0),
      averageDuration: this.calculateAverageDuration(),
      successRate: this.calculateSuccessRate()
    };
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
