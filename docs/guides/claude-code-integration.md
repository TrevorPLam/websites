# claude-code-integration.md

# Claude Code Integration Patterns and Workflows

## Overview

Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. It's available across multiple environments including terminal, IDE, desktop app, and web, all connecting to the same underlying engine for consistent experience.

## Core Capabilities

### Primary Features

- **Code Analysis**: Read and understand complex codebases
- **File Editing**: Make precise code changes with context awareness
- **Command Execution**: Run build, test, and deployment commands
- **Multi-Environment**: Work from terminal, VS Code, JetBrains, Desktop, Web, and iOS
- **Integration Hub**: Connect with external tools via MCP (Model Context Protocol)

### Common Use Cases

```bash
# Automate repetitive work
claude "write tests for the auth module, run them, and fix any failures"

# Build features and fix bugs
claude "implement the user authentication flow with JWT tokens"

# Create commits and pull requests
claude "commit my changes with a descriptive message"

# CI/CD integration
claude "update the GitHub Actions workflow to include security scanning"
```

## Environment Setup

### Installation and Quick Start

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Initialize in project directory
cd /path/to/project
claude
```

### Configuration Files

#### CLAUDE.md Files

CLAUDE.md files provide persistent context and instructions for Claude.

**File Locations and Priority:**

1. **Home folder** (`~/.claude/CLAUDE.md`): Applies to all sessions
2. **Project root** (`./CLAUDE.md`): Team-shared or local (`CLAUDE.local.md`)
3. **Parent directories**: Monorepo hierarchical context
4. **Child directories**: On-demand loading for specific modules

**Example CLAUDE.md:**

```markdown
# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow

- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, not the whole test suite, for performance

# References

See @README.md for project overview and @package.json for available npm commands.

# Additional Instructions

- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

#### Settings Configuration

```json
// .claude/settings.json
{
  "allowedTools": ["bash", "edit", "read_file"],
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["path/to/postgres-server.js"]
    }
  },
  "permissions": {
    "allowedCommands": ["npm run lint", "git commit"],
    "sandboxEnabled": true
  }
}
```

### Permission Management

#### Allowlist Approach

```bash
# Configure specific allowed commands
/permissions

# Enable sandboxing for additional safety
/sandbox

# Skip permissions (use with caution)
claude --dangerously-skip-permissions
```

#### Safe Commands

- `npm run lint`
- `git commit`
- `npm test`
- `npm run build`

#### Dangerous Commands (require approval)

- `npm install`
- `git push`
- `rm -rf`
- System-level changes

## Integration Patterns

### MCP (Model Context Protocol) Integration

#### Popular MCP Servers

- **Database**: `@modelcontextprotocol/server-postgres`
- **Filesystem**: `@modelcontextprotocol/server-filesystem`
- **Web Search**: `@modelcontextprotocol/server-brave-search`
- **GitHub**: `@modelcontextprotocol/server-github`
- **Slack**: `@modelcontextprotocol/server-slack`

#### Installation Methods

**Option 1: Remote HTTP Server**

```bash
claude mcp add my-server --http https://api.example.com/mcp
```

**Option 2: Local stdio Server**

```bash
claude mcp add postgres --local npx @modelcontextprotocol/server-postgres
```

**Option 3: Project Configuration**

```json
// .mcp.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    }
  }
}
```

#### MCP Usage Examples

```bash
# Database queries
claude "Find users who signed up last week from our PostgreSQL database"

# GitHub integration
claude "Create a pull request for the feature branch and request review from @team"

# Slack notifications
claude "Send a Slack message to #dev-team about the deployment status"
```

### IDE Integration

#### VS Code

```bash
# Install VS Code extension
code --install-extension anthropic.claude-code

# Start Claude Code in VS Code
claude --vscode
```

#### JetBrains

```bash
# Install JetBrains plugin
# Available in JetBrains Marketplace

# Start with JetBrains integration
claude --jetbrains
```

### CI/CD Integration

#### GitHub Actions

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Claude Code
        run: |
          npm install -g @anthropic-ai/claude-code
          claude mcp add github --local npx @modelcontextprotocol/server-github
      - name: Review PR
        run: |
          claude "review this PR for security issues and suggest improvements"
```

#### GitLab CI/CD

```yaml
# .gitlab-ci.yml
claude-review:
  stage: test
  script:
    - npm install -g @anthropic-ai/claude-code
    - claude "review merge request for code quality and accessibility"
  only:
    - merge_requests
