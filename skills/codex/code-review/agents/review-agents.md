---
name: review-agents
description: |
  **AGENT CONFIGURATION** - Codex code review agent configurations and specialization patterns.
  USE FOR: Understanding code review agent behavior, review criteria, and automation patterns.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "agent-config"
---

# Codex Code Review Agents

## Overview
This document defines specialized Codex agents for automated code review, security analysis, and quality assurance in the marketing websites monorepo.

## Agent Specializations

### 1. Security Review Agent

```typescript
interface SecurityReviewAgent {
  name: 'codex-security-reviewer';
  expertise: [
    'oauth-2.1-compliance',
    'tenant-isolation',
    'rls-policies',
    'input-validation',
    'xss-prevention',
    'csrf-protection',
    'sql-injection-prevention',
    'data-encryption'
  ];
  
  reviewCriteria: {
    authentication: [
      'proper-token-validation',
      'pkce-implementation',
      'session-management',
      'logout-procedures'
    ];
    authorization: [
      'tenant-context-validation',
      'role-based-access',
      'resource-permissions',
      'api-rate-limiting'
    ];
    dataProtection: [
      'sensitive-data-encryption',
      'audit-logging',
      'data-minimization',
      'gdpr-compliance'
    ];
  };
  
  severityLevels: ['critical', 'high', 'medium', 'low'];
  autoFix: true; // Can automatically fix certain security issues
}
```

### 2. Performance Review Agent

```typescript
interface PerformanceReviewAgent {
  name: 'codex-performance-reviewer';
  expertise: [
    'core-web-vitals',
    'bundle-optimization',
    'database-query-performance',
    'caching-strategies',
    'lazy-loading',
    'code-splitting',
    'image-optimization',
    'server-response-time'
  ];
  
  reviewCriteria: {
    frontend: [
      'lcp-optimization',
      'inp-reduction',
      'cls-prevention',
      'bundle-size-analysis',
      'render-optimization'
    ];
    backend: [
      'query-efficiency',
      'api-response-time',
      'cache-hit-ratio',
      'concurrent-request-handling',
      'memory-usage'
    ];
    infrastructure: [
      'cdn-utilization',
      'ssl-optimization',
      'compression-configuration',
      'resource-loading-strategies'
    ];
  };
  
  thresholds: {
    lcp: 2500; // milliseconds
    inp: 200;  // milliseconds
    cls: 0.1;  // cumulative layout shift
    bundleSize: 250000; // bytes gzipped
  };
}
```

### 3. Architecture Review Agent

```typescript
interface ArchitectureReviewAgent {
  name: 'codex-architecture-reviewer';
  expertise: [
    'feature-sliced-design',
    'multi-tenant-architecture',
    'microservices-patterns',
    'event-driven-design',
    'api-design',
    'database-schema-design',
    'scalability-patterns',
    'dependency-management'
  ];
  
  reviewCriteria: {
    structure: [
      'fsd-compliance',
      'layer-isolation',
      'dependency-directions',
      'module-cohesion',
      'interface-consistency'
    ];
    patterns: [
      'repository-pattern',
      'service-layer',
      'dependency-injection',
      'error-handling',
      'logging-patterns'
    ];
    scalability: [
      'horizontal-scalability',
      'database-sharding',
      'cache-distribution',
      'load-balancing',
      'resource-pooling'
    ];
  };
  
  antiPatterns: [
    'circular-dependencies',
    'tight-coupling',
    'god-objects',
    'deep-nesting',
    'feature-envy'
  ];
}
```

### 4. TypeScript Review Agent

```typescript
interface TypeScriptReviewAgent {
  name: 'codex-typescript-reviewer';
  expertise: [
    'strict-type-checking',
    'generic-programming',
    'utility-types',
    'conditional-types',
    'mapped-types',
    'type-guards',
    'discriminated-unions',
    'module-systems'
  ];
  
  reviewCriteria: {
    typeSafety: [
      'no-any-usage',
      'strict-null-checks',
      'proper-interface-design',
      'type-narrowing',
      'generic-constraints'
    ];
    codeQuality: [
      'consistent-naming',
      'proper-exports',
      'module-boundaries',
      'type-imports',
      'declaration-merging'
    ];
    performance: [
      'type-inference-optimization',
      'compilation-speed',
      'incremental-compilation',
      'project-references'
    ];
  };
  
  rules: {
    preferExplicitTypes: true;
    requireTypeAnnotations: ['public-api', 'complex-logic'];
    allowTypeInference: ['simple-variables', 'iteration'];
  };
}
```

