# 🎯 Agent Skills

## Overview

Agent Skills Open Standard workflow definitions for AI agents, organized by category and complexity.

## Structure

```
skills/
├── core/                    # Essential workflows
│   ├── deploy/           # Application deployment
│   ├── discovery/        # Service discovery
│   └── review/           # Code review and quality
├── integration/             # Third-party integrations
│   ├── azure/            # Azure services
│   ├── github/           # GitHub operations
│   └── slack/            # Slack notifications
├── domain/                  # Business-specific
│   ├── marketing/        # Marketing workflows
│   ├── platform/         # Platform operations
│   ├── analytics/        # Data analysis
│   └── sales/            # Sales processes
├── templates/              # Reusable templates
│   ├── workflow-skill.md  # Multi-step workflows
│   └── integration-skill.md # Service integrations
├── codex/                  # Claude Code skills
└── claude/                 # Claude skills
```

## Skill Categories

### Core Skills

Essential workflows for development and operations:

- **Deploy** - Application deployment workflows
- **Discovery** - Service discovery and exploration
- **Review** - Code review and quality checks

### Integration Skills

Third-party service integrations:

- **Azure** - Azure services integration
- **GitHub** - GitHub operations and workflows
- **Slack** - Slack notifications and interactions

### Domain Skills

Business-specific operations:

- **Marketing** - Marketing workflows and campaigns
- **Platform** - Platform operations and management
- **Analytics** - Data analysis and reporting
- **Sales** - Sales processes and automation

### Templates

Reusable templates for creating new skills:

- **Workflow Template** - Multi-step workflow template
- **Integration Template** - Service integration template

## Quick Start

```bash
# Create new skill from template
mkdir -p skills/my-domain && cp skills/templates/workflow-skill.md skills/my-domain/my-skill.md

# Test skill (when implemented)
pnpm test:skill my-skill

# Validate skill format (when implemented)
pnpm validate:skills
```

## Documentation

- [Skill Format Reference](mcp/docs/skill-format.md)
- [Skills Guide](mcp/docs/skills-guide.md)
- [Agent Skills Research](mcp/docs/agent-skills-research.md)