```

## Common Workflows

### Codebase Exploration

#### Getting Started

```bash
cd /path/to/project
claude
```

#### High-Level Overview

```bash
> give me an overview of this codebase
> explain the main architecture patterns used here
> what are the key data models?
> how is authentication handled?
```

#### Finding Relevant Code

```bash
> find the files that handle user authentication
> how do these authentication files work together?
> trace the login process from front-end to database
```

### Bug Fixing Workflow

#### Systematic Approach

```bash
# 1. Report the error
> I'm seeing an error when I run npm test

# 2. Get specific recommendations
> suggest a few ways to fix the @ts-ignore in user.ts

# 3. Apply the fix
> update user.ts to add the null check you suggested

# 4. Verify the fix
> run tests to confirm the issue is resolved
```

#### Best Practices

- Share the exact error message and stack trace
- Mention reproduction steps
- Specify if the error is intermittent or consistent
- Let Claude run the failing command to see live output

### Refactoring Workflow

#### Legacy Code Modernization

```bash
# 1. Identify outdated patterns
> find deprecated API usage in our codebase

# 2. Get recommendations
> suggest how to refactor utils.js to use modern JavaScript features

# 3. Apply changes safely
> refactor utils.js to use ES2024 features while maintaining the same behavior

# 4. Verify functionality
> run tests for the refactored code
```

#### Incremental Refactoring

- Make small, testable changes
- Maintain backward compatibility when needed
- Run tests after each significant change
- Document the benefits of modern approaches

### Testing Workflow

#### Test Generation

```bash
# Generate unit tests
> write comprehensive unit tests for the authentication service

# Generate integration tests
> create integration tests for the user registration flow

# Fix failing tests
> run all tests and fix any failures
```

#### Test Optimization

```bash
# Run specific tests
> run only the authentication tests for performance

# Debug test failures
> investigate why the user login test is failing
```

## Advanced Features

### Subagents

#### Creating Custom Subagents

```json
// .claude/agents/code-reviewer.json
{
  "id": "code-reviewer",
  "description": "Reviews code for security issues and best practices",
  "trigger": "when code review is mentioned",
  "tools": ["read_file", "bash", "edit"],
  "systemPrompt": "You are a senior security engineer. Review code for vulnerabilities, suggest improvements, and ensure adherence to security best practices."
}
```

#### Using Subagents

```bash
# View available subagents
> /agents

# Automatic delegation
> review my recent code changes for security issues

# Explicit subagent selection
> use the code-reviewer subagent to check the auth module
```

### Plan Mode

#### Safe Code Analysis

```bash
# Enable Plan Mode for complex changes
> /plan

# Example: Planning a refactor
> I want to refactor the authentication system to use OAuth 2.1. Plan this change and identify potential risks.
```

#### Plan Mode Benefits

- Analyzes code without making changes
- Identifies potential issues and dependencies
- Provides step-by-step implementation plan
- Estimates complexity and risk

### Custom Skills and Commands

#### Creating Custom Commands

```markdown
<!-- .claude/commands/review-pr.md -->

# Review Pull Request

Review the current pull request for:

- Code quality and style
- Security vulnerabilities
- Performance implications
- Test coverage
- Documentation completeness

Focus on $ARGUMENTS if specified.
```

#### Using Custom Commands

```bash
# Use custom command
> /review-pr

# Pass arguments
> /review-pr --focus=security
```

## Performance Optimization

### Context Management

#### Aggressive Context Control

```bash
# Clear unnecessary context
> /clear

# Focus on specific files
> focus only on the authentication module

# Use checkpoints for long sessions
> /checkpoint save-auth-work
```

#### Memory-Efficient Workflows

- Work with specific file scopes rather than entire codebase
- Use Plan Mode for analysis without loading full context
- Clear context between unrelated tasks
- Use checkpoints to save and restore session state

### Parallel Processing

#### Multiple Sessions

```bash
# Run parallel sessions with Git worktrees
git worktree add ../feature-branch feature-branch
cd ../feature-branch
claude
```

#### Subagent Delegation

```bash
# Parallel task execution
> have the security-reviewer subagent check the auth module while the performance-reviewer analyzes the database queries
```

## Team Collaboration

### Sharing Configurations

#### Team CLAUDE.md

```markdown
# Team Coding Standards

- Follow our ESLint configuration strictly
- Use TypeScript strict mode
- Write tests for all new features
- Document public APIs with JSDoc

# Project Structure

- src/components/ - React components
- src/services/ - API services
- src/utils/ - Utility functions
- tests/ - Test files

# Workflow

