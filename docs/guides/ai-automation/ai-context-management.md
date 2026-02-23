# ai-context-management.md

# AI Context Management and Hierarchy Strategies

## Overview

AI context management is the practice of organizing and structuring information that AI agents need to work effectively with codebases. As monorepos and complex projects grow, managing context becomes critical for maintaining agent performance and reducing token waste.

## Context Hierarchy Principles

### 1. Hierarchical Context Loading

Context files should be organized hierarchically, with agents loading the most relevant context first:

```mermaid
graph TD
    A[Root Context] --> B[Package Context]
    B --> C[Module Context]
    C --> D[File Context]

    A --> E[Global Rules]
    B --> F[Package Rules]
    C --> G[Module Rules]
```

### 2. Context Scoping

- **Root level**: Repository-wide rules, global patterns, shared configurations
- **Package level**: Package-specific conventions, dependencies, build rules
- **Module level**: Module-specific patterns, local conventions
- **File level**: File-specific instructions, temporary context

### 3. Context Priority

1. **Immediate context** (current directory/file)
2. **Parent contexts** (moving up the directory tree)
3. **Global contexts** (root level, user home)
4. **External contexts** (MCP servers, documentation)

## Context File Types

### AGENTS.md

The standard format for AI agent instructions across multiple tools.

**Purpose**: Cross-agent compatibility, structured guidance
**Location**: Repository root, package roots
**Format**: Markdown with structured sections

```markdown
# AGENTS.md

## Project Overview

[Brief description and tech stack]

## Commands

[Build, test, lint commands]

## Do/Don't

[Specific practices and avoidances]

## Project Structure

[Key file locations]

## Examples

[Good/bad patterns]
```

### CLAUDE.md

Claude-specific context file with hierarchical loading.

**Purpose**: Claude Code optimization, custom workflows
**Location**: Any directory level, automatically discovered
**Format**: Free-form Markdown

**Loading Order**:

1. Current directory
2. Parent directories (up to root)
3. Child directories (on-demand)
4. User home directory (`~/.claude/CLAUDE.md`)

### .claude/settings.json

Claude tool configuration and permissions.

**Purpose**: Tool access control, MCP server configuration
**Location**: Project root or user home
**Format**: JSON

```json
{
  "allowedTools": ["bash", "edit", "read_file"],
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["path/to/postgres-server.js"]
    }
  }
}
```

### .mcp.json

MCP server configuration for team sharing.

**Purpose**: Shared MCP server setup
**Location**: Repository root
**Format**: JSON

```json
{
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["path/to/postgres-server.js"]
    },
    "filesystem": {
      "command": "node",
      "args": ["path/to/filesystem-server.js"]
    }
  }
}
```

## Monorepo Context Strategies

### Nx Workspace Integration

Nx provides specialized AI agent skills for monorepo management.

**Setup**:

```bash
npx nx configure-ai-agents
```

**Skills Included**:

- `nx-workspace`: Project graph exploration and understanding
- `monitor-ci`: CI/CD integration with Nx Cloud
- `nx-generate`: Predictable code generation
- `nx-run-tasks`: Efficient task execution
- `nx-plugins`: Plugin discovery and management

### Package-Level Context

Each package should have its own context file for package-specific rules.

**Example Structure**:

```
packages/
  ui/
    AGENTS.md          # UI-specific rules
    package.json
  auth/
    AGENTS.md          # Auth-specific rules
    package.json
  api/
    AGENTS.md          # API-specific rules
    package.json
```

### Cross-Package Context

Global rules that apply across all packages.

**Root AGENTS.md**:

```markdown
## Global Rules

- Use TypeScript strict mode
- Follow conventional commits
- All packages must have tests

## Package-Specific Rules

See individual package AGENTS.md files for specific conventions
```

## Context Management Best Practices

### 1. Keep Context Focused

- Avoid information overload
- Use progressive disclosure
- Reference external documentation instead of duplicating

### 2. Use Examples Over Abstractions

