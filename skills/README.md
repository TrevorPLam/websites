# 🎯 Agent Skills

## Overview

Agent Skills Open Standard workflow definitions for AI agents, organized by category and complexity.

## Structure

```
skills/
├── core/                    # Essential workflows
│   ├── deploy/           # Application deployment
│   ├── test/             # Testing and validation
│   └── review/           # Code review and quality
├── integration/             # Third-party integrations
│   ├── azure/            # Azure services
│   ├── github/           # GitHub operations
│   └── slack/            # Slack notifications
├── domain/                  # Business-specific
│   ├── marketing/        # Marketing workflows
│   ├── sales/            # Sales processes
│   └── analytics/        # Data analysis
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
- **Test** - Testing and validation workflows  
- **Review** - Code review and quality checks

### Integration Skills
Third-party service integrations:
- **Azure** - Azure services integration
- **GitHub** - GitHub operations and workflows
- **Slack** - Slack notifications and interactions

### Domain Skills
Business-specific operations:
- **Marketing** - Marketing workflows and campaigns
- **Sales** - Sales processes and automation
- **Analytics** - Data analysis and reporting

### Templates
Reusable templates for creating new skills:
- **Workflow Template** - Multi-step workflow template
- **Integration Template** - Service integration template

## Quick Start

```bash
# Create new skill from template
cp skills/templates/workflow-skill.md skills/my-domain/my-skill.md

# Test skill
pnpm test:skill my-skill

# Validate skill format
pnpm validate:skills
```

## Documentation

- [Skill Format Reference](mcp/docs/skill-format.md)
- [Skills Guide](mcp/docs/skills-guide.md)
- [Agent Skills Research](mcp/docs/agent-skills-research.md)
