---
name: code-review
description: |
  **CODE REVIEW WORKFLOW** - Automated and manual code review process with security checks.
  USE FOR: Pull request reviews, security audits, quality assurance.
  DO NOT USE FOR: Simple syntax checks, basic linting.
  INVOKES: [github-mcp, fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Code Review Workflow

## Overview

This Skill orchestrates comprehensive code review processes including automated security scanning, quality analysis, manual review coordination, and approval workflows for pull requests.

## Prerequisites

- Repository access and permissions
- Code review tools integration
- Security scanning setup
- Quality gates configuration
- Review team assignment

## Workflow Steps

### 1. Pull Request Analysis

**Action:** Analyze pull request changes and context

**Validation:**
- Pull request metadata collected
- Files changed identified
- Commit history reviewed
- Branch context verified
- Review requirements assessed

**MCP Server:** github-mcp (for PR data extraction)

**Expected Output:** PR analysis report with change summary and review requirements

### 2. Automated Security Scanning

**Action:** Run comprehensive security analysis on code changes

**Validation:**
- Static analysis security scan completed
- Dependency vulnerability check performed
- Secret detection scan executed
- Code injection analysis run
- Security policy compliance verified

**MCP Server:** fetch-mcp (for security scanning APIs)

**Expected Output:** Security scan report with findings and risk assessment

### 3. Code Quality Analysis

**Action:** Evaluate code quality and maintainability

**Validation:**
- Code complexity analysis performed
- Test coverage assessment completed
- Performance impact analysis done
- Documentation coverage checked
- Coding standards compliance verified

**MCP Server:** filesystem-mcp (for analysis tools)

**Expected Output:** Quality analysis report with metrics and recommendations

### 4. Automated Testing

**Action:** Execute automated test suite on changes

**Validation:**
- Unit tests executed and passing
- Integration tests completed
- End-to-end tests run
- Performance tests conducted
- Accessibility tests performed

**MCP Server:** fetch-mcp (for test execution APIs)

**Expected Output:** Test results report with coverage and failure analysis

### 5. Review Assignment

**Action:** Assign appropriate reviewers based on expertise and file changes

**Validation:**
- Code ownership rules applied
- Expertise matching performed
- Reviewer availability checked
- Conflict of interest avoided
- Review load balanced

**MCP Server:** github-mcp (for reviewer assignment)

**Expected Output:** Reviewer assignment with expertise justification

### 6. Manual Review Coordination

**Action:** Coordinate manual review process and feedback collection

**Validation:**
- Review requests sent
- Feedback collected and consolidated
- Discussion threads monitored
- Resolution tracking maintained
- Approval status tracked

**MCP Server:** github-mcp (for review coordination)

**Expected Output:** Review feedback summary with action items

### 7. Approval Decision

**Action:** Make approval/rejection decision based on all reviews

**Validation:**
- All review criteria satisfied
- Security issues addressed
- Quality standards met
- Test coverage adequate
- Documentation complete

**MCP Server:** filesystem-mcp (for decision logic)

**Expected Output:** Final approval decision with reasoning

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| PR Analysis | Inaccessible PR | Request access, use alternative data sources | No |
| Security Scanning | Scan failures | Use alternative scanners, manual security review | No |
| Quality Analysis | Tool failures | Use fallback analysis tools, manual review | No |
| Automated Testing | Test failures | Block approval, require test fixes | No |
| Review Assignment | No available reviewers | Escalate to team leads, expand reviewer pool | No |
| Manual Review | Reviewer conflicts | Mediate conflicts, reassign if needed | No |
| Approval Decision | Criteria not met | Request changes, re-review after fixes | No |

## Success Criteria

- Pull request fully analyzed with change context
- Security scans completed with no critical vulnerabilities
- Code quality metrics meet established thresholds
- Automated test suite passes with adequate coverage
- Appropriate reviewers assigned and feedback collected
- All review criteria satisfied before approval
- Decision documented with clear reasoning

## Environment Variables

```bash
# Required
GITHUB_TOKEN=your_github_token
SECURITY_SCANNER=semgrep
TEST_FRAMEWORK=jest
COVERAGE_THRESHOLD=80
QUALITY_GATE=sonarqube

# Optional
MAX_COMPLEXITY=10
MAX_FILE_CHANGES=50
REVIEW_TIMEOUT=7d
ESCALATION_THRESHOLD=3
```

## Usage Examples

```bash
# Standard code review
skill invoke code-review --pr="123" --repository="agency/platform" --security-scan="true"

# Emergency review with expedited process
skill invoke code-review --pr="456" --repository="agency/platform" --expedited="true" --reviewers="senior-dev,security-lead"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Security scan timeouts | Increase timeout, scan in parallel, use faster scanner |
| Reviewer availability | Auto-assign backup reviewers, escalate to team leads |
| Quality gate failures | Provide specific improvement suggestions, block merge |
| Test execution failures | Debug test environment, provide detailed failure reports |

## Related Skills

- [production-deploy](deploy/production-deploy.md) - For deployment approval process
- [service-discovery](discovery/service-discovery.md) - For dependency impact analysis
- [azure-deploy](../integration/azure/azure-deploy.md) - For Azure-specific review patterns

## References

- Code review best practices guide
- Security scanning documentation
- Quality metrics framework
- Testing standards and procedures
- GitHub API documentation