```markdown
# Bad

Use proper TypeScript patterns

# Good

# Copy patterns from packages/ui/src/components/Button.tsx

# Use interface Props = { children: React.ReactNode }

# Always export with export default Button
```

### 3. Version-Specific Instructions

```markdown
# Use React 18 patterns (not React 17)

# Use Next.js 14 App Router (not Pages Router)

# Use Tailwind CSS v4 @theme directive
```

### 4. Command Templates

Provide exact commands for common operations:

```markdown
## Commands

# Type check single file

npm run tsc --noEmit path/to/file.ts

# Test single package

pnpm turbo run test --filter @repo/ui

# Build affected packages

pnpm turbo run build --affected
```

### 5. Safety Boundaries

Clearly define what agents can do without permission:

```markdown
## Allowed Without Permission

- Read files
- Run TypeScript compiler
- Run tests
- Format code

## Requires Permission

- Install packages
- Push to git
- Delete files
- Run full builds
```

## MCP Integration Patterns

### MCP Server Selection

Choose MCP servers based on project needs:

```markdown
### MCP Servers

- @modelcontextprotocol/server-postgres: Database queries
- @modelcontextprotocol/server-filesystem: File operations
- @modelcontextprotocol/server-brave-search: Web research
- @modelcontextprotocol/server-github: GitHub integration
```

### MCP Usage Guidelines

```markdown
### MCP Usage

- Use postgres MCP for schema queries
- Use filesystem MCP for cross-repo file operations
- Use brave-search MCP for documentation research
- Always check MCP availability before use
```

## Context Optimization Techniques

### 1. Lazy Loading

Load context only when needed:

- Package-specific context when working in that package
- Tool-specific context when using specific tools
- Documentation context when referencing docs

### 2. Context Caching

Cache frequently accessed context:

- Project structure information
- Common command patterns
- Build configurations

### 3. Context Deduplication

Avoid repeating information across context files:

- Reference global rules instead of duplicating
- Use links to external documentation
- Share common patterns across packages

### 4. Context Validation

Regularly validate context effectiveness:

- Monitor agent performance
- Check for outdated information
- Remove unused context sections

## Advanced Patterns

### 1. Context Templates

Create reusable context templates:

```markdown
### Template: React Component

# Copy patterns from: packages/ui/src/components/Button.tsx

# Use React.forwardRef for ref forwarding

# Include displayName for debugging

# Export type Props alongside component
```

### 2. Context Composition

Combine multiple context sources:

```markdown
### Context Sources

1. Global rules from root AGENTS.md
2. Package rules from package AGENTS.md
3. Tool-specific rules from CLAUDE.md
4. MCP server capabilities from .mcp.json
```

### 3. Context Versioning

Track context changes over time:

```markdown
### Context Version

- v2.1: Added React 19 patterns
- v2.0: Migrated to Tailwind CSS v4
- v1.5: Added Nx integration rules
```

### 4. Context Testing

Test context effectiveness:

```markdown
### Context Validation

- Test agent can create new component following patterns
- Test agent can run tests correctly
- Test agent respects safety boundaries
- Test agent uses appropriate commands
```

## Implementation Checklist

### Setup Phase

- [ ] Create root AGENTS.md with global rules
- [ ] Set up package-specific AGENTS.md files
- [ ] Configure CLAUDE.md for Claude-specific optimization
- [ ] Set up .mcp.json for shared MCP servers
- [ ] Configure tool permissions in settings.json

### Validation Phase

- [ ] Test agent can navigate project structure
- [ ] Test agent can run common commands
- [ ] Test agent respects package boundaries
- [ ] Test agent uses appropriate patterns
- [ ] Test safety permissions work correctly

### Maintenance Phase

- [ ] Regularly review context for outdated information
- [ ] Update commands when build system changes
- [ ] Add new patterns as they emerge
- [ ] Remove unused context sections
- [ ] Monitor agent performance metrics

## Code Examples

