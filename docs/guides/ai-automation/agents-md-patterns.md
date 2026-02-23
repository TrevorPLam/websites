# agents-md-patterns.md

# AGENTS.md File Patterns and Best Practices

## Overview

AGENTS.md is a simple, open format for guiding coding agents. Think of it as a README specifically for AI agents: a dedicated, predictable place to provide context and instructions that help AI coding agents work effectively with your project.

## Why AGENTS.md?

### Separation of Concerns

- **README.md**: For humans - quick starts, project descriptions, contribution guidelines
- **AGENTS.md**: For AI agents - build steps, tests, conventions, detailed context that might clutter a README

### Benefits

- Provides a clear, predictable place for agent instructions
- Keeps READMEs concise and focused on human contributors
- Offers precise, agent-focused guidance that complements existing documentation
- Works across multiple AI coding agents and tools

## Supported Agents

AGENTS.md files are compatible with a growing ecosystem of AI coding tools:

- OpenAI Codex
- Google Jules
- Factory
- Aider
- goose
- opencode
- Zed
- Warp
- VS Code
- Cognition Devin
- UiPath Autopilot & Coded Agents
- Amp
- Cursor
- RooCode
- Gemini CLI
- Kilo Code
- Phoenix
- Semgrep
- GitHub Copilot Coding Agent
- Ona
- Cognition Windsurf

## Core Structure

### Essential Sections

#### 1. Project Overview

```markdown
## Project Overview

This is a React + TypeScript monorepo using pnpm workspaces with:

- Next.js apps in clients/
- Shared packages in packages/
- Turbo for build orchestration
```

#### 2. Development Environment Tips

```markdown
## Dev Environment Tips

- Use `pnpm dlx turbo run where <project_name>` to jump to a package
- Run `pnpm install --filter <project_name>` to add package to workspace
- Use `pnpm create vite@latest <project_name> -- --template react-ts` for new packages
- Check package.json name field to confirm right package name
```

#### 3. Build and Test Commands

```markdown
## Commands

# Type check a single file

npm run tsc --noEmit path/to/file.tsx

# Format a single file

npm run prettier --write path/to/file.tsx

# Lint a single file

npm run eslint --fix path/to/file.tsx

# Unit tests - single file

npm run vitest run path/to/file.test.tsx

# Full build when explicitly requested

yarn build:app

Note: Always lint, test, and typecheck updated files. Use project-wide build sparingly.
```

#### 4. Testing Instructions

```markdown
## Testing Instructions

- Find CI plan in .github/workflows folder
- Run `pnpm turbo run test --filter <project_name>` for package-specific tests
- From package root: `pnpm test`
- Focus on one test: `pnpm vitest run -t "<test name>"`
- Fix all test and type errors until suite is green
- After file changes: `pnpm lint --filter <project_name>`
- Add/update tests for code you change
```

## Code Examples

### Complete AGENTS.md Template

````markdown
# AGENTS.md

## Project Overview

This is a React + TypeScript monorepo using pnpm workspaces with:

- Next.js apps in clients/
- Shared packages in packages/
- Turbo for build orchestration

## Quick Start

1. Install: `pnpm install`
2. Build: `pnpm turbo run build`
3. Test: `pnpm turbo run test`
4. Dev: `pnpm turbo run dev`

## Development Environment

### Commands

- Build: `pnpm turbo run build`
- Test: `pnpm turbo run test --filter <package>`
- Dev: `pnpm turbo run dev --filter <package>`
- Lint: `pnpm turbo run lint`
- Type check: `pnpm turbo run type-check`

### Key Files

- `turbo.json` - Build configuration
- `pnpm-workspace.yaml` - Workspace setup
- `package.json` - Root dependencies

## Architecture Patterns

### Component Structure

```typescript
// Good - Functional component with hooks
export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  // Component logic
}

// Bad - Class-based component
export default class UserProfile extends Component {
  // Legacy pattern
}
```
````

### State Management

```typescript
// Use local store for component state
import { useLocalStore } from 'mobx-react-lite';

const store = useLocalStore(() => ({
  user: null as User | null,
  setUser: (user: User) => {
    this.user = user;
  },
}));
```

## Security Guidelines

### Authentication

```typescript
// Use environment variables for API keys
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error('API_KEY required');

// Secure API calls
const response = await fetch('/api/data', {
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});
```

### Input Validation

```typescript
// Validate all inputs
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const validatedUser = UserSchema.parse(userData);
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Dynamic imports
const loadModule = async () => {
  const module = await import('./heavy-module');
  return module.default;
};
```

### Bundle Optimization

```typescript
// Tree-shaking friendly imports
import { debounce } from 'lodash-es/debounce';

// Instead of
// import _ from 'lodash';
```

## Best Practices

### Dos and Don'ts

Be specific and nitpicky - AI thrives on clear guidelines.

