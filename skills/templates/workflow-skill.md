---
name: workflow-template
description: |
  **WORKFLOW SKILL TEMPLATE** - Template for creating workflow-based skills.
  USE FOR: Multi-step processes, automation workflows.
  DO NOT USE FOR: Simple single-action tasks.
  INVOKES: [filesystem, fetch, github].
meta:
  version: '1.0.0'
  author: 'your-name'
  category: 'workflow'
---

# [Skill Name] Workflow

## Overview

This Skill orchestrates [brief description of the workflow].

## Prerequisites

- [List prerequisites]
- [Required tools/credentials]
- [Environment setup]
- API endpoint: `api.[SERVICE_NAME].com` # REPLACE THIS

## Workflow Steps

### 1. [Step Name]

**Action:** [Description of the action]

**Validation:** [What to validate before proceeding]

** MCP Server:** [Which MCP server to use]

**Expected Output:** [What should be the result]

### 2. [Step Name]

**Action:** [Description of the action]

**Validation:** [What to validate before proceeding]

** MCP Server:** [Which MCP server to use]

**Expected Output:** [What should be the result]

### 3. [Additional Steps...]

[Continue with additional steps as needed]

## Error Handling

- [Common error scenarios]
- [Recovery strategies]
- [Fallback options]

## Success Criteria

- [What constitutes success]
- [Validation checkpoints]
- [Final verification steps]

## Environment Variables

```bash
# Required
SKILL_ENV_VAR=value

# Optional
OPTIONAL_VAR=default_value
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
Claude, execute the [skill-name] workflow with the following parameters:
- param: value
- option: advanced
```

**For Cursor/Claude Code:**

```text
Execute skill [skill-name] with:
--param=value
--option=advanced
```

**Direct MCP Tool Usage:**

```text
Use the skillset MCP server to invoke [skill-name] with specified parameters.
```

## Error Handling

| Step     | Error          | Recovery          | Rollback? |
| -------- | -------------- | ----------------- | --------- |
| [Step 1] | [Common error] | [Recovery action] | [Yes/No]  |
| [Step 2] | [Common error] | [Recovery action] | [Yes/No]  |
| [Step 3] | [Common error] | [Recovery action] | [Yes/No]  |

## Troubleshooting

| Issue           | Solution   |
| --------------- | ---------- |
| [Common issue]  | [Solution] |
| [Another issue] | [Solution] |

## Related Skills

- [Related skill 1]
- [Related skill 2]

## References

- [Relevant documentation]
- [API references]
- [External resources]

## Changelog

| Version | Date         | Change                  |
| ------- | ------------ | ----------------------- |
| 1.0.0   | [YYYY-MM-DD] | Initial implementation  |
| [Next]  | [YYYY-MM-DD] | [Description of change] |