### Complete Context Management System

```typescript
// context-manager.ts
interface ContextFile {
  path: string;
  content: string;
  priority: number;
  type: 'root' | 'package' | 'module' | 'file';
}

class AIContextManager {
  private contexts: Map<string, ContextFile> = new Map();
  private hierarchy: string[] = [];

  constructor(private rootPath: string) {
    this.loadContextHierarchy();
  }

  private async loadContextHierarchy(): Promise<void> {
    // Load root context first
    await this.loadContext('AGENTS.md', 'root', 1);

    // Load package contexts
    const packages = await this.findPackages();
    for (const pkg of packages) {
      await this.loadContext(`${pkg}/AGENTS.md`, 'package', 2);
    }

    // Load module contexts
    const modules = await this.findModules();
    for (const module of modules) {
      await this.loadContext(`${module}/AGENTS.md`, 'module', 3);
    }
  }

  private async loadContext(path: string, type: string, priority: number): Promise<void> {
    try {
      const fullPath = `${this.rootPath}/${path}`;
      const content = await fs.readFile(fullPath, 'utf-8');
      this.contexts.set(path, {
        path,
        content,
        priority,
        type: type as any,
      });
    } catch (error) {
      // Context file doesn't exist, skip
    }
  }

  getContextForAgent(agentType: string): string[] {
    return this.hierarchy
      .map((path) => this.contexts.get(path))
      .filter((ctx) => ctx !== undefined)
      .map((ctx) => ctx!.content);
  }

  private async findPackages(): Promise<string[]> {
    // Find all packages in monorepo
    return ['packages/ui', 'packages/auth', 'packages/api'];
  }

  private async findModules(): Promise<string[]> {
    // Find all modules with context files
    return ['clients/web', 'clients/mobile'];
  }
}
```

### Multi-Agent Context Loader

```typescript
// multi-agent-loader.ts
interface AgentConfig {
  name: string;
  capabilities: string[];
  contextRequirements: string[];
  prioritySections: string[];
}

class MultiAgentContextLoader {
  private agentConfigs: Map<string, AgentConfig> = new Map();

  constructor() {
    this.initializeAgentConfigs();
  }

  private initializeAgentConfigs(): void {
    this.agentConfigs.set('claude', {
      name: 'Claude',
      capabilities: ['code_generation', 'analysis', 'refactoring'],
      contextRequirements: ['architecture', 'patterns', 'commands'],
      prioritySections: ['quick_start', 'commands', 'patterns'],
    });

    this.agentConfigs.set('cursor', {
      name: 'Cursor',
      capabilities: ['code_completion', 'navigation', 'debugging'],
      contextRequirements: ['file_structure', 'commands', 'debug_patterns'],
      prioritySections: ['file_structure', 'commands', 'debugging'],
    });

    this.agentConfigs.set('github-copilot', {
      name: 'GitHub Copilot',
      capabilities: ['code_suggestions', 'documentation', 'testing'],
      contextRequirements: ['patterns', 'testing', 'documentation'],
      prioritySections: ['patterns', 'testing', 'docs'],
    });
  }

  async loadContextForAgent(agentName: string): Promise<string> {
    const config = this.agentConfigs.get(agentName);
    if (!config) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const contextManager = new AIContextManager(process.cwd());
    const allContext = contextManager.getContextForAgent(agentName);

    // Filter and prioritize based on agent requirements
    return this.prioritizeContext(allContext, config.prioritySections);
  }

  private prioritizeContext(context: string[], prioritySections: string[]): string {
    // Implement context prioritization logic
    return context.join('\n\n');
  }
}
```

### Context Validation System

