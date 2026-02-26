---
name: automated-review
description: |
  **WORKFLOW SKILL** - Automated code review with Codex-specific optimizations.
  USE FOR: "automated code review", "code quality check", "security scan".
  DO NOT USE FOR: Manual architectural reviews - use comprehensive review skill.
  INVOKES: github, filesystem, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "workflow"
---

# Automated Code Review Workflow

## Overview
This Skill orchestrates automated code review processes specifically optimized for Codex agent capabilities in the marketing websites monorepo.

## Prerequisites

- GitHub repository access
- Code changes ready for review
- Automated testing infrastructure
- Quality gates configured

## Workflow Steps

### 1. Change Set Analysis

**Action:** Analyze the scope and impact of code changes

** MCP Server:** github

**Expected Output:** Change classification and risk assessment

```bash
# Get pull request information
/github get-pull-request --repo="marketing-websites" --pr-number={pr-number}

# Get changed files
/github get-changed-files --repo="marketing-websites" --pr-number={pr-number}
```

**Analysis Categories:**
- Feature changes vs bug fixes
- Security-sensitive modifications
- Performance impact potential
- Breaking change indicators
- Test coverage requirements

### 2. Security Vulnerability Scanning

**Action:** Automated security analysis of changed code

** MCP Server:** sequential-thinking

**Expected Output:** Security findings and risk classification

```bash
# Security pattern analysis
/sequential-thinking analyze-security-patterns --files="{changed-files}" --context="multi-tenant-saas"

# Dependency vulnerability check
/sequential-thinking check-dependencies --package-files="{package-json-files}"
```

**Security Checks:**
- Multi-tenant data isolation
- Input validation patterns
- Authentication and authorization
- SQL injection prevention
- XSS and CSRF protection
- Dependency vulnerability scanning

### 3. Code Quality Assessment

**Action:** Evaluate code quality and maintainability

** MCP Server:** filesystem

**Expected Output:** Quality metrics and improvement suggestions

```bash
# Code complexity analysis
/filesystem analyze-complexity --files="{changed-files}"

# TypeScript compliance check
/filesystem validate-typescript --files="{ts-files}"

# Code style validation
/filesystem check-style --files="{changed-files}"
```

**Quality Metrics:**
- Cyclomatic complexity
- Code duplication
- TypeScript strict mode compliance
- Naming conventions
- Documentation coverage
- Error handling patterns

### 4. Performance Impact Analysis

**Action:** Assess performance implications of changes

** MCP Server:** observability

**Expected Output:** Performance impact report

```bash
# Bundle size impact analysis
/observability analyze-bundle-impact --changes="{changed-files}"

# Database query performance check
/observability analyze-query-performance --sql-files="{sql-changes}"

# Core Web Vitals impact assessment
/observability assess-cwv-impact --frontend-changes="{frontend-files}"
```

**Performance Checks:**
- Bundle size changes
- Database query optimization
- Frontend performance impact
- Memory usage implications
- Network request patterns
- Caching strategy effectiveness

### 5. Test Coverage Validation

**Action:** Verify test coverage and test quality

** MCP Server:** filesystem

**Expected Output:** Test coverage report and gaps

```bash
# Test coverage analysis
/filesystem analyze-test-coverage --changes="{changed-files}"

# Test quality assessment
/filesystem validate-test-quality --test-files="{test-files}"

# Missing test identification
/filesystem identify-missing-tests --source-files="{changed-files}"
```

**Test Validation:**
- Unit test coverage
- Integration test presence
- E2E test requirements
- Test quality metrics
- Edge case coverage
- Performance test inclusion

### 6. Architectural Compliance

**Action:** Verify adherence to architectural patterns

** MCP Server:** sequential-thinking

**Expected Output:** Architectural compliance report

```bash
# FSD layer compliance check
/sequential-thinking check-fsd-compliance --files="{changed-files}"

# Multi-tenant pattern validation
/sequential-thinking validate-tenant-patterns --files="{changed-files}"

# Security architecture review
/sequential-thinking review-security-architecture --files="{changed-files}"
```

**Architecture Checks:**
- Feature-Sliced Design compliance
- Layer dependency validation
- Multi-tenant pattern adherence
- Security architecture consistency
- Performance pattern compliance
- Integration point validation

### 7. Documentation Validation

**Action:** Verify documentation completeness and accuracy

** MCP Server:** filesystem

**Expected Output:** Documentation assessment

```bash
# Documentation coverage check
/filesystem check-documentation --files="{changed-files}"

# API documentation validation
/filesystem validate-api-docs --api-files="{api-changes}"

# README updates verification
/filesystem check-readme-updates --changes="{changed-files}"
```

**Documentation Checks:**
- Code comment coverage
- API documentation completeness
- README updates
- Changelog entries
- Integration documentation
- Troubleshooting guides

### 8. Integration Impact Assessment

**Action:** Assess impact on system integrations

** MCP Server:** observability

**Expected Output:** Integration impact report

```bash
# API compatibility check
/observability check-api-compatibility --changes="{api-changes}"

# Database migration impact
/observability assess-migration-impact --schema-changes="{schema-files}"

# Third-party integration validation
/observability validate-integrations --integration-files="{integration-changes}"
```