```markdown
### Do

- Use MUI v3 (ensure v3 compatibility)
- Use emotion `css={{}}` prop format
- Use mobx for state management with `useLocalStore`
- Use design tokens from `DynamicStyles.tsx` for all styling (no hard coding)
- Use apex charts for charts (no custom HTML)
- Default to small components (prefer focused modules over god components)
- Default to small files and diffs (avoid repo-wide rewrites unless asked)

### Don't

- Do not hard code colors
- Do not use `div`s if we have a component already
- Do not add new heavy dependencies without approval
```

### Project Structure Hints

Create a tiny index to speed up agent exploration.

```markdown
### Project Structure

- See `App.tsx` for routes
- See `AppSideBar.tsx` for sidebar
- Components live in `app/components`
- Design tokens live in `app/lib/theme/tokens.ts`
```

### Concrete Examples

Examples beat abstractions. Point to real files showing best patterns.

```markdown
### Good and Bad Examples

- Avoid class-based components like `Admin.tsx`
- Prefer functional components with hooks like `Projects.tsx`
- Forms: copy `app/components/DashForm.tsx`
- Charts: copy `app/components/Charts/Bar.tsx`
- Data grids: copy `app/components/Table.tsx`
- Data layer: use `app/api/client.ts` for HTTP (do not fetch directly in components)
```

### API Documentation References

Guide agents to correct API usage patterns.