```typescript
// context-validator.ts
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

class ContextValidator {
  validateContext(content: string, contextType: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check for required sections
    const requiredSections = this.getRequiredSections(contextType);
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        errors.push(`Missing required section: ${section}`);
        score -= 20;
      }
    }

    // Check for security issues
    if (this.containsSensitiveData(content)) {
      errors.push('Context contains sensitive data');
      score -= 30;
    }

    // Check for performance issues
    if (content.length > 10000) {
      warnings.push('Context is too long, consider splitting');
      score -= 10;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score),
    };
  }

  private getRequiredSections(contextType: string): string[] {
    const sections = {
      root: ['## Project Overview', '## Commands', '## Architecture'],
      package: ['## Package Overview', '## Commands', '## Patterns'],
      module: ['## Module Purpose', '## Usage', '## Dependencies'],
    };
    return sections[contextType] || [];
  }

  private containsSensitiveData(content: string): boolean {
    const sensitivePatterns = [
      /sk-[a-zA-Z0-9]{48}/, // OpenAI API keys
      /password\s*[:=]\s*['"][^'"]+['"]/, // Passwords
      /secret\s*[:=]\s*['"][^'"]+['"]/, // Secrets
    ];

    return sensitivePatterns.some((pattern) => pattern.test(content));
  }
}
```

## Performance Optimization

### Context Caching Strategies

```typescript
// context-cache.ts
class ContextCache {
  private cache = new Map<string, { content: string; timestamp: number; hits: number }>();
  private readonly TTL = 300000; // 5 minutes

  async getContext(path: string, loader: () => Promise<string>): Promise<string> {
    const cached = this.cache.get(path);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.TTL) {
      cached.hits++;
      return cached.content;
    }

    const content = await loader();
    this.cache.set(path, { content, timestamp: now, hits: 0 });
    return content;
  }

  getCacheStats(): { size: number; hits: number; avgHits: number } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const avgHits = entries.length > 0 ? totalHits / entries.length : 0;

    return {
      size: this.cache.size,
      hits: totalHits,
      avgHits,
    };
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Hierarchical Loading Optimization

```typescript
// hierarchical-loader.ts
interface ContextNode {
  path: string;
  priority: number;
  dependencies: string[];
  loaded: boolean;
  content?: string;
}

class HierarchicalContextLoader {
  private nodes = new Map<string, ContextNode>();
  private loadingPromises = new Map<string, Promise<string>>();

  constructor(private contextGraph: ContextNode[]) {
    this.buildDependencyGraph();
  }

  private buildDependencyGraph(): void {
    for (const node of this.contextGraph) {
      this.nodes.set(node.path, node);
    }
  }

  async loadContext(path: string): Promise<string> {
    const node = this.nodes.get(path);
    if (!node) {
      throw new Error(`Context not found: ${path}`);
    }

    if (node.loaded && node.content) {
      return node.content;
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Load dependencies first
    const loadingPromise = this.loadDependencies(node)
      .then(() => this.loadNodeContent(node))
      .then((content) => {
        node.loaded = true;
        node.content = content;
        this.loadingPromises.delete(path);
        return content;
      });

    this.loadingPromises.set(path, loadingPromise);
    return loadingPromise;
  }

  private async loadDependencies(node: ContextNode): Promise<void> {
    for (const depPath of node.dependencies) {
      await this.loadContext(depPath);
    }
  }

  private async loadNodeContent(node: ContextNode): Promise<string> {
    // Implement actual file loading
    return fs.readFile(node.path, 'utf-8');
  }

  async loadAllContexts(): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // Load in priority order
    const sortedNodes = Array.from(this.nodes.values()).sort((a, b) => a.priority - b.priority);

    for (const node of sortedNodes) {
      const content = await this.loadContext(node.path);
      results.set(node.path, content);
    }

    return results;
  }
}
```

### Memory-Efficient Context Management

````typescript
// memory-efficient-manager.ts
class MemoryEfficientContextManager {
  private maxContextSize = 50000; // 50KB per context
  private maxTotalSize = 500000; // 500KB total
  private currentSize = 0;

  async optimizeContext(content: string): Promise<string> {
    // Remove excessive whitespace
    let optimized = content.replace(/\s+/g, ' ').trim();

    // Remove comments
    optimized = optimized.replace(/<!--.*?-->/gs, '');

    // Compress long sections
    if (optimized.length > this.maxContextSize) {
      optimized = this.compressLongSections(optimized);
    }

    return optimized;
  }

  private compressLongSections(content: string): string {
    const sections = content.split('\n## ');
    const compressed: string[] = [];

    for (const section of sections) {
      if (section.length > 10000) {
        // Compress long sections by keeping only headers and key points
        const lines = section.split('\n');
        const compressedLines = lines.filter(
          (line, index) =>
            index === 0 || // Keep header
            line.startsWith('###') || // Keep sub-headers
            line.startsWith('-') || // Keep bullet points
            line.includes('```') // Keep code blocks
        );
        compressed.push(compressedLines.join('\n'));
      } else {
        compressed.push(section);
      }
    }

    return compressed.join('\n## ');
  }

  canAddContext(content: string): boolean {
    return this.currentSize + content.length <= this.maxTotalSize;
  }

  addContext(content: string): void {
    if (this.canAddContext(content)) {
      this.currentSize += content.length;
    } else {
      throw new Error('Context size limit exceeded');
    }
  }

  clearContext(): void {
    this.currentSize = 0;
  }
}
````

