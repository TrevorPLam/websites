---
name: github-workflow
description: |
  **WORKFLOW SKILL** - GitHub repository management and workflow automation.
  USE FOR: "github workflow", "repo management", "issue tracking", "PR automation".
  DO NOT USE FOR: general git operations (use git-mcp directly).
  INVOKES: github, filesystem, git.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'integration'
---

# GitHub Workflow Automation

## Overview

This Skill orchestrates GitHub repository management workflows including issue tracking,
PR automation, repository status updates, and team collaboration workflows.

## Prerequisites

- GitHub CLI installed and authenticated (gh auth login)
- GITHUB_TOKEN environment variable set
- Proper repository permissions
- Git CLI installed

## Workflow Steps

### 1. Repository Status Check

**Action:** Assess current repository state and health

- **Tool**: `github` → `list-repositories`
- **Purpose:** Get repository overview and status
- **Validation:** Repository is accessible and properly configured
- **Failure:** Abort with authentication instructions

### 2. Issue Management

**Action:** Create, update, or triage GitHub issues

- **Tool**: `github` → `create-issue` or `update-issue`
- **Purpose:** Manage project issues and tracking
- **Validation:** Issue creation/update permissions verified
- **Failure:** Log error and continue with other workflows

### 3. Pull Request Automation

**Action:** Create and manage pull requests with proper metadata

- **Tool**: `github` → `create-pull-request` or `update-pr`
- **Purpose:** Automate PR creation with templates and labels
- **Validation:** PR creation permissions and branch protection rules
- **Failure:** Provide manual PR creation instructions

### 4. Repository Health Check

**Action:** Analyze repository for security and maintenance issues

- **Tool**: `github` → `get-repository-details`
- **Purpose:** Check for security vulnerabilities, outdated dependencies
- **Validation:** Repository analysis completes successfully
- **Failure:** Continue workflow, log health check failures

### 5. Team Notification

**Action:** Update team on workflow completion

- **Tool**: `github` → `create-issue-comment` or `update-pr-status`
- **Purpose:** Notify stakeholders of workflow completion
- **Validation:** Notification permissions verified
- **Failure:** Non-critical, workflow considered successful

## Environment Variables Required

- `GITHUB_TOKEN`: GitHub personal access token
- `GITHUB_REPOSITORY`: Target repository (format: owner/repo)
- `GITHUB_DEFAULT_BRANCH`: Default branch name (usually main)

## Error Handling

| Step           | Error             | Recovery                             | Rollback? |
| -------------- | ----------------- | ------------------------------------ | --------- |
| Authentication | Invalid token     | Clear instructions for gh auth login | No        |
| Issue Creation | Permissions       | Check repository permissions         | No        |
| PR Creation    | Branch protection | Manual intervention required         | No        |
| Health Check   | API limits        | Wait and retry                       | No        |
| Notification   | Rate limit        | Continue without notification        | No        |

## Success Criteria

- Repository status assessed successfully
- Issues/PRs created or updated as requested
- Health check completed with actionable insights
- Team notified of workflow completion
- All operations logged for audit trail

## MCP Server Dependencies

- `github`: GitHub API integration and repository management
- `filesystem`: Local file operations for configuration
- `git`: Git operations for branch and commit management

## Usage Examples

### Repository Health Assessment

```bash
# Trigger repository health check
Agent: "Run GitHub-workflow skill for repository health assessment"
```

### Issue Creation Workflow

```bash
# Create issue with template
Agent: "Use GitHub-workflow to create a bug report issue"
```

### PR Automation

```bash
# Create PR with proper labels
Agent: "Execute GitHub-workflow to create feature PR"
```

## Integration Patterns

### Continuous Integration

- Works with CI/CD pipelines for automated PR management
- Integrates with existing GitHub Actions workflows
- Supports automated testing and deployment triggers

### Project Management

- Links with project management tools via issue metadata
- Supports milestone and release tracking
- Enables automated issue triage and assignment

### Security Compliance

- Automated security vulnerability scanning
- Dependency update workflows
- Compliance reporting and audit trails

## Notes

- Requires proper GitHub permissions for all operations
- Supports both public and private repositories
- Integrates with existing GitHub workflows and Actions
- Configurable for different repository types and team structures
- Includes rate limiting awareness and retry logic

## Troubleshooting

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Authentication failures     | Run `gh auth login` and verify GITHUB_TOKEN         |
| Permission denied           | Check repository permissions and token scopes       |
| API rate limits             | Implement exponential backoff and retry             |
| Branch protection conflicts | Manual intervention required for protected branches |
| Webhook failures            | Verify webhook configuration and endpoints          |

## Related Skills

- `azure-deploy`: Deployment workflows with GitHub integration
- `code-review`: Automated code review workflows
- `production-deploy`: Production deployment with GitHub status updates

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Repository Security Best Practices](https://docs.github.com/en/code-security)