### 5. Testing Review Agent

```typescript
interface TestingReviewAgent {
  name: 'codex-testing-reviewer';
  expertise: [
    'unit-testing',
    'integration-testing',
    'e2e-testing',
    'mock-strategies',
    'test-organization',
    'coverage-analysis',
    'performance-testing',
    'accessibility-testing'
  ];
  
  reviewCriteria: {
    coverage: [
      'statement-coverage',
      'branch-coverage',
      'function-coverage',
      'line-coverage',
      'critical-path-testing'
    ];
    quality: [
      'test-isolation',
      'descriptive-naming',
      'assertion-clarity',
      'setup-teardown',
      'mock-accuracy'
    ];
    strategy: [
      'test-pyramid-compliance',
      'boundary-testing',
      'error-scenario-testing',
      'integration-points',
      'user-journey-testing'
    ];
  };
  
  thresholds: {
    minimumCoverage: 80;
    criticalCoverage: 95;
    maxTestTime: 5000; // milliseconds
  };
}
```

## Review Workflow Orchestration

### 1. Multi-Agent Review Pipeline

```typescript
interface ReviewPipeline {
  stages: ReviewStage[];
  parallel: boolean;
  failFast: boolean;
  aggregation: ReviewAggregation;
}

interface ReviewStage {
  name: string;
  agents: string[];
  filters: ReviewFilter[];
  timeout: number;
  retryPolicy: RetryPolicy;
}

class ReviewOrchestrator {
  async executeReview(pipeline: ReviewPipeline, changes: CodeChanges): Promise<ReviewReport> {
    const results: StageResult[] = [];
    
    for (const stage of pipeline.stages) {
      const stageResult = await this.executeStage(stage, changes);
      results.push(stageResult);
      
      // Fail fast if critical issues found
      if (pipeline.failFast && this.hasCriticalIssues(stageResult)) {
        break;
      }
    }
    
    return this.aggregateResults(results, pipeline.aggregation);
  }
  
  private async executeStage(stage: ReviewStage, changes: CodeChanges): Promise<StageResult> {
    if (stage.parallel) {
      return this.executeParallel(stage, changes);
    } else {
      return this.executeSequential(stage, changes);
    }
  }
}
```

### 2. Agent Coordination

```typescript
interface AgentCoordination {
  communication: AgentCommunication;
  resourceSharing: ResourceSharing;
  conflictResolution: ConflictResolution;
  loadBalancing: LoadBalancing;
}

class AgentCoordinator {
  async coordinateReview(agents: ReviewAgent[], context: ReviewContext): Promise<ReviewResult[]> {
    // Optimize agent selection based on file types
    const selectedAgents = this.selectAgents(agents, context);
    
    // Allocate resources
    const allocations = await this.allocateResources(selectedAgents);
    
    // Execute review with coordination
    const results = await this.executeWithCoordination(selectedAgents, context, allocations);
    
    // Release resources
    await this.releaseResources(allocations);
    
    return results;
  }
  
  private selectAgents(agents: ReviewAgent[], context: ReviewContext): ReviewAgent[] {
    return agents.filter(agent => 
      agent.expertise.some(expertise => 
        context.fileTypes.some(type => this.isRelevant(expertise, type))
      )
    );
  }
}
```

## Review Criteria Configuration

### 1. Security Review Rules