## 2026 Standards Compliance

### AI Integration Patterns

#### Multi-Agent Context Sharing

```typescript
// multi-agent-context-sharing.ts
interface SharedContext {
  globalRules: string[];
  projectStructure: string;
  commonPatterns: string[];
  securityGuidelines: string[];
}

class MultiAgentContextSharing {
  private sharedContext: SharedContext;
  private agentSpecificContext = new Map<string, string>();

  constructor() {
    this.sharedContext = {
      globalRules: this.extractGlobalRules(),
      projectStructure: this.getProjectStructure(),
      commonPatterns: this.getCommonPatterns(),
      securityGuidelines: this.getSecurityGuidelines(),
    };
  }

  getContextForAgent(agentName: string): string {
    const agentContext = this.agentSpecificContext.get(agentName) || '';
    return [
      this.sharedContext.globalRules.join('\n'),
      this.sharedContext.projectStructure,
      this.sharedContext.commonPatterns.join('\n'),
      this.sharedContext.securityGuidelines,
      agentContext,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  updateSharedContext(updates: Partial<SharedContext>): void {
    this.sharedContext = { ...this.sharedContext, ...updates };
  }

  private extractGlobalRules(): string[] {
    return [
      'Always follow TypeScript best practices',
      'Use functional components over class components',
      'Implement proper error handling',
      'Write tests for new features',
    ];
  }

  private getProjectStructure(): string {
    return `
Project Structure:
- packages/: Shared libraries
- clients/: Application code
- tools/: Build and development tools
- docs/: Documentation
`;
  }

  private getCommonPatterns(): string[] {
    return [
      'Use dependency injection for services',
      'Implement proper logging',
      'Follow naming conventions',
      'Use environment variables for configuration',
    ];
  }

  private getSecurityGuidelines(): string {
    return `
Security Guidelines:
- Never commit secrets or API keys
- Use HTTPS for all external requests
- Validate all user inputs
- Implement proper authentication and authorization
`;
  }
}
```

### Multi-tenant Architecture

#### Tenant-Specific Context Management

