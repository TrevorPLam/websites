---
name: skill-discovery
description: |
  **UTILITY SKILL** - Discover and search available Skills and MCP servers.
  USE FOR: "find skills", "search tools", "list available skills", "what can I use".
  DO NOT USE FOR: executing specific skills (use the skill directly).
  INVOKES: skillset, filesystem.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
---

# Skill Discovery Workflow

## Overview

This Skill provides comprehensive discovery and search capabilities for all available Skills and MCP servers across the platform.

## Discovery Methods

### 1. Skills Catalog

**Action:** List all available Skills with descriptions

- **Tool:** `filesystem` → `read-directory`
- **Purpose:** Scan `skills/` directory for all skills
- **Output:** Skill name, description, and metadata

### 2. MCP Server Inventory

**Action:** List all configured MCP servers

- **Tool:** `skillset` → `list-mcp-servers`
- **Purpose:** Discover available external tools and capabilities
- **Output:** Server name, capabilities, and status

### 3. Capability Search

**Action:** Search for specific capabilities across Skills and MCP servers

- **Tool:** `skillset` → `search-capabilities`
- **Purpose:** Find tools for specific tasks (e.g., "deploy", "security", "database")
- **Output:** Matching Skills and MCP servers with relevance scores

### 4. Skill Recommendations

**Action:** Recommend Skills based on current context

- **Tool:** `skillset` → `recommend-skills`
- **Purpose:** Suggest optimal Skills for current task or project
- **Output:** Ranked list of recommended Skills with usage guidance

## Search Categories

### Development Workflows

- **Code Review**: Security analysis, quality checks, architecture review
- **Deployment**: Production deployment, Azure deployment, infrastructure provisioning
- **Testing**: Unit tests, integration tests, E2E testing
- **Multi-Tenant**: Tenant setup, billing, rate limiting

### Infrastructure & Operations

- **Database**: SQLite access, query optimization, migrations
- **Security**: Vulnerability scanning, compliance checks, audit logging
- **Monitoring**: Performance metrics, health checks, observability
- **Authentication**: OAuth 2.1, SAML 2.0, tenant isolation

### External Integrations

- **Version Control**: GitHub operations, repository management
- **Documentation**: Web fetching, API documentation
- **Communication**: Slack notifications, team coordination
- **Project Management**: Linear/Jira integration, ticket management

## Usage Patterns

### Explicit Discovery

```
/skill-discovery                    # List all available skills
/skill-discovery search "deploy"    # Find deployment-related skills
/skill-discovery mcp-servers         # List all MCP servers
```

### Contextual Recommendations

- **Automatic**: Skill suggests relevant tools based on current task
- **Interactive**: Ask "what tools do I have for X?"
- **Comparative**: Compare similar Skills for different use cases

## Integration Points

### MCP Server Dependencies

- `skillset`: RAG-based skill discovery and recommendations
- `filesystem`: Directory scanning and skill metadata reading

### Platform Integration

- **Claude Code**: Progressive disclosure with skill recommendations
- **Windsurf**: Cascade integration with contextual suggestions
- **Cursor**: Rule-based skill discovery and tool mapping
- **Codex**: UI-based skill browser and search interface

## Output Formats

### Skills List

- Skill name and version
- Description and use cases
- MCP server dependencies
- Platform compatibility

### MCP Server Inventory

- Server name and status
- Available tools and capabilities
- Configuration requirements
- Usage examples

### Search Results

- Relevance-ranked matches
- Capability descriptions
- Usage recommendations
- Alternative options

## Performance Optimization

- **Caching**: Cache skill metadata for 5-minute TTL
- **Indexing**: Pre-compute capability mappings
- **Lazy Loading**: Load detailed descriptions on demand
- **Progressive Disclosure**: Show high-level info first, details on request

## Notes

- Integrates with all platform skill systems
- Supports natural language search queries
- Maintains capability index for fast lookups
- Provides contextual recommendations based on current work
- Updates automatically when new Skills are added
