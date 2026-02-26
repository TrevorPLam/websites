# MCP Integration Guide for Claude Agents

## Overview
This guide provides Claude-specific patterns for Model Context Protocol (MCP) integration in the marketing websites monorepo.

## Available MCP Servers

### Core Servers
- **filesystem**: File system operations with read-only defaults
- **git**: Git repository operations (no push allowed)
- **fetch**: HTTP requests to external APIs
- **sqlite**: Local database operations

### Claude-Optimized Servers
- **sequential-thinking**: Externalized reasoning with step-by-step decomposition
- **knowledge-graph**: Persistent memory with temporal awareness
- **github**: Repository management with token authentication
- **documentation**: RAG-based documentation retrieval

### Enterprise Servers
- **azure-mcp**: Azure infrastructure management
- **observability**: Performance monitoring and alerting
- **enterprise-registry**: Service discovery and governance
- **ticketer**: Project management (Linear/Jira integration)

## Claude-Specific MCP Patterns

### 1. Sequential Thinking Integration
```typescript
// Claude prefers structured reasoning patterns
const reasoningPattern = {
  approach: "sequential-thinking",
  steps: [
    "analyze current state",
    "identify constraints", 
    "research solutions",
    "implement solution",
    "validate results"
  ],
  branching: true // Enable alternative approaches
};
```

### 2. Knowledge Graph Memory
```typescript
// Claude memory persistence patterns
const memoryPattern = {
  temporal: true, // Track information evolution
  semantic: true, // Enable relationship discovery
  consent: true, // Privacy compliance
  consolidation: true // Pattern extraction
};
```

### 3. GitHub Integration
```typescript
// Claude GitHub workflow patterns
const githubPattern = {
  auth: "token-based",
  operations: [
    "list-repositories",
    "get-repository-info", 
    "create-issues",
    "update-status"
  ],
  errorHandling: "graceful-failure"
};
```

## Server Configuration

### Development Environment
```json
{
  "sequential-thinking": {
    "LOG_LEVEL": "debug",
    "NODE_ENV": "development"
  },
  "knowledge-graph": {
    "LOG_LEVEL": "debug", 
    "NODE_ENV": "development"
  },
  "github": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    "LOG_LEVEL": "debug"
  }
}
```

### Production Environment
```json
{
  "sequential-thinking": {
    "LOG_LEVEL": "info",
    "NODE_ENV": "production"
  },
  "observability": {
    "LOG_LEVEL": "warn",
    "ALERT_ENDPOINT": "${ALERT_WEBHOOK}"
  }
}
```

## Workflow Orchestration

### Claude-Preferred Workflow Order
1. **Research Phase**: Use sequential-thinking + knowledge-graph
2. **Discovery Phase**: Use filesystem + documentation servers
3. **Implementation Phase**: Use github + fetch servers
4. **Validation Phase**: Use observability + ticketer servers
5. **Documentation Phase**: Use documentation server for updates

### Parallel Execution Patterns
```typescript
// Claude maximizes parallel tool execution
const parallelPattern = {
  research: ["sequential-thinking", "knowledge-graph"],
  discovery: ["filesystem", "documentation"],
  implementation: ["github", "fetch"],
  validation: ["observability"]
};
```

## Error Handling

### Claude Error Classification
- **Recoverable**: Retry with exponential backoff
- **Non-Critical**: Log and continue workflow
- **Critical**: Halt execution and alert
- **Authentication**: Request new credentials

### Error Recovery Strategies
```typescript
const errorRecovery = {
  "timeout": "retry-with-backoff",
  "authentication": "request-new-token",
  "rate-limit": "implement-exponential-backoff",
  "server-error": "fallback-to-alternative"
};
```

## Performance Optimization

### Claude Performance Patterns
- Use parallel tool calls for independent operations
- Batch similar operations together
- Cache frequently accessed data
- Use sequential-thinking for complex decisions

### Memory Management
- Use knowledge-graph for persistent context
- Implement memory consolidation for patterns
- Clear working memory between tasks
- Use consent management for privacy

## Security Considerations

### Claude Security Patterns
- Validate all inputs with Zod schemas
- Use read-first defaults for file operations
- Implement proper token management
- Follow zero-trust architecture principles

### Data Privacy
- Obtain consent before storing personal data
- Use anonymization for sensitive information
- Implement data retention policies
- Follow GDPR/CCPA compliance

## Troubleshooting

### Common MCP Issues
| Server | Issue | Solution |
|--------|-------|----------|
| sequential-thinking | No response | Check NODE_ENV and LOG_LEVEL |
| knowledge-graph | Memory loss | Verify consent settings |
| github | Auth failures | Validate GITHUB_TOKEN |
| documentation | Empty results | Check DOCS_DIR path |

### Debug Patterns
```typescript
const debugPattern = {
  logging: "debug-level",
  tracing: "correlation-ids",
  monitoring: "real-time-dashboards",
  alerting: "critical-errors-only"
};
```

## Best Practices

### DO
- Use parallel tool execution whenever possible
- Implement proper error handling and recovery
- Follow security-first architecture patterns
- Use memory systems for persistent context
- Monitor performance and optimize bottlenecks

### DON'T
- Don't hardcode credentials or tokens
- Don't ignore error conditions
- Don't use blocking operations in parallel workflows
- Don't store sensitive data without consent
- Don't skip validation steps

## Integration Examples

### Research Workflow
```typescript
// Claude research pattern
const researchWorkflow = {
  step1: "sequential-thinking.analyze-problem",
  step2: "knowledge-graph.search-related-context", 
  step3: "documentation.search-relevant-docs",
  step4: "fetch.get-external-references",
  step5: "sequential-thinking.synthesize-findings"
};
```

### Implementation Workflow
```typescript
// Claude implementation pattern
const implementationWorkflow = {
  step1: "filesystem.read-target-files",
  step2: "github.create-feature-branch",
  step3: "sequential-thinking.plan-changes",
  step4: "filesystem.write-updated-files",
  step5: "github.create-pull-request"
};
```

## References
- MCP Protocol Specification
- Sequential Thinking Server Documentation
- Knowledge Graph Memory System
- GitHub MCP Server Guide
- Claude Agent Integration Patterns