```typescript
// tenant-context-manager.ts
interface TenantContext {
  tenantId: string;
  context: string;
  restrictions: string[];
  customRules: string[];
}

class TenantContextManager {
  private tenantContexts = new Map<string, TenantContext>();
  private baseContext: string;

  constructor(baseContext: string) {
    this.baseContext = baseContext;
  }

  async loadTenantContext(tenantId: string): Promise<string> {
    let tenantContext = this.tenantContexts.get(tenantId);

    if (!tenantContext) {
      tenantContext = await this.createTenantContext(tenantId);
      this.tenantContexts.set(tenantId, tenantContext);
    }

    return this.combineContexts(this.baseContext, tenantContext);
  }

  private async createTenantContext(tenantId: string): Promise<TenantContext> {
    // Load tenant-specific configuration
    const config = await this.loadTenantConfig(tenantId);

    return {
      tenantId,
      context: config.context || '',
      restrictions: config.restrictions || [],
      customRules: config.customRules || [],
    };
  }

  private combineContexts(base: string, tenant: TenantContext): string {
    return [
      base,
      '',
      `Tenant-Specific Context (${tenant.tenantId}):`,
      tenant.context,
      '',
      'Tenant Restrictions:',
      ...tenant.restrictions,
      '',
      'Tenant Custom Rules:',
      ...tenant.customRules,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private async loadTenantConfig(tenantId: string): Promise<any> {
    // Implement tenant configuration loading
    return {
      context: `Custom rules for ${tenantId}`,
      restrictions: ['No access to billing module'],
      customRules: ['Use tenant-specific database'],
    };
  }

  updateTenantContext(tenantId: string, updates: Partial<TenantContext>): void {
    const existing = this.tenantContexts.get(tenantId);
    if (existing) {
      this.tenantContexts.set(tenantId, { ...existing, ...updates });
    }
  }
}
```

## Security Considerations

### 1. Context Overload

```markdown
# Bad: Too much information

## Complete History of This Project

[pages of project history]

# Good: Focused guidance

## Project Overview

React + TypeScript monorepo with pnpm workspaces
```

### 2. Vague Instructions

```markdown
# Bad: Vague guidance

Write good code

# Good: Specific patterns

Copy patterns from packages/ui/src/components/Button.tsx
Use interface Props = { children: React.ReactNode }
```

### 3. Outdated Information

- Regular review schedule required
- Remove references to deleted files
- Update commands that have changed

### 4. Inconsistent Context

- Ensure consistency across AGENTS.md files
- Align with actual project structure
- Keep commands in sync with package.json

## Tools and Resources

### Official Documentation

- [AGENTS.md Specification](https://agents.md/)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Nx AI Agent Skills](https://nx.dev/blog/nx-ai-agent-skills)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### MCP Servers

- [@modelcontextprotocol/server-postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [@modelcontextprotocol/server-brave-search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)

### Community Resources

- [AI Agent Context Files Collection](https://gist.github.com/0xdevalias/f40bc5a6f84c4c5ad862e314894b2fa6)
- [Agent Skills Registry](https://agentskills.io/)
- [Monorepo Tools AI Integration](https://monorepo.tools/ai)

## References

- [AGENTS.md Specification](https://agents.md/) - Official specification and examples
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Anthropic's AI coding guidelines
- [Nx AI Agent Skills](https://nx.dev/blog/nx-ai-agent-skills) - Nx monorepo AI integration
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI context management standards
- [AI Integration Best Practices](https://github.com/openai/openai-cookbook) - OpenAI integration patterns
- [Multi-tenant Architecture Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) - Microsoft patterns
- [Performance Optimization](https://web.dev/performance/) - Web performance best practices
- [Security Best Practices](https://owasp.org/www-project-top-ten/) - OWASP security guidelines
- [2026 Web Standards](https://www.w3.org/standards/) - W3C current standards
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01) - Authentication framework
- [GDPR Compliance](https://gdpr.eu/) - Data protection regulations
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/) - Web accessibility standards

### MCP Servers

- [@modelcontextprotocol/server-postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) - PostgreSQL integration
- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - File system operations
- [@modelcontextprotocol/server-brave-search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search) - Web search integration

### Community Resources

- [AI Agent Context Files Collection](https://gist.github.com/0xdevalias/f40bc5a6f84c4c5ad862e314894b2fa6) - Community examples
- [Agent Skills Registry](https://agentskills.io/) - Agent skill registry
- [Monorepo Tools AI Integration](https://monorepo.tools/ai) - Monorepo AI tools

## Best Practices

[Add content here]

## Testing

[Add content here]