- Create feature branches from main
- Run tests before committing
- Request code review for all PRs
```

#### Managed MCP Configuration

```json
// .mcp.json (team-shared)
{
  "mcpServers": {
    "team-postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres", "--connection-string", "${DATABASE_URL}"]
    },
    "team-github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github", "--token", "${GITHUB_TOKEN}"]
    }
  }
}
```

### Slack Integration

#### Setting Up Slack Bot

```bash
# Add Claude to Slack
claude slack connect --team "your-workspace"

# Use in channels
@Claude review the latest PR for security issues
@Claude deploy the staging environment
```

## Automation and Scripting

### CLI Pipeline Integration

#### Unix-Style Usage

```bash
# Pipe operations
git diff main --name-only | claude -p "review these changed files for security issues"

# Log monitoring
tail -f app.log | claude -p "Slack me if you see any anomalies"

# Bulk operations
find src -name "*.ts" | claude -p "update these files to use ES2024 features"
```

#### Script Integration

```bash
#!/bin/bash
# deploy.sh

echo "Running pre-deployment checks..."
claude "run all tests and fix any failures" || exit 1

echo "Building application..."
claude "build the application for production" || exit 1

echo "Deploying to staging..."
claude "deploy to staging environment and run smoke tests" || exit 1

echo "Deployment successful!"
```

### Headless Mode

#### Automated Workflows

```bash
# Run without interactive mode
claude --headless "run tests and fix failures" --output results.json

# Batch processing
claude --headless --batch-file tasks.txt
```

## Security Considerations

### Sandbox Configuration

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowedPaths": ["/path/to/project", "/tmp"],
      "deniedPaths": ["/etc", "/usr/bin"]
    },
    "network": {
      "allowedDomains": ["api.github.com", "npm registry"],
      "deniedDomains": ["malicious-site.com"]
    }
  }
}
```

### Permission Management

- Use allowlists for known safe commands
- Enable sandboxing for additional isolation
- Review and audit Claude's actions regularly
- Never share sensitive credentials in CLAUDE.md files

## Troubleshooting

### Common Issues

#### Context Overload

```bash
# Clear context and restart
> /clear
> /reset

# Use focused mode
> focus only on the specific problem area
```

#### Permission Errors

```bash
# Check current permissions
> /permissions

# Add missing permissions
> allow npm run build

# Use sandbox mode
> /sandbox
```

#### MCP Connection Issues

```bash
# Check MCP server status
> /mcp status

# Restart MCP servers
> /mcp restart

# Check configuration
> /mcp config
```

### Performance Optimization

#### Large Codebases

- Use Plan Mode for initial analysis
- Work with specific directories rather than entire codebase
- Clear context frequently
- Use subagents for specialized tasks

#### Memory Management

- Monitor session memory usage
- Use checkpoints for long-running sessions
- Restart sessions periodically
- Limit concurrent operations

## Best Practices Summary

### Development Workflow

1. **Start with /init** to analyze codebase
2. **Use specific, domain-relevant language** in prompts
3. **Provide context about errors** with reproduction steps
4. **Verify changes incrementally** with tests
5. **Document decisions** in commit messages

### Team Configuration

1. **Share CLAUDE.md files** for consistent standards
2. **Use managed MCP configuration** for team tools
3. **Set up appropriate permissions** and sandboxing
4. **Create custom subagents** for specialized tasks
5. **Integrate with CI/CD** for automated workflows

### Performance Optimization

1. **Manage context aggressively** to avoid memory issues
2. **Use Plan Mode** for complex analysis
3. **Leverage subagents** for parallel processing
4. **Configure appropriate permissions** for safety
5. **Monitor and tune** regularly for optimal performance

## References

### Official Documentation

- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [Best Practices Guide](https://code.claude.com/docs/en/best-practices)
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [MCP Integration](https://code.claude.com/docs/en/mcp)
- [CLI Reference](https://code.claude.com/docs/en/cli-reference)

### Integration Guides

- [VS Code Extension](https://code.claude.com/docs/en/vs-code)
- [JetBrains Plugin](https://code.claude.com/docs/en/jetbrains)
- [GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd)
- [Slack Integration](https://code.claude.com/docs/en/slack)

### Advanced Features

- [Subagents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Custom Skills](https://code.claude.com/docs/en/skills)
- [Plan Mode](https://code.claude.com/docs/en/plan-mode)
- [Hooks System](https://code.claude.com/docs/en/hooks-guide)

### Community Resources

- [MCP Server Repository](https://github.com/modelcontextprotocol/servers)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Community Examples](https://github.com/anthropics/claude-code-examples)
