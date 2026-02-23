# monorepo-context-protocol-proposal.md

## Overview

The Monorepo Context Protocol (MCP) is an emerging standard for AI agents to effectively navigate and operate within monorepo environments. This protocol addresses the unique challenges AI assistants face when working with large, interconnected codebases containing multiple packages, dependencies, and build systems.

## Core Concepts

### Agent Skills Architecture

Based on the Nx AI Agent Skills framework introduced in early 2026, the MCP distinguishes between:

- **MCP Server Tools**: Remote service connections (CI status, cloud services)
- **Agent Skills**: Structured knowledge and procedures loaded incrementally

```bash
# Setup command for monorepo AI agent configuration
npx nx configure-ai-agents
```

### Context Loading Strategy

Unlike traditional system prompts that dump all information upfront, MCP uses **incremental context loading**:

```typescript
// Skills are loaded only when needed
interface AgentSkill {
  id: string;
  triggers: string[];
  procedure: Procedure[];
  dependencies?: string[];
}

// Example skill structure
const workspaceExplorationSkill: AgentSkill = {
  id: 'workspace-exploration',
  triggers: ['explore workspace', 'find packages', 'understand structure'],
  procedure: [
    'Read workspace configuration files',
    'Analyze dependency graph',
    'Identify package boundaries',
    'Map build relationships',
  ],
};
```

## Protocol Specification

### 1. Workspace Discovery

AI agents must first understand the monorepo structure:

```yaml
# .mcp/workspace-config.yaml
workspace:
  type: 'pnpm' | 'npm' | 'yarn' | 'bun'
  root: '.'
  packages: 'packages/*'
  tools: ['nx', 'turborepo', 'changesets']

discovery:
  config_files:
    - 'pnpm-workspace.yaml'
    - 'package.json'
    - 'nx.json'
    - 'turbo.json'
  dependency_sources:
    - 'package.json dependencies'
    - 'tsconfig.json paths'
    - 'nx project graph'
```

### 2. Agent Skill Definition

Skills are defined as structured procedures:

```markdown
# skill: generate-component

## Triggers

- "create component"
- "generate component"
- "add new component"

## Prerequisites

- Component library exists
- Design system available
- Testing framework configured

## Procedure

1. Identify target package using workspace protocol
2. Check component library exports
3. Generate component using appropriate generator
4. Update barrel exports
5. Run affected tests
6. Verify type checking

## Tools Required

- file system access
- terminal execution
- package manager commands
```

### 3. Multi-Tool Coordination

The protocol defines how agents coordinate across different AI coding tools:

```typescript
// Universal skill configuration
interface UniversalSkillConfig {
  claude_code: {
    mcp_server: string;
    skills_path: string;
  };
  cursor: {
    workspace_config: string;
    agent_capabilities: string[];
  };
  github_copilot: {
    context_files: string[];
    skill_definitions: string[];
  };
}
```

## Implementation Patterns

### Nx Integration

```bash
# Nx MCP Server for remote connections
npx nx register-mcp-server

# Skills configuration
npx skills add nrwl/nx-ai-agents-config
```

### Workspace Protocol Handling

Agents must understand different workspace protocols:

```javascript
// Automatic workspace protocol detection
function detectWorkspaceProtocol(root) {
  if (exists('pnpm-workspace.yaml')) return 'pnpm';
  if (exists('lerna.json')) return 'lerna';
  if (exists('nx.json')) return 'nx';
  if (exists('turbo.json')) return 'turborepo';
  return 'npm';
}

// Protocol-specific package resolution
function resolvePackage(protocol, packageName) {
  switch (protocol) {
    case 'pnpm':
      return `workspace:${packageName}`;
    case 'npm':
      return `file:../${packageName}`;
    case 'nx':
      return `@${packageName}`;
    default:
      return packageName;
  }
}
```

### Build System Integration

```yaml
# .mcp/build-integration.yaml
build_systems:
  nx:
    commands:
      - 'nx build'
      - 'nx test'
      - 'nx lint'
      - 'nx affected:build'
    graph_queries:
      - 'nx graph'
      - 'nx show projects'

  turborepo:
    commands:
      - 'turbo build'
      - 'turbo test'
      - 'turbo run'
    cache_aware: true
```

## Security Considerations

### Access Control

```yaml
# .mcp/security.yaml
permissions:
  file_system:
    read: ['packages/**', 'docs/**', 'configs/**']
    write: ['packages/*/src/**', 'tests/**']
    exclude: ['node_modules/**', '.git/**']

  terminal:
    allowed_commands:
      - 'nx *'
      - 'pnpm *'
      - 'npm test'
      - 'git status'
    blocked_commands:
      - 'rm -rf'
      - 'sudo'
      - 'chmod 777'
```

### Audit Trail

```typescript
interface AgentAction {
  timestamp: string;
  agent_id: string;
  skill_used: string;
  action: string;
  files_modified: string[];
  commands_executed: string[];
  user_approval: boolean;
}
```

## Best Practices

### 1. Incremental Context Loading

- Load skills only when triggered
- Keep agent context focused
- Use lazy loading for large knowledge bases

### 2. Tool-Specific Adaptation

```typescript
// Adapt procedures for different AI tools
function adaptProcedure(tool: string, procedure: Procedure[]): Procedure[] {
  switch (tool) {
    case 'claude-code':
      return procedure.map((p) => adaptForClaude(p));
    case 'cursor':
      return procedure.map((p) => adaptForCursor(p));
    default:
      return procedure;
  }
}
```

### 3. Error Recovery

```yaml
# .mcp/error-handling.yaml
error_recovery:
  failed_commands:
    - retry_with_different_syntax
    - check_dependencies
    - fall_back_to_manual

  permission_denied:
    - request_elevated_permissions
    - suggest_alternative_approach

  build_failures:
    - analyze_error_logs
    - check_affected_packages
    - suggest_fix_strategies
```

## Migration Strategy

### Phase 1: Foundation

- Implement basic MCP server
- Define core skill structure
- Setup workspace discovery

### Phase 2: Skills Development

- Create common operation skills
- Implement build system integration
- Add security controls

### Phase 3: Ecosystem Integration

- Support multiple AI tools
- Community skill sharing
- Advanced coordination patterns

## References

- [Nx AI Agent Skills Documentation](https://nx.dev/blog/nx-ai-agent-skills)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Agent Skills Framework](https://agentskills.io/)
- [Nx MCP Server Documentation](https://nx.dev/docs/reference/nx-mcp)
- [Monorepo Tools AI Integration](https://monorepo.tools/ai)
- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
