# autonomous-janitor-design.md


## Overview

The Autonomous Janitor is an AI agent designed to maintain repository hygiene by automatically triaging tests, managing stale branches, and performing routine maintenance tasks. This design document outlines the architecture, capabilities, and implementation patterns for a production-ready janitor agent based on 2026 AI agent research and best practices.

## Agent Architecture

### Core Components

```typescript
interface JanitorAgent {
  perception: EnvironmentScanner;
  decision: PolicyEngine;
  action: TaskExecutor;
  learning: FeedbackLoop;
  safety: SafetyLayer;
}
```

### Perception Layer

```typescript
class EnvironmentScanner {
  async scanRepository(): Promise<RepositoryState> {
    return {
      branches: await this.scanBranches(),
      tests: await this.scanTests(),
      issues: await this.scanIssues(),
      dependencies: await this.scanDependencies(),
      performance: await this.scanPerformance(),
    };
  }

  private async scanBranches(): Promise<BranchInfo[]> {
    const branches = await git.getBranches();
    return branches.map((branch) => ({
      name: branch.name,
      lastCommit: branch.lastCommit,
      age: this.calculateAge(branch.lastCommit),
      author: branch.author,
      mergeStatus: await this.getMergeStatus(branch.name),
      associatedPRs: await this.getAssociatedPRs(branch.name),
    }));
  }

  private async scanTests(): Promise<TestInfo[]> {
    const testResults = await this.getTestResults();
    return testResults.map((test) => ({
      file: test.file,
      status: test.status,
      duration: test.duration,
      flakiness: this.calculateFlakiness(test.history),
      lastRun: test.timestamp,
      coverage: test.coverage,
    }));
  }
}
```

### Decision Engine

```typescript
class PolicyEngine {
  private policies: Map<string, Policy> = new Map();

  constructor() {
    this.loadDefaultPolicies();
  }

  private loadDefaultPolicies() {
    // Stale branch policy
    this.policies.set('stale-branches', {
      name: 'Stale Branch Management',
      conditions: {
        maxAgeDays: 30,
        excludePatterns: ['main', 'develop', 'release/*'],
        requirePR: true,
        minCommits: 1,
      },
      actions: ['notify-author', 'add-stale-label', 'schedule-deletion'],
    });

    // Flaky test policy
    this.policies.set('flaky-tests', {
      name: 'Flaky Test Detection',
      conditions: {
        failureRate: 0.3,
        minRuns: 10,
        timeWindow: '7d',
      },
      actions: ['flag-for-review', 'create-issue', 'disable-temporarily'],
    });
  }

  async evaluate(state: RepositoryState): Promise<Action[]> {
    const actions: Action[] = [];

    for (const [policyName, policy] of this.policies) {
      const violations = await this.checkPolicy(policy, state);
      actions.push(...violations);
    }

    return this.prioritizeActions(actions);
  }

  private async checkPolicy(policy: Policy, state: RepositoryState): Promise<Action[]> {
    switch (policy.name) {
      case 'Stale Branch Management':
        return this.handleStaleBranches(policy, state.branches);
      case 'Flaky Test Detection':
        return this.handleFlakyTests(policy, state.tests);
      default:
        return [];
    }
  }
}
```

## Task Execution

### Branch Management

```typescript
class BranchManager {
  async handleStaleBranches(branches: BranchInfo[]): Promise<Action[]> {
    const actions: Action[] = [];
    const now = new Date();

    for (const branch of branches) {
      if (this.isStale(branch, now)) {
        if (this.hasAssociatedPR(branch)) {
          actions.push(await this.handleStalePRBranch(branch));
        } else {
          actions.push(await this.handleOrphanedBranch(branch));
        }
      }
    }

    return actions;
  }

  private isStale(branch: BranchInfo, now: Date): boolean {
    const ageInDays = (now.getTime() - branch.lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays > 30 && !this.isProtected(branch.name);
  }

  private async handleStalePRBranch(branch: BranchInfo): Promise<Action> {
    // Add stale label to PR
    await this.addLabel(branch.associatedPRs[0], 'stale');

    // Notify author
    await this.notifyAuthor(branch.author, {
      type: 'stale-branch',
      branch: branch.name,
      pr: branch.associatedPRs[0],
      actionDeadline: this.addDays(new Date(), 7),
    });

    return {
      type: 'branch-marked-stale',
      target: branch.name,
      deadline: this.addDays(new Date(), 14),
      requiresApproval: true,
    };
  }
}
```

### Test Triage

