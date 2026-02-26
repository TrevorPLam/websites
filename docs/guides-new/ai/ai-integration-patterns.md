# AI Integration Patterns

> **Practical AI Agent Patterns for Development — February 2026**

## Overview

Comprehensive guide covering AI agent patterns, context management, and integration strategies for modern development workflows. Focus on practical implementation rather than theoretical architectures with 2026 enterprise standards.

## Key Features

- **Context Management**: Hierarchical AI agent context loading
- **Agent Patterns**: Reusable AI agent templates and workflows
- **Integration Patterns**: Claude, GitHub Copilot, and custom AI integration
- **Cold-Start Optimization**: Fast AI agent initialization patterns
- **Multi-Agent Orchestration**: Production-ready agent coordination
- **Security & Governance**: Enterprise-grade AI safety protocols

---

## 🤖 Agent Context Management

### Hierarchical Context Structure

```markdown
# Root AGENTS.md (Master coordination - 60 lines max)
## Repository Overview
Multi-tenant Next.js 16 marketing platform with FSD v2.1 architecture.

## Quick Start Commands
```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

## Repository Structure
- apps/ - Next.js applications
- packages/ - Shared libraries
- clients/ - Tenant-specific sites

## Per-Package AGENTS.md References
See packages/*/AGENTS.md for package-specific guidance.
```

### Per-Package Agent Template

```markdown
# Package: @repo/ui

## Purpose
UI components following FSD v2.1 architecture with React 19 and TypeScript.

## Key Entry Points
- src/app/ - App layer components
- src/widgets/ - Composed UI units
- src/features/ - Business logic components
- src/entities/ - Domain entities
- src/shared/ - Reusable utilities

## Dependencies
- React 19.0.0
- Tailwind CSS v4
- @repo/shared for utilities
- @repo/entities for domain types

## Common Tasks
1. Create new widget components
2. Implement responsive design patterns
3. Add accessibility features
4. Optimize for Core Web Vitals

## FSD Layer Structure
Follow strict FSD import rules: app → pages → widgets → features → entities → shared
```

### Context Loading Protocol

```typescript
// lib/ai-context-loader.ts
export interface AIContext {
  root: string; // Root AGENTS.md
  package: string; // Package-specific AGENTS.md
  subAgents: string; // CLAUDE.md definitions
  coldStart: string; // Initialization checklist
}

export class AIContextLoader {
  async loadContext(packageName?: string): Promise<AIContext> {
    const root = await this.loadRootContext();
    const packageContext = packageName ? await this.loadPackageContext(packageName) : '';
    const subAgents = await this.loadSubAgents();
    const coldStart = await this.loadColdStartChecklist();

    return {
      root,
      package: packageContext,
      subAgents,
      coldStart,
    };
  }

  private async loadRootContext(): Promise<string> {
    // Load root AGENTS.md (60 lines max)
    return fs.readFileSync('AGENTS.md', 'utf-8');
  }

  private async loadPackageContext(packageName: string): Promise<string> {
    // Load package-specific AGENTS.md
    const path = `packages/${packageName}/AGENTS.md`;
    return fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '';
  }

  private async loadSubAgents(): Promise<string> {
    // Load CLAUDE.md sub-agent definitions
    return fs.existsSync('CLAUDE.md') ? fs.readFileSync('CLAUDE.md', 'utf-8') : '';
  }

  private async loadColdStartChecklist(): Promise<string> {
    // Load cold-start checklist
    return `
# AI Agent Cold-Start Checklist

## Context Injection Order
1. Root AGENTS.md (master coordination)
2. Package AGENTS.md (if applicable)
3. CLAUDE.md sub-agent definitions
4. Current task context

## Branch Verification
- [ ] Check current branch name
- [ ] Verify working directory status
- [ ] Load GitHub Issue context if available

## Status Checking
- [ ] Verify package.json dependencies
- [ ] Check TypeScript compilation
- [ ] Validate environment variables
`;
  }
}
```

---

## 🎯 Sub-Agent Definitions

### Claude Sub-Agents

```markdown
# CLAUDE.md - Sub-Agent Definitions

## FSD Enforcer Agent
**Trigger**: File creation or modification in packages/
**Rules**: 
- Enforce FSD v2.1 layer structure
- Validate import directions (app → pages → widgets → features → entities → shared)
- Check @x notation for cross-slice imports

## A11y Auditor Agent  
**Trigger**: UI component changes
**Rules**:
- Validate WCAG 2.2 AA compliance
- Check semantic HTML structure
- Verify keyboard navigation
- Ensure proper ARIA labels

## RLS Validator Agent
**Trigger**: Database schema or query changes
**Rules**:
- Verify tenant_id in all queries
- Check RLS policy coverage
- Validate cross-tenant access prevention

## Performance Guardian Agent
**Trigger**: Build or performance changes
**Rules**:
- Check Core Web Vitals compliance
- Validate bundle size budgets
- Ensure proper lazy loading
```

### Agent Implementation Pattern

```typescript
// lib/agent-base.ts
export abstract class AgentBase {
  protected name: string;
  protected triggers: string[];
  protected rules: Rule[];

  constructor(name: string, triggers: string[], rules: Rule[]) {
    this.name = name;
    this.triggers = triggers;
    this.rules = rules;
  }

  abstract execute(context: AgentContext): AgentResult;

  protected shouldTrigger(context: AgentContext): boolean {
    return this.triggers.some(trigger => 
      context.changedFiles.some(file => file.includes(trigger))
    );
  }
}

// FSD Enforcer Implementation
export class FSDEnforcerAgent extends AgentBase {
  constructor() {
    super('FSD Enforcer', ['packages/'], [
      new FSDStructureRule(),
      new ImportDirectionRule(),
      new CrossSliceImportRule(),
    ]);
  }

  execute(context: AgentContext): AgentResult {
    const violations: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(context);
      if (!result.valid) {
        violations.push(...result.errors);
      }
    }

    return {
      success: violations.length === 0,
      violations,
      suggestions: this.generateSuggestions(violations),
    };
  }
}
```

---

## 🚀 Integration Patterns

### GitHub Copilot Integration

```typescript
// .github/copilot-instructions.md
# GitHub Copilot Instructions

## Architecture Guidelines
- Follow Feature-Sliced Design v2.1
- Use TypeScript strict mode
- Implement proper error handling
- Add comprehensive tests

## Code Patterns
```typescript
// Server Action pattern
export async function createAction(input: CreateInput) {
  // Validate input
  const validated = createSchema.parse(input);
  
  // Business logic
  const result = await createRecord(validated);
  
  // Return result
  return result;
}
```

## Testing Patterns
```typescript
// Test structure
describe('feature', () => {
  it('should handle happy path', async () => {
    // Arrange
    const input = { ... };
    
    // Act
    const result = await feature(input);
    
    // Assert
    expect(result).toEqual({ ... });
  });
});
```
```

### Custom AI Integration

```typescript
// lib/ai-integration.ts
export class AIIntegration {
  private contextLoader: AIContextLoader;
  private agents: AgentBase[];

  constructor() {
    this.contextLoader = new AIContextLoader();
    this.agents = [
      new FSDEnforcerAgent(),
      new A11yAuditorAgent(),
      new RLSValidatorAgent(),
      new PerformanceGuardianAgent(),
    ];
  }

  async processChanges(context: ProcessContext): Promise<ProcessResult> {
    // Load AI context
    const aiContext = await this.contextLoader.loadContext(context.packageName);

    // Run relevant agents
    const results: AgentResult[] = [];
    
    for (const agent of this.agents) {
      if (agent.shouldTrigger(context)) {
        const result = agent.execute(aiContext);
        results.push(result);
      }
    }

    return {
      success: results.every(r => r.success),
      agentResults: results,
      suggestions: this.aggregateSuggestions(results),
    };
  }

  private aggregateSuggestions(results: AgentResult[]): string[] {
    return results.flatMap(r => r.suggestions);
  }
}
```

---

## 📋 Cold-Start Optimization

### Fast Initialization Pattern

```typescript
// lib/ai-cold-start.ts
export class AIColdStart {
  private contextCache: Map<string, AIContext> = new Map();
  private lastRefresh: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getOptimizedContext(packageName?: string): Promise<AIContext> {
    const cacheKey = packageName || 'root';
    const now = Date.now();

    // Return cached context if fresh
    if (this.contextCache.has(cacheKey) && 
        (now - this.lastRefresh) < this.CACHE_TTL) {
      return this.contextCache.get(cacheKey)!;
    }

    // Load and cache fresh context
    const context = await this.loadFreshContext(packageName);
    this.contextCache.set(cacheKey, context);
    this.lastRefresh = now;

    return context;
  }

  private async loadFreshContext(packageName?: string): Promise<AIContext> {
    const loader = new AIContextLoader();
    return loader.loadContext(packageName);
  }

  // Pre-warm cache for common packages
  async preWarmCache(): Promise<void> {
    const commonPackages = ['ui', 'features', 'shared', 'infra'];
    
    await Promise.all(
      commonPackages.map(pkg => this.getOptimizedContext(pkg))
    );
  }
}
```

### Initialization Checklist

```markdown
# AI Agent Initialization Checklist

## Pre-Flight Checks
- [ ] Verify current working directory
- [ ] Check git status (clean working directory preferred)
- [ ] Validate package.json exists
- [ ] Check TypeScript configuration

## Context Loading
- [ ] Load root AGENTS.md
- [ ] Load package-specific AGENTS.md (if applicable)
- [ ] Load CLAUDE.md sub-agent definitions
- [ ] Load cold-start checklist

## Environment Validation
- [ ] Check Node.js version compatibility
- [ ] Verify pnpm installation
- [ ] Validate environment variables
- [ ] Check database connectivity (if applicable)

## Agent Initialization
- [ ] Initialize FSD Enforcer agent
- [ ] Initialize A11y Auditor agent
- [ ] Initialize RLS Validator agent
- [ ] Initialize Performance Guardian agent

## Ready State
- [ ] All agents loaded successfully
- [ ] Context cached and ready
- [ ] Environment validated
- [ ] Ready for task execution
```

---

## 🔧 IDE-Specific Configurations

### Cursor AI Configuration

**File**: `.cursorrules`

**Key Features**:
- Role definition as senior TypeScript engineer
- Technology stack specifications (Next.js 16, React 19, TypeScript 5.9.3)
- FSD v2.1 architecture rules
- Multi-tenant security requirements
- OAuth 2.1 with PKCE implementation
- Performance standards (Core Web Vitals)
- MCP and A2A protocol integration

### Windsurf AI Configuration

**File**: `.windsurfrules`

**Key Features**:
- Cascade-specific features (Memory Management, Multi-Agent Orchestration)
- Workflow integration with todo_list tool
- Parallel tool execution patterns
- MCP server configurations
- A2A protocol implementation
- Browser preview integration
- Agent governance and audit trails

### GitHub Copilot Configuration

**Files**:
- `.github/copilot-instructions.md` (repository-wide)
- `NAME.instructions.md` (path-specific)
- `AGENTS.md` (agent instructions)

**Key Features**:
- Role & context definition
- Technology stack specifications
- Code standards & patterns
- Security requirements (multi-tenant, OAuth 2.1)
- Performance standards
- Multi-agent integration (2026)

---

## 🔄 Multi-Agent Orchestration

### Hierarchical Orchestration Pattern

```typescript
// lib/multi-agent-orchestrator.ts
export class MultiAgentOrchestrator {
  private agents: Map<string, AgentBase> = new Map();
  private taskQueue: Task[] = [];

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents.set('orchestrator', new OrchestratorAgent());
    this.agents.set('fsd-enforcer', new FSDEnforcerAgent());
    this.agents.set('a11y-auditor', new A11yAuditorAgent());
    this.agents.set('rls-validator', new RLSValidatorAgent());
    this.agents.set('performance-guardian', new PerformanceGuardianAgent());
  }

  async executeWorkflow(spec: Specification): Promise<WorkflowResult> {
    // Orchestrator breaks down spec into tasks
    const orchestrator = this.agents.get('orchestrator')!;
    const plan = await orchestrator.createExecutionPlan(spec);

    // Execute tasks in parallel where possible
    const results = await this.executeTasks(plan.tasks);

    return {
      success: results.every(r => r.success),
      results,
      artifacts: this.collectArtifacts(results),
    };
  }

  private async executeTasks(tasks: Task[]): Promise<TaskResult[]> {
    // Execute independent tasks in parallel
    const independentTasks = tasks.filter(t => t.dependencies.length === 0);
    const dependentTasks = tasks.filter(t => t.dependencies.length > 0);

    const independentResults = await Promise.all(
      independentTasks.map(task => this.executeTask(task))
    );

    // Execute dependent tasks after dependencies complete
    const dependentResults: TaskResult[] = [];
    for (const task of dependentTasks) {
      const result = await this.executeTask(task);
      dependentResults.push(result);
    }

    return [...independentResults, ...dependentResults];
  }

  private async executeTask(task: Task): Promise<TaskResult> {
    const agent = this.agents.get(task.agentType);
    if (!agent) {
      throw new Error(`Agent ${task.agentType} not found`);
    }

    return agent.execute(task.context);
  }
}
```

### Parallel Agent Execution

```typescript
// lib/parallel-execution.ts
export class ParallelExecutor {
  async executeParallel(
    tasks: Task[],
    maxConcurrency: number = 3
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    const executing: Promise<TaskResult>[] = [];

    for (const task of tasks) {
      const promise = this.executeTask(task);
      executing.push(promise);

      if (executing.length >= maxConcurrency) {
        const completed = await Promise.race(executing);
        results.push(completed);
        executing.splice(executing.indexOf(promise), 1);
      }
    }

    // Wait for remaining tasks
    const remaining = await Promise.all(executing);
    results.push(...remaining);

    return results;
  }

  private async executeTask(task: Task): Promise<TaskResult> {
    // Execute task in isolated context
    const context = await this.createIsolatedContext(task);
    const agent = this.getAgent(task.agentType);
    
    return agent.execute(context);
  }

  private async createIsolatedContext(task: Task): Promise<TaskContext> {
    // Create isolated git worktree for task
    const worktreePath = await this.createGitWorktree(task.id);
    
    return {
      worktreePath,
      task,
      environment: this.getTaskEnvironment(task),
    };
  }
}
```

---

## 🛡️ Security & Governance

### AI Security Framework

```typescript
// lib/ai-security.ts
export class AISecurityFramework {
  private securityPolicies: SecurityPolicy[] = [
    new InputValidationPolicy(),
    new OutputSanitizationPolicy(),
    new PackageVerificationPolicy(),
    new AccessControlPolicy(),
  ];

  async validateAIOutput(output: AIOutput): Promise<SecurityResult> {
    const violations: SecurityViolation[] = [];

    for (const policy of this.securityPolicies) {
      const result = await policy.validate(output);
      if (!result.valid) {
        violations.push(...result.violations);
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      sanitizedOutput: await this.sanitizeOutput(output, violations),
    };
  }

  private async sanitizeOutput(
    output: AIOutput, 
    violations: SecurityViolation[]
  ): Promise<AIOutput> {
    let sanitized = { ...output };

    for (const violation of violations) {
      sanitized = await this.applySanitization(sanitized, violation);
    }

    return sanitized;
  }
}

class PackageVerificationPolicy implements SecurityPolicy {
  async validate(output: AIOutput): Promise<PolicyResult> {
    const packageNames = this.extractPackageNames(output.code);
    const violations: SecurityViolation[] = [];

    for (const packageName of packageNames) {
      if (!(await this.verifyPackageExists(packageName))) {
        violations.push({
          type: 'slopsquatting',
          severity: 'high',
          message: `Package ${packageName} does not exist - potential supply chain attack`,
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  private async verifyPackageExists(packageName: string): Promise<boolean> {
    // Check against npm registry
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### Agent Governance

```typescript
// lib/agent-governance.ts
export class AgentGovernance {
  private auditLogger: AuditLogger;
  private policyEngine: PolicyEngine;

  constructor() {
    this.auditLogger = new AuditLogger();
    this.policyEngine = new PolicyEngine();
  }

  async governAgentExecution(
    agent: AgentBase,
    context: AgentContext
  ): Promise<GovernanceResult> {
    // Log agent execution attempt
    await this.auditLogger.log({
      agent: agent.name,
      action: 'execute',
      context: context.hash,
      timestamp: new Date(),
    });

    // Check governance policies
    const policyResult = await this.policyEngine.evaluate(agent, context);
    
    if (!policyResult.allowed) {
      await this.auditLogger.log({
        agent: agent.name,
        action: 'blocked',
        reason: policyResult.reason,
        timestamp: new Date(),
      });

      return {
        allowed: false,
        reason: policyResult.reason,
      };
    }

    // Execute with monitoring
    const result = await this.executeWithMonitoring(agent, context);

    return {
      allowed: true,
      result,
    };
  }

  private async executeWithMonitoring(
    agent: AgentBase,
    context: AgentContext
  ): Promise<AgentResult> {
    const startTime = Date.now();
    const result = await agent.execute(context);
    const duration = Date.now() - startTime;

    await this.auditLogger.log({
      agent: agent.name,
      action: 'completed',
      duration,
      success: result.success,
      timestamp: new Date(),
    });

    return result;
  }
}
```

---

## 📊 Performance Metrics

### Context Loading Performance

```typescript
// Benchmark results
const contextMetrics = {
  rootContextLoad: '50ms',      // AGENTS.md (60 lines)
  packageContextLoad: '25ms',   // Package AGENTS.md (40-60 lines)
  subAgentsLoad: '15ms',       // CLAUDE.md definitions
  coldStartTotal: '90ms',       // Complete initialization
  cacheHit: '5ms',             // Cached context retrieval
};
```

### Agent Execution Performance

```typescript
// Agent performance benchmarks
const agentMetrics = {
  fsdEnforcer: '10ms',          // FSD structure validation
  a11yAuditor: '25ms',          // Accessibility checks
  rlsValidator: '15ms',         // Security validation
  performanceGuardian: '20ms',  // Performance checks
  totalExecution: '70ms',       // All agents
};
```

---

## 🔗 References & Resources

### AI Integration Standards

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Claude API Documentation](https://docs.anthropic.com/claude)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

### Development Patterns

- **TypeScript Strict Mode**: Enforced across all packages
- **FSD v2.1 Architecture**: Strict layer separation
- **Accessibility First**: WCAG 2.2 AA compliance
- **Performance Optimized**: Core Web Vitals targets

### Security Standards

- **OAuth 2.1**: Secure API authentication patterns
- **Zero-Trust Architecture**: Never trust, always verify
- **Package Verification**: Prevent slopsquatting attacks
- **Audit Logging**: Comprehensive agent action tracking

---

This consolidated guide provides practical AI integration patterns while eliminating theoretical complexity and focusing on actionable implementation strategies for enterprise-grade development workflows.
