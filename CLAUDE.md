# Claude Code Sub-Agents

## Multi-Agent Orchestration Framework (2026)

### Core Sub-Agents

#### FSD Enforcer
- Enforces FSD placement and dependency direction
- Verifies public API export boundaries
- Flags cross-slice imports that do not use `@x`
- **2026 Enhancement:** Validates MCP server integration patterns

#### Architecture Reviewer  
- Validates alignment with domain plan documents
- Verifies dependency and layering constraints
- Checks new files for naming and structural consistency
- **2026 Enhancement:** Reviews A2A protocol compliance

#### QA Orchestrator
- Runs targeted checks after each completed task
- Records pass/fail outcome in the related task document
- Runs a final end-to-end QA sweep before handoff
- **2026 Enhancement:** Validates multi-agent communication integrity

#### Docs Maintainer
- Updates task files with implementation + QA notes
- Keeps `TODO.md` in sync with completion state
- Ensures references to related implementation files are present
- **2026 Enhancement:** Maintains MCP server documentation

#### Security Enforcer
- Checks action and data flow changes for validation and isolation
- Flags risky patterns or missing safeguards
- **2026 Enhancement:** Validates OAuth 2.1 and zero-trust patterns

### 2026 Orchestration Patterns

#### Agent Discovery & Coordination
```typescript
// Agent Card at /.well-known/agent-card.json
{
  "name": "FSD Enforcer",
  "version": "1.0.0",
  "capabilities": ["fsd-validation", "mcp-integration"],
  "endpoints": {
    "health": "/health",
    "validate": "/validate"
  },
  "authentication": "oauth2"
}
```

#### A2A Communication Flow
1. **Discovery:** Agents read each other's agent cards
2. **Initiation:** Client agent sends JSON-RPC request
3. **Execution:** Server agent processes autonomously
4. **Response:** Results returned via SSE streaming

#### MCP Integration Patterns
- **Tool Access:** Agents use MCP servers for external tool access
- **Context Retrieval:** Knowledge-graph MCP for memory management
- **Repository Access:** GitHub MCP for code operations

### Agent Lifecycle Management

#### Phase 1: Initialization
- Load agent configuration from `.mcp/config.json`
- Register capabilities in central agent registry
- Establish OAuth 2.1 credentials for A2A communication

#### Phase 2: Operation
- Process tasks via defined orchestration patterns
- Maintain audit logs with correlation IDs
- Coordinate with other agents via A2A protocol

#### Phase 3: Cleanup
- Update task documentation with completion status
- Release MCP server connections
- Archive interaction logs for compliance

## Implementation Guidelines

### When to Trigger Sub-Agents

#### FSD Enforcer Triggers:
- New file creation in packages/
- Cross-slice import additions
- Export boundary modifications
- MCP server integration changes

#### Architecture Reviewer Triggers:
- Domain plan task implementation
- Major structural changes
- A2A protocol implementation
- Dependency graph updates

#### QA Orchestrator Triggers:
- Task completion milestones
- Before PR creation
- Multi-agent coordination validation
- Production deployment preparation

#### Security Enforcer Triggers:
- Authentication flow changes
- Database access pattern modifications
- OAuth 2.1 implementation updates
- Zero-trust architecture changes

### Agent Coordination Best Practices

1. **Sequential Processing:** FSD Enforcer → Architecture Reviewer → Security Enforcer → QA Orchestrator
2. **Parallel Validation:** Multiple agents can run independent checks simultaneously
3. **Rollback Coordination:** All agents must agree on rollback decisions
4. **Audit Trail:** Every agent action logged with correlation ID

## Related Documentation

- **[AGENTS.md](AGENTS.md)** - Master AI agent context
- **[README.md](README.md)** - Project overview
- **[TODO.md](TODO.md)** - Task tracking
- **[ANALYSIS.md](ANALYSIS.md)** - Repository analysis
- **[.mcp/README.md](.mcp/README.md)** - MCP server documentation