```typescript
class TestTriage {
  async analyzeTestResults(results: TestResult[]): Promise<Action[]> {
    const actions: Action[] = [];

    // Detect flaky tests
    const flakyTests = this.detectFlakyTests(results);
    for (const test of flakyTests) {
      actions.push(await this.handleFlakyTest(test));
    }

    // Identify slow tests
    const slowTests = this.detectSlowTests(results);
    for (const test of slowTests) {
      actions.push(await this.handleSlowTest(test));
    }

    // Check coverage regressions
    const coverageIssues = this.detectCoverageRegressions(results);
    for (const issue of coverageIssues) {
      actions.push(await this.handleCoverageIssue(issue));
    }

    return actions;
  }

  private detectFlakyTests(results: TestResult[]): FlakyTest[] {
    const testHistory = this.groupByTest(results);
    const flaky: FlakyTest[] = [];

    for (const [testName, history] of testHistory) {
      if (history.length < 10) continue; // Need sufficient data

      const failureRate = history.filter((r) => r.status === 'failed').length / history.length;
      if (failureRate >= 0.3) {
        flaky.push({
          name: testName,
          failureRate,
          lastFailure: Math.max(
            ...history.filter((r) => r.status === 'failed').map((r) => r.timestamp)
          ),
          pattern: this.analyzeFailurePattern(history),
        });
      }
    }

    return flaky;
  }

  private async handleFlakyTest(test: FlakyTest): Promise<Action> {
    // Create GitHub issue
    const issue = await this.createIssue({
      title: `Flaky test detected: ${test.name}`,
      body: this.generateFlakyTestReport(test),
      labels: ['flaky-test', 'test-maintenance'],
      assignees: this.getTestOwners(test.name),
    });

    // Temporarily disable if failure rate > 50%
    if (test.failureRate > 0.5) {
      await this.disableTest(test.name, {
        reason: 'High flakiness detected',
        issue: issue.url,
        reenableDate: this.addDays(new Date(), 3),
      });
    }

    return {
      type: 'flaky-test-handled',
      test: test.name,
      issue: issue.url,
      disabled: test.failureRate > 0.5,
    };
  }
}
```

## Safety Layer

### Approval Gates

```typescript
class SafetyLayer {
  private approvalRequired = new Set([
    'delete-branch',
    'merge-pr',
    'disable-test',
    'modify-production-config',
  ]);

  async validateAction(action: Action): Promise<ValidationResult> {
    // Check if approval is required
    if (this.approvalRequired.has(action.type)) {
      return await this.requestApproval(action);
    }

    // Validate against safety rules
    const safetyCheck = await this.checkSafetyRules(action);
    if (!safetyCheck.passed) {
      return { approved: false, reason: safetyCheck.reason };
    }

    return { approved: true };
  }

  private async checkSafetyRules(action: Action): Promise<SafetyCheck> {
    switch (action.type) {
      case 'delete-branch':
        return this.checkBranchDeletionSafety(action);
      case 'modify-code':
        return this.checkCodeModificationSafety(action);
      case 'create-issue':
        return this.checkIssueCreationSafety(action);
      default:
        return { passed: true };
    }
  }

  private async checkBranchDeletionSafety(action: Action): Promise<SafetyCheck> {
    const branch = action.target as string;

    // Never delete protected branches
    if (this.isProtectedBranch(branch)) {
      return { passed: false, reason: 'Cannot delete protected branch' };
    }

    // Check for unmerged changes
    const hasUnmergedChanges = await this.hasUnmergedChanges(branch);
    if (hasUnmergedChanges) {
      return { passed: false, reason: 'Branch has unmerged changes' };
    }

    // Check if recently active
    const lastActivity = await this.getLastActivity(branch);
    if (this.isRecentlyActive(lastActivity)) {
      return { passed: false, reason: 'Branch was recently active' };
    }

    return { passed: true };
  }
}
```

### Audit Trail

```typescript
class AuditLogger {
  async logAction(action: Action, result: ActionResult): Promise<void> {
    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      agentId: 'autonomous-janitor',
      action: action.type,
      target: action.target,
      result: result.success ? 'success' : 'failed',
      approvalRequired: action.requiresApproval,
      approvedBy: result.approvedBy,
      changes: result.changes,
      metadata: {
        policy: action.policy,
        confidence: action.confidence,
        executionTime: result.executionTime,
      },
    };

    await this.writeAuditLog(auditEntry);
    await this.notifyStakeholders(auditEntry);
  }

  private async writeAuditLog(entry: AuditEntry): Promise<void> {
    // Write to structured log
    await this.appendToLog('audit.log', JSON.stringify(entry));

    // Store in database for analysis
    await this.db.collection('audit_logs').insertOne(entry);

    // Send to monitoring system
    await this.monitoring.emit('janitor-action', entry);
  }
}
```

