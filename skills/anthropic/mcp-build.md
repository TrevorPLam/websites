---
name: mcp-build
description: |
  **MCP BUILDER WORKFLOW** - Build and deploy Model Context Protocol servers.
  USE FOR: MCP server development, deployment automation.
  DO NOT USE FOR: Simple API calls, basic file operations.
  INVOKES: [filesystem, fetch].
meta:
  version: '1.0.0'
  author: 'anthropic-ecosystem'
  category: 'development'
---

# MCP Builder Workflow

## Overview

This Skill orchestrates the complete MCP server development and deployment process, from initial project setup to production deployment with automated testing.

## Prerequisites

- Node.js 18+ environment
- TypeScript development setup
- MCP SDK dependencies installed
- Access to deployment targets
- API keys for target services

## Workflow Steps

### 1. Initialize MCP Server Project

**Action:** Create new MCP server project structure with TypeScript configuration

**Validation:**
- Project directory created with proper structure
- package.json with MCP dependencies
- TypeScript configuration for strict mode
- ESLint and Prettier configuration

**MCP Server:** filesystem (for project template creation)

**Expected Output:** Initialized MCP server project with build tools

### 2. Implement Core MCP Server Logic

**Action:** Implement server class with tool registration and handlers

**Validation:**
- McpServer class properly instantiated
- Tools registered with Zod validation
- Error handling implemented
- Response format follows MCP standard

**MCP Server:** filesystem (for code templates)

**Expected Output:** Functional MCP server with tool handlers

### 3. Add Tool Implementations

**Action:** Implement specific tools with proper validation and error handling

**Validation:**
- All tools use Zod schema validation
- Error handling with proper MCP response format
- Tool descriptions and parameters documented
- Integration points verified

**MCP Server:** filesystem (for tool templates)

**Expected Output:** Complete MCP server with all tools implemented

### 4. Run Automated Tests

**Action:** Execute test suite for MCP server functionality

**Validation:**
- Unit tests pass for all tools
- Integration tests with MCP SDK
- Response format validation
- Error scenario testing

**MCP Server:** filesystem (for test execution)

**Expected Output:** Test results with coverage report

### 5. Build and Package Server

**Action:** Compile TypeScript and package for distribution

**Validation:**
- TypeScript compilation successful
- Bundle size within limits
- Dependencies properly resolved
- Package metadata correct

**MCP Server:** filesystem (for build process)

**Expected Output:** Packaged MCP server ready for deployment

### 6. Deploy to Production

**Action:** Deploy MCP server to production environment

**Validation:**
- Deployment target accessible
- Server responds to health checks
- MCP protocol communication working
- Monitoring and logging configured

**MCP Server:** fetch (for deployment API calls)

**Expected Output:** Production MCP server endpoint

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Project Init | Template missing | Use fallback template | No |
| Implementation | TypeScript errors | Fix compilation issues | Yes |
| Testing | Test failures | Debug and fix issues | Partial |
| Build | Bundle too large | Optimize dependencies | Yes |
| Deploy | Deployment failure | Retry with backoff | No |

## Success Criteria

- MCP server project properly initialized
- All tools implemented with validation
- Test suite passes with adequate coverage
- Build process successful
- Production deployment functional
- MCP protocol communication verified

## Environment Variables

```bash
# Required
NODE_ENV=production
DEPLOYMENT_TARGET=production
MCP_SERVER_NAME=my-server

# Optional
BUILD_TIMEOUT=300000
TEST_COVERAGE_THRESHOLD=80
DEPLOYMENT_TIMEOUT=60000
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
Claude, execute the mcp-build workflow with the following parameters:
- server-name: "my-analytics-server"
- tools: ["query-data", "generate-report", "export-results"]
- deployment-target: "production"
```

**For Cursor/Claude Code:**

```text
Execute skill mcp-build with:
--server-name=my-analytics-server
--tools=query-data,generate-report,export-results
--deployment-target=production
```

**Direct MCP Tool Usage:**

```text
Use the filesystem MCP server to create project structure, then implement tools and deploy.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Template missing | Verify template path and recreate default template |
| TypeScript errors | Check types and fix compilation issues |
| Test failures | Debug tool implementations and fix logic errors |
| Build failures | Optimize dependencies and reduce bundle size |
| Deployment issues | Check target configuration and retry deployment |

## Related Skills

- [playwright-test](playwright-test.md) - For MCP server testing
- [doc-generate](doc-generate.md) - For documentation generation
- [api-connect](api-connect.md) - For external API integration

## References

- MCP SDK documentation
- TypeScript configuration guide
- Node.js deployment best practices
- MCP protocol specification