```markdown
### API Docs

- Docs live in `./api/docs/*.md`
- List projects: `GET /api/projects` using typed client in `app/api/client.ts`
- Update project name: `PATCH /api/projects/:id` via `client.projects.update`
- Use Builder.io MCP server to look up Builder API docs
```

### Safety and Permissions

Control what agents can do without asking.

```markdown
### Safety and Permissions

#### Allowed without prompt:

- read files, list files
- tsc single file, prettier, eslint
- vitest single test

#### Ask first:

- package installs
- git push
- deleting files, chmod
- running full build or end-to-end suites
```

## Advanced Patterns

### Hierarchical AGENTS.md Files

Large repos benefit from nested AGENTS.md files.

```markdown
# Root AGENTS.md

## Global Rules

- Use TypeScript strict mode
- Follow conventional commits
- All packages must have tests

# packages/ui/AGENTS.md

## UI-Specific Rules

- Use styled-components, not emotion
- Follow atomic design principles
- Storybook stories required for components
```

**Benefits:**

- Packages evolve independently
- Cleaner guidance (fewer conditionals)
- Legacy packages can keep old rules while new ones use modern patterns

### PR Checklist

Define what "ready" means mechanically.

```markdown
### PR Checklist

- Title format: `feat(scope): short description`
- Lint, type check, unit tests all green before commit
- Diff is small and focused - include brief summary of what changed and why
- Remove excessive logs or comments before sending PR
```

### When Stuck, Plan First

Encourage systematic problem-solving.

```markdown
### When Stuck

1. Plan first - break down the problem
2. Identify the specific file(s) to modify
3. Check existing patterns in similar files
4. Implement incrementally with testing
5. Verify all checks pass before considering complete
```

## Integration Patterns

### MCP Server Integration

Guide agents on using Model Context Protocol servers.

```markdown
### MCP Servers

- Use @modelcontextprotocol/server-postgres for database queries
- Use @modelcontextprotocol/server-filesystem for file operations
- Use @modelcontextprotocol/server-brave-search for web research
- Always check MCP server availability before use
```

### Design System Integration

Connect agents to design system resources.

```markdown
### Design System

- Design tokens: `packages/tokens/src/index.ts`
- Component library: `packages/ui/`
- Storybook: `http://localhost:6006`
- Figma designs: [link to design system]
- Use tokens from design system, never hard-code values
```

## Template Examples

### Minimal Template

```markdown
# AGENTS.md

## Project Overview

[brief description]

## Commands

- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`

## Do/Don't

### Do

- [specific practices]

### Don't

- [avoidance patterns]
```

### Comprehensive Template

```markdown
# AGENTS.md

## Project Overview

[description with tech stack]

## Dev Environment

[setup instructions]

## Commands

[build, test, lint commands]

## Project Structure

[key file locations]

## Do/Don't

[specific practices]

## Examples

[good/bad patterns]

## API Docs

[API guidance]

## Safety

[permissions]

## PR Checklist

[ready criteria]
```

## Implementation Tips

### Start Small

- Begin with basic structure
- Add sections incrementally based on agent interactions
- Refine based on what agents get wrong

### Be Specific

- Version specificity matters (e.g., "MUI v3" not just "MUI")
- File paths should be exact
- Commands should be copy-pasteable

### Update Regularly

- Remove outdated information
- Add new patterns as they emerge
- Keep examples current with codebase

### Test with Agents

- Try different agents with your AGENTS.md
- Note where they struggle
- Add clarification for common issues

## Common Anti-Patterns

### Too Generic

```markdown
# Bad

## Commands

- Build the project
- Run tests

# Good

## Commands

- Build: `pnpm turbo run build`
- Test: `pnpm turbo run test --filter <package>`
```

### Outdated Information

- Regular review and update required
- Remove references to deleted files
- Update commands that have changed

### Too Long

- Keep it focused on agent needs
- Split into nested files if needed
- Use concise, scannable format

## Testing

### Testing AGENTS.md Effectiveness

Validate that your AGENTS.md file works with different AI agents:

```bash
# Test with multiple agents
echo "Testing AGENTS.md with Claude..." | claude
echo "Testing AGENTS.md with Cursor..." | cursor
echo "Testing AGENTS.md with GitHub Copilot..." | copilot
```

### Agent Compatibility Testing

```markdown
## Testing Checklist

- [ ] Claude can parse and follow instructions
- [ ] Cursor understands project structure
- [ ] GitHub Copilot respects coding patterns
- [ ] All agents can locate key files
- [ ] Commands work as expected
- [ ] Security guidelines are followed
```

### Validation Scripts

Create automated tests to validate AGENTS.md quality:

```typescript
// test-agents-md.ts
import { readFileSync } from 'fs';
import { validateAgentsMd } from './agents-validator';

const agentsMd = readFileSync('AGENTS.md', 'utf8');
const validation = validateAgentsMd(agentsMd);

console.log('Validation Results:', validation);
// Expected: { valid: true, score: 95, issues: [] }
```

### Performance Testing

Test agent performance with your AGENTS.md:

```markdown
## Performance Metrics

- Context loading time: <2 seconds
- First response time: <5 seconds
- Command accuracy: >90%
- File location accuracy: >95%
```

## Security Considerations

When creating AGENTS.md files, follow security best practices:

### Information Disclosure

- **Avoid Sensitive Data**: Never include API keys, passwords, or secrets in AGENTS.md
- **Generic Examples**: Use placeholder values for sensitive configurations
- **Environment Variables**: Reference environment variables without exposing values

```markdown
# Good - Generic approach

## Authentication

- Use environment variables for API keys: `process.env.API_KEY`
- Configure OAuth via: `pnpm run setup:auth`

# Bad - Exposing sensitive data

## Authentication

- API Key: sk-1234567890abcdef
- Password: secret123
```

### Access Control

- **Role-Based Access**: Document required permissions without exposing credentials
- **Principle of Least Privilege**: Specify minimal necessary permissions
- **Audit Trail**: Include logging requirements for security events

### Code Security

- **Secure Patterns**: Document secure coding practices
- **Input Validation**: Include validation requirements
- **Dependency Security**: Reference security scanning tools

## Performance Optimization

Optimize AGENTS.md files for efficient agent processing:

### File Size Limits

- **60-Line Limit**: Keep AGENTS.md under 60 lines for optimal AI context
- **Concise Content**: Use bullet points and short descriptions
- **Nested Files**: Reference detailed docs instead of including them

### Content Structure

- **Prioritize Information**: Most important content first
- **Scannable Format**: Use consistent formatting for quick parsing
- **Avoid Redundancy**: Don't repeat information available elsewhere

```markdown
# Good - Concise and scannable

## Quick Start

1. Install: `pnpm install`
2. Build: `pnpm turbo run build`
3. Test: `pnpm turbo run test`
4. Dev: `pnpm turbo run dev`

# Bad - Verbose and redundant

## Quick Start

To get started with this project, you'll need to first install all the dependencies...
```

### Agent Performance

- **Context Efficiency**: Structure for minimal token usage
- **Clear Instructions**: Reduce ambiguity and back-and-forth
- **Actionable Content**: Focus on commands and patterns agents can use

## 2026 Standards Compliance

Modern AGENTS.md files should address current standards:

### AI Integration Patterns

- **Multi-Agent Support**: Compatible with Claude, GPT, Gemini, and other agents
- **Context Management**: Structured for efficient AI context loading
- **Tool Integration**: Document AI tool integrations and patterns

### Multi-tenant Architecture

- **Tenant Context**: Include tenant-specific guidance when applicable
- **Scalability Patterns**: Document patterns for multi-tenant environments
- **Isolation Guidelines**: Specify data and resource separation requirements

## References

- [AGENTS.md Specification](https://github.com/features-copilot/agents-md) - Official specification
- [AI Context Management](https://docs.anthropic.com/claude/docs/context) - Claude context optimization
- [Security Best Practices](https://owasp.org/www-project-top-ten/) - OWASP security guidelines
- [Performance Optimization](https://web.dev/performance/) - Web performance best practices
- [Multi-tenant Architecture](https://docs.microsoft.com/en-us/azure/architecture/patterns/) - Microsoft architecture patterns

- [AGENTS.md Official Specification](https://agents.md/)
- [AGENTS.md GitHub Repository](https://github.com/agentsmd/agents.md)
- [Builder.io AGENTS.md Guide](https://www.builder.io/blog/agents-md)
- [Aider Documentation](https://aider.chat/docs/usage/conventions.html)
- [OpenAI Codex](https://openai.com/codex/)
- [Google Jules](https://jules.google)
- [Cognition Devin](https://devin.ai)
- [Cognition Windsurf](https://windsurf.com)