**Integration Checks:**
- API backward compatibility
- Database migration safety
- Third-party service compatibility
- Webhook endpoint changes
- Message queue impact
- Cache invalidation requirements

### 9. Automated Test Execution

**Action:** Run relevant automated tests

** MCP Server:** filesystem

**Expected Output:** Test execution results

```bash
# Run unit tests
/filesystem execute-tests --type=unit --files="{test-files}"

# Run integration tests
/filesystem execute-tests --type=integration --files="{integration-test-files}"

# Run E2E tests
/filesystem execute-tests --type=e2e --scope="{changed-features}"
```

**Test Execution:**
- Unit test suite
- Integration test suite
- End-to-end test scenarios
- Performance test runs
- Security test execution
- Accessibility test validation

### 10. Review Report Generation

**Action:** Generate comprehensive review report

** MCP Server:** sequential-thinking

**Expected Output:** Complete review report with recommendations

```bash
# Generate review summary
/sequential-thinking generate-review-summary --findings="{all-findings}"

# Create actionable recommendations
/sequential-thinking create-recommendations --issues="{identified-issues}"

# Generate approval status
/sequential-thinking determine-approval-status --metrics="{quality-metrics}"
```

**Report Components:**
- Executive summary
- Security findings
- Quality metrics
- Performance impact
- Test coverage report
- Architectural compliance
- Documentation status
- Integration impact
- Recommendations
- Approval decision

## Quality Gates

### Must Pass (Blocking Issues)
- Critical security vulnerabilities
- Breaking changes without migration
- Test coverage below threshold
- Performance regression beyond limits
- Architectural compliance failures

### Should Pass (Warning Issues)
- Code quality below standards
- Documentation gaps
- Minor security concerns
- Performance optimization opportunities
- Style guide violations

### Nice to Have (Informational)
- Code improvement suggestions
- Best practice recommendations
- Optimization opportunities
- Documentation enhancements

## Automated Actions

### Auto-Approve Conditions
- Only documentation changes
- Non-critical bug fixes with full test coverage
- Performance improvements with positive metrics
- Security patches with validated fixes

### Auto-Reject Conditions
- Critical security vulnerabilities
- Breaking changes without proper migration
- Test coverage below 80%
- Performance regression > 10%
- Architectural compliance failures

### Request Changes Conditions
- Security concerns requiring fixes
- Quality metrics below thresholds
- Missing test coverage
- Documentation gaps
- Integration issues

## Error Handling

### Review Failures
- **Test Execution Failures**: Retry with different test suite
- **Security Scan Timeouts**: Use cached results or manual review
- **Performance Analysis Errors**: Skip performance checks and note limitation
- **Documentation Validation Failures**: Continue review and flag for manual fix

### Recovery Procedures
```bash
# Retry failed tests
/filesystem execute-tests --retry --type=failed

# Regenerate review report
/sequential-thinking regenerate-report --exclude-failed-scans

# Manual review escalation
/github create-issue --title="Manual Review Required" --body="{review-summary}"
```

## Success Criteria

- [ ] All changed files analyzed and classified
- [ ] Security vulnerabilities identified and assessed
- [ ] Code quality metrics calculated
- [ ] Performance impact evaluated
- [ ] Test coverage validated
- [ ] Architectural compliance verified
- [ ] Documentation completeness checked
- [ ] Integration impact assessed
- [ ] Automated tests executed
- [ ] Comprehensive review report generated
- [ ] Approval decision determined
- [ ] Actionable recommendations provided

## Environment Variables

```bash
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
REPOSITORY_NAME=marketing-websites
DEFAULT_BRANCH=main

# Optional
SECURITY_SCAN_TIMEOUT=300
PERFORMANCE_ANALYSIS_ENABLED=true
TEST_COVERAGE_THRESHOLD=80
AUTO_APPROVE_ENABLED=false
NOTIFICATION_WEBHOOK_URL=https://hooks.slack.com/...
```

## Usage Examples

```bash
# Full automated review
"Run automated code review for PR #123"

# Security-focused review
"Perform automated security review for changes in auth module"

# Performance-focused review
"Analyze performance impact of frontend changes in PR #456"

# Quick quality check
"Run quick code quality assessment for recent commits"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| GitHub API rate limiting | Use authenticated requests with higher rate limits |
| Test execution timeouts | Increase timeout values or run tests in parallel |
| Security scan failures | Use fallback patterns or manual security review |
| Performance analysis errors | Skip performance checks and continue with other reviews |
| Documentation validation failures | Flag for manual documentation review |

## Related Skills

- `claude/code-review` - For comprehensive manual code reviews
- `claude/deploy-production` - For deployment validation
- `domain/marketing/seo-audit` - For SEO impact assessment

## References

- [Automated Testing Strategy](../references/automated-testing.md)
- [Security Scanning Patterns](../references/security-scanning.md)
- [Performance Monitoring](../references/performance-monitoring.md)
- [Quality Gates Configuration](../references/quality-gates.md)

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
