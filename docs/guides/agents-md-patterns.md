<!--
/**
 * @file agents-md-patterns.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for agents md patterns.
 * @entrypoints docs/guides/agents-md-patterns.md
 * @exports agents md patterns
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# agents-md-patterns.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


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

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [AGENTS.md Official Specification](https://agents.md/)
- [AGENTS.md GitHub Repository](https://github.com/agentsmd/agents.md)
- [Builder.io AGENTS.md Guide](https://www.builder.io/blog/agents-md)
- [Aider Documentation](https://aider.chat/docs/usage/conventions.html)
- [OpenAI Codex](https://openai.com/codex/)
- [Google Jules](https://jules.google)
- [Cognition Devin](https://devin.ai)
- [Cognition Windsurf](https://windsurf.com)
