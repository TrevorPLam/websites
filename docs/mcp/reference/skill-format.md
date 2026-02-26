---
title: "Agent Skills Format Reference"
category: "reference"
level: "comprehensive"
estimated_time: "15 minutes"
---

# Agent Skills Format Reference

## Overview

Complete reference for the Agent Skills Open Standard format, including frontmatter schema, workflow structure, and best practices.

## Skill File Structure

### File Naming Convention

- **Location**: `skills/{category}/{skill-name}/SKILL.md`
- **Format**: `SKILL.md` (uppercase, no extension variations)
- **Path Examples**:
  - `skills/core/deploy/SKILL.md`
  - `skills/integration/github/SKILL.md`
  - `skills/domain/marketing/SKILL.md`

### Directory Structure

```
skills/{category}/{skill-name}/
├── SKILL.md              # Main skill definition
├── agents/              # Agent-specific instructions (optional)
├── assets/              # Images, diagrams (optional)
├── references/          # External references (optional)
└── scripts/             # Automation scripts (optional)
```

## Frontmatter Schema

### Required Fields

```yaml
---
name: skill-name                    # Required: Skill identifier
description: |                     # Required: Multi-line description
  **SKILL TYPE** - Brief description.
  USE FOR: "use case description".
  DO NOT USE FOR: "exclusion criteria".
  INVOKES: mcp-server-1, mcp-server-2.
meta:
  version: '1.0.0'                # Required: Semantic version
  author: 'author-name'            # Required: Skill author
---
```

### Optional Fields

```yaml
---
name: skill-name
description: |
  Skill description...
meta:
  version: '1.0.0'
  author: 'author-name'
  category: 'workflow'              # Optional: Skill category
  tags: ['tag1', 'tag2']           # Optional: Search tags
  dependencies:                     # Optional: Skill dependencies
    mcp-servers:
      - github-mcp
      - slack-mcp
    skills:
      - another-skill
  environment:                      # Optional: Environment requirements
    node: '>=18.0.0'
    tools: ['git', 'docker']
  security:                         # Optional: Security requirements
    level: 'high'
    permissions: ['read', 'write']
  performance:                      # Optional: Performance expectations
    timeout: 300
    memory: '512MB'
---
```

## Skill Types

### Workflow Skills

**Purpose**: Multi-step processes with clear progression

**Frontmatter Example**:
```yaml
---
name: deploy-production
description: |
  **WORKFLOW SKILL** - Deploy to production environment.
  USE FOR: "production deployment", "release management".
  DO NOT USE FOR: "local testing", "development deployment".
  INVOKES: github-mcp, ci-mcp, slack-mcp.
meta:
  version: '1.0.0'
  author: 'devops-team'
  category: 'workflow'
---
```

**Structure**:
```markdown
# [Skill Name] Workflow

## Overview
[Brief description of the workflow]

## Prerequisites
[List of prerequisites]

## Workflow Steps
### 1. [Step Name]
**Action:** [Description]
**Validation:** [What to validate]
**MCP Server:** [Which server to use]
**Expected Output:** [Result]

### 2. [Additional Steps...]

## Error Handling
[Error scenarios and recovery]

## Success Criteria
[What constitutes success]
```

### Integration Skills

**Purpose**: Third-party service integrations

**Frontmatter Example**:
```yaml
---
name: github-integration
description: |
  **INTEGRATION SKILL** - GitHub repository management.
  USE FOR: "repository operations", "issue management".
  DO NOT USE FOR: "code editing", "local git operations".
  INVOKES: github-mcp.
meta:
  version: '1.0.0'
  author: 'platform-team'
  category: 'integration'
---
```

**Structure**:
```markdown
# [Service Name] Integration

## Overview
[Integration purpose and scope]

## Authentication
[Authentication setup and requirements]

## API Configuration
[API endpoints and configuration]

## Integration Workflow
[Step-by-step integration process]

## Data Mapping
[Field mappings and transformations]

## Error Handling
[API error scenarios and handling]

## Security Considerations
[Security best practices]
```

### Analysis Skills

**Purpose**: Data analysis and insights

**Frontmatter Example**:
```yaml
---
name: performance-analysis
description: |
  **ANALYSIS SKILL** - Analyze system performance metrics.
  USE FOR: "performance monitoring", "bottleneck identification".
  DO NOT USE FOR: "system monitoring", "alerting".
  INVOKES: observability-mcp, metrics-mcp.
meta:
  version: '1.0.0'
  author: 'observability-team'
  category: 'analysis'
---
```