## Learning and Adaptation

### Feedback Loop

```typescript
class FeedbackLoop {
  async collectFeedback(): Promise<Feedback[]> {
    const feedback: Feedback[] = [];

    // Collect explicit feedback from GitHub reactions
    feedback.push(...(await this.collectGitHubFeedback()));

    // Collect implicit feedback from behavior
    feedback.push(...(await this.collectBehavioralFeedback()));

    // Collect performance metrics
    feedback.push(...(await this.collectPerformanceFeedback()));

    return feedback;
  }

  async updatePolicies(feedback: Feedback[]): Promise<void> {
    for (const item of feedback) {
      switch (item.type) {
        case 'false-positive':
          await this.adjustThresholds(item.policy, -0.1);
          break;
        case 'missed-issue':
          await this.adjustThresholds(item.policy, 0.1);
          break;
        case 'action-reverted':
          await this.blacklistAction(item.action, item.context);
          break;
      }
    }

    await this.saveUpdatedPolicies();
  }

  private async adjustThresholds(policyName: string, adjustment: number): Promise<void> {
    const policy = this.policies.get(policyName);
    if (policy && policy.thresholds) {
      for (const [key, value] of Object.entries(policy.thresholds)) {
        policy.thresholds[key] = Math.max(0, Math.min(1, value + adjustment));
      }
    }
  }
}
```

## Configuration

### Policy Configuration

```yaml
# .janitor/policies.yaml
policies:
  stale-branches:
    enabled: true
    max_age_days: 30
    exclude_patterns:
      - 'main'
      - 'develop'
      - 'release/*'
      - 'hotfix/*'
    actions:
      - type: 'add-label'
        label: 'stale'
        after_days: 14
      - type: 'notify-author'
        template: 'stale-branch-notice'
      - type: 'schedule-deletion'
        after_days: 30
        require_approval: true

  flaky-tests:
    enabled: true
    failure_rate_threshold: 0.3
    min_runs: 10
    time_window_days: 7
    actions:
      - type: 'create-issue'
        labels: ['flaky-test', 'test-maintenance']
      - type: 'disable-test'
        failure_rate_threshold: 0.5
        auto_reenable_days: 3

  dependency-updates:
    enabled: true
    check_schedule: 'weekly'
    auto_update_minor: true
    auto_update_patch: true
    major_updates_require_approval: true
```

### Agent Configuration

```yaml
# .janitor/agent.yaml
agent:
  name: 'autonomous-janitor'
  version: '1.0.0'
  schedule: '0 2 * * *' # Run daily at 2 AM

  limits:
    max_actions_per_run: 10
    max_execution_time_minutes: 30
    max_branches_per_run: 5

  notifications:
    slack:
      webhook_url: '${SLACK_WEBHOOK_URL}'
      channel: '#repo-maintenance'
    email:
      enabled: true
      recipients: ['dev-team@company.com']

  safety:
    require_approval_for:
      - 'delete-branch'
      - 'merge-pr'
      - 'modify-production'
    dry_run_mode: false
    audit_log_retention_days: 90
```

## Implementation Roadmap

### Phase 1: Core Functionality (Weeks 1-2)

- Basic repository scanning
- Stale branch detection
- Simple notification system
- Audit logging

### Phase 2: Advanced Features (Weeks 3-4)

- Flaky test detection
- Dependency update monitoring
- Performance issue detection
- Feedback loop implementation

### Phase 3: Integration & Optimization (Weeks 5-6)

- GitHub integration optimization
- Slack/Teams notifications
- Performance tuning
- Safety layer enhancements

### Phase 4: Production Deployment (Weeks 7-8)

- Production configuration
- Monitoring and alerting
- Documentation and training
- Gradual rollout with safety measures

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Measuring AI Agent Autonomy in Practice - Anthropic](https://www.anthropic.com/research/measuring-agent-autonomy)
- [Autonomous AI Agents: Transforming Enterprise Workflows 2026](https://www.aibmag.com/featured-stories/autonomous-ai-agents-enterprise-workflows-2026/)
- [6 Best Autonomous AI Agents in the U.S. (2026)](https://minami.ai/blog/best-autonomous-ai-agent)
- [Taming AI agents: The autonomous workforce of 2026](https://www.cio.com/article/4064998/taming-ai-agents-the-autonomous-workforce-of-2026.html)
- [10 Real-World Intelligent Agent Examples in AI (2026)](https://www.aitude.com/10-real-world-intelligent-agent-examples-in-artificial-intelligence/)


## Best Practices

[Add content here]


## Testing

[Add content here]