```typescript
interface SecurityRule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  pattern: RegExp | string;
  fix?: string;
  references: string[];
}

const securityRules: SecurityRule[] = [
  {
    id: 'SEC001',
    name: 'Hardcoded Secrets',
    description: 'Detect hardcoded secrets, API keys, or passwords',
    severity: 'critical',
    pattern: /(password|secret|key|token)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    fix: 'Use environment variables or secure configuration management',
    references: ['https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication']
  },
  {
    id: 'SEC002',
    name: 'SQL Injection Risk',
    description: 'Detect potential SQL injection vulnerabilities',
    severity: 'critical',
    pattern: /execute\s*\(\s*['"`]([^'"`]*\$\{[^}]*\}[^'"`]*)['"`]/gi,
    fix: 'Use parameterized queries or ORM',
    references: ['https://owasp.org/www-project-top-ten/2017/A1_2017-Injection']
  },
  {
    id: 'SEC003',
    name: 'Missing Tenant Isolation',
    description: 'Ensure database queries include tenant filtering',
    severity: 'high',
    pattern: /SELECT.*FROM.*WHERE(?!.*tenant_id)/gi,
    fix: 'Add tenant_id filter to all queries',
    references: ['../references/multi-tenant-security.md']
  }
];
```

### 2. Performance Review Rules

```typescript
interface PerformanceRule {
  id: string;
  name: string;
  metric: 'lcp' | 'inp' | 'cls' | 'bundle-size' | 'query-time';
  threshold: number;
  unit: 'ms' | 'bytes' | 'score';
  check: (code: CodeContext) => Promise<number>;
}

const performanceRules: PerformanceRule[] = [
  {
    id: 'PERF001',
    name: 'Bundle Size Limit',
    metric: 'bundle-size',
    threshold: 250000,
    unit: 'bytes',
    check: async (context) => {
      const analysis = await this.analyzeBundleSize(context);
      return analysis.totalSize;
    }
  },
  {
    id: 'PERF002',
    name: 'Database Query Performance',
    metric: 'query-time',
    threshold: 100,
    unit: 'ms',
    check: async (context) => {
      const queries = this.extractQueries(context);
      return Math.max(...queries.map(q => q.estimatedTime));
    }
  }
];
```

## Automated Review Execution

### 1. Review Agent Implementation

```typescript
abstract class ReviewAgent {
  abstract name: string;
  abstract expertise: string[];
  
  abstract review(context: ReviewContext): Promise<ReviewResult>;
  
  protected createIssue(
    severity: IssueSeverity,
    message: string,
    location: CodeLocation,
    suggestion?: string
  ): ReviewIssue {
    return {
      id: this.generateIssueId(),
      agent: this.name,
      severity,
      message,
      location,
      suggestion,
      timestamp: Date.now()
    };
  }
  
  protected async analyzeFile(file: FileContext): Promise<FileAnalysis> {
    const content = await this.readFile(file.path);
    const ast = this.parseAST(content, file.language);
    const dependencies = this.extractDependencies(ast);
    const complexity = this.calculateComplexity(ast);
    
    return {
      content,
      ast,
      dependencies,
      complexity,
      metrics: this.calculateMetrics(ast)
    };
  }
}
```

### 2. Security Review Agent Implementation

```typescript
class SecurityReviewAgentImpl extends ReviewAgent {
  name = 'codex-security-reviewer';
  expertise = ['oauth-2.1', 'tenant-isolation', 'rls-policies'];
  
  async review(context: ReviewContext): Promise<ReviewResult> {
    const issues: ReviewIssue[] = [];
    
    for (const file of context.changedFiles) {
      const analysis = await this.analyzeFile(file);
      
      // Check for hardcoded secrets
      const secretIssues = this.checkForSecrets(analysis);
      issues.push(...secretIssues);
      
      // Check for tenant isolation
      const tenantIssues = this.checkTenantIsolation(analysis);
      issues.push(...tenantIssues);
      
      // Check for input validation
      const validationIssues = this.checkInputValidation(analysis);
      issues.push(...validationIssues);
    }
    
    return {
      agent: this.name,
      issues,
      summary: this.generateSummary(issues),
      recommendations: this.generateRecommendations(issues)
    };
  }
  
  private checkForSecrets(analysis: FileAnalysis): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    const secretPattern = /(password|secret|key|token)\s*[:=]\s*['"][^'"]{8,}['"]/gi;
    
    let match;
    while ((match = secretPattern.exec(analysis.content)) !== null) {
      issues.push(this.createIssue(
        'critical',
        'Hardcoded secret detected',
        {
          file: analysis.filePath,
          line: this.getLineNumber(analysis.content, match.index),
          column: match.index
        },
        'Use environment variables or secure configuration management'
      ));
    }
    
    return issues;
  }
}
```

### 3. Performance Review Agent Implementation

```typescript
class PerformanceReviewAgentImpl extends ReviewAgent {
  name = 'codex-performance-reviewer';
  expertise = ['core-web-vitals', 'bundle-optimization'];
  
  async review(context: ReviewContext): Promise<ReviewResult> {
    const issues: ReviewIssue[] = [];
    
    // Analyze bundle size impact
    const bundleAnalysis = await this.analyzeBundleImpact(context);
    if (bundleAnalysis.estimatedSize > 250000) {
      issues.push(this.createIssue(
        'high',
        `Bundle size exceeds limit: ${bundleAnalysis.estimatedSize} bytes`,
        { file: 'bundle-analysis', line: 1, column: 1 },
        'Consider code splitting or lazy loading'
      ));
    }
    
    // Check for performance anti-patterns
    for (const file of context.changedFiles) {
      const analysis = await this.analyzeFile(file);
      const perfIssues = this.checkPerformanceAntiPatterns(analysis);
      issues.push(...perfIssues);
    }
    
    return {
      agent: this.name,
      issues,
      summary: this.generateSummary(issues),
      recommendations: this.generateRecommendations(issues)
    };
  }
  
  private checkPerformanceAntiPatterns(analysis: FileAnalysis): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    
    // Check for synchronous operations
    const syncPattern = /(readFileSync|writeFileSync|execSync)/g;
    let match;
    while ((match = syncPattern.exec(analysis.content)) !== null) {
      issues.push(this.createIssue(
        'medium',
        'Synchronous file system operation detected',
        {
          file: analysis.filePath,
          line: this.getLineNumber(analysis.content, match.index),
          column: match.index
        },
        'Use asynchronous alternatives'
      ));
    }
    
    return issues;
  }
}
```

## Review Result Processing

### 1. Result Aggregation

```typescript
interface ReviewAggregation {
  strategy: 'merge' | 'prioritize' | 'filter';
  conflictResolution: 'highest-severity' | 'most-specific' | 'all';
  deduplication: boolean;
}

class ResultAggregator {
  aggregate(results: ReviewResult[], config: ReviewAggregation): AggregatedReview {
    switch (config.strategy) {
      case 'merge':
        return this.mergeResults(results, config);
      case 'prioritize':
        return this.prioritizeResults(results, config);
      case 'filter':
        return this.filterResults(results, config);
      default:
        throw new Error(`Unknown aggregation strategy: ${config.strategy}`);
    }
  }
  
  private mergeResults(results: ReviewResult[], config: ReviewAggregation): AggregatedReview {
    let allIssues: ReviewIssue[] = [];
    
    results.forEach(result => {
      allIssues.push(...result.issues);
    });
    
    if (config.deduplication) {
      allIssues = this.deduplicateIssues(allIssues);
    }
    
    return {
      issues: allIssues,
      summary: this.generateMergedSummary(results),
      recommendations: this.mergeRecommendations(results),
      metrics: this.calculateAggregatedMetrics(results)
    };
  }
}
```

### 2. Report Generation

```typescript
interface ReviewReport {
  id: string;
  timestamp: number;
  context: ReviewContext;
  results: AggregatedReview;
  metrics: ReviewMetrics;
  actions: ReviewAction[];
}

class ReportGenerator {
  generateReport(results: ReviewResult[], context: ReviewContext): ReviewReport {
    const aggregated = this.aggregateResults(results);
    const metrics = this.calculateMetrics(aggregated);
    const actions = this.generateActions(aggregated);
    
    return {
      id: this.generateReportId(),
      timestamp: Date.now(),
      context,
      results: aggregated,
      metrics,
      actions
    };
  }
  
  private generateActions(review: AggregatedReview): ReviewAction[] {
    return review.issues
      .filter(issue => issue.severity === 'critical' || issue.severity === 'high')
      .map(issue => ({
        type: 'fix-required',
        issue: issue.id,
        description: `Fix ${issue.message}`,
        priority: issue.severity,
        assignee: this.suggestAssignee(issue),
        dueDate: this.calculateDueDate(issue.severity)
      }));
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