## Content Guidelines

### Description Format

**Template**:
```yaml
description: |
  **SKILL TYPE** - One-line description.
  USE FOR: "primary use case", "secondary use case".
  DO NOT USE FOR: "exclusion criteria", "alternative use cases".
  INVOKES: server-1, server-2, server-3.
```

**Rules**:
- **SKILL TYPE**: Uppercase, one of: WORKFLOW, INTEGRATION, ANALYSIS, AUTOMATION
- **USE FOR**: Comma-separated use cases in quotes
- **DO NOT USE FOR**: Clear exclusion criteria
- **INVOKES**: Comma-separated MCP server names (lowercase, kebab-case)

### Version Format

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, documentation

### Author Format

Use team or individual identifier: `team-name` or `individual-name`

## Categories

### Core Skills

Essential workflows and fundamental operations:

- **deploy**: Deployment workflows
- **test**: Testing and validation
- **review**: Code review and quality

### Integration Skills

Third-party service integrations:

- **github**: GitHub operations
- **azure**: Azure services
- **slack**: Slack notifications
- **aws**: AWS services

### Domain Skills

Business-specific operations:

- **marketing**: Marketing workflows
- **sales**: Sales operations
- **analytics**: Data analysis
- **support**: Customer support

## Best Practices

### Writing Style

1. **Clear and Concise**: Use simple, direct language
2. **Action-Oriented**: Focus on what the skill does
3. **Specific Examples**: Provide concrete use cases
4. **Consistent Formatting**: Follow established patterns

### Structure Guidelines

1. **Logical Flow**: Steps should follow logical progression
2. **Validation Points**: Include validation at key steps
3. **Error Handling**: Cover common error scenarios
4. **Success Criteria**: Define clear success metrics

### Security Considerations

1. **Principle of Least Privilege**: Request minimum necessary permissions
2. **Credential Management**: Never hardcode sensitive data
3. **Audit Logging**: Log all skill executions
4. **Input Validation**: Validate all inputs and parameters

## Validation

### Schema Validation

Use JSON Schema to validate frontmatter:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "description", "meta"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "description": {
      "type": "string",
      "pattern": "^\\*\\*[A-Z]+ SKILL\\*\\*"
    },
    "meta": {
      "type": "object",
      "required": ["version", "author"],
      "properties": {
        "version": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+$"
        },
        "author": {
          "type": "string"
        }
      }
    }
  }
}
```

### Content Validation

1. **Required Sections**: All skills must have required sections
2. **Step Format**: Workflow steps must follow standard format
3. **MCP References**: All invoked MCP servers must exist
4. **Link Validation**: All internal links must be valid

## Migration Guide

### From Old Format

1. **Update Frontmatter**: Convert to new schema
2. **Restructure Content**: Follow new section guidelines
3. **Validate**: Run validation tools
4. **Test**: Verify skill functionality

### Version Updates

1. **Patch Changes**: Documentation updates, bug fixes
2. **Minor Changes**: New features, backward compatible
3. **Major Changes**: Breaking changes, schema updates

## Tools and Utilities

### Validation Tools

```bash
# Validate skill format
npx @repo/skills-validator validate skills/core/deploy/SKILL.md

# Check MCP server references
npx @repo/skills-validator check-mcp skills/

# Generate skill index
npx @repo/skills-validator index skills/
```

### Development Tools

```bash
# Create new skill
npx @repo/skills-generator create --type=workflow --name=my-skill

# Update skill template
npx @repo/skills-generator template --update

# Generate documentation
npx @repo/skills-generator docs skills/
```

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Invalid frontmatter | Schema validation error | Check YAML syntax |
| Missing MCP server | Server not defined | Add server to config |
| Broken links | Invalid references | Update link targets |
| Format errors | Style violations | Run linter |

### Debug Mode

```bash
# Enable debug logging
DEBUG=skills:* npx @repo/skills-validator validate skills/

# Verbose output
npx @repo/skills-validator validate skills/ --verbose
```

## Examples

### Complete Workflow Skill

See: `skills/core/deploy/SKILL.md`

### Complete Integration Skill

See: `skills/integration/github/SKILL.md`

### Template Skills

See: `skills/templates/workflow-skill.md`
See: `skills/templates/integration-skill.md`
