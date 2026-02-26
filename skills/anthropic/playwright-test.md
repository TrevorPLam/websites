---
name: playwright-test
description: |
  **PLAYWRIGHT TESTING WORKFLOW** - Automated end-to-end testing with Playwright.
  USE FOR: Web application testing, regression testing, cross-browser testing.
  DO NOT USE FOR: Unit testing, simple API testing.
  INVOKES: [filesystem, fetch].
meta:
  version: '1.0.0'
  author: 'anthropic-ecosystem'
  category: 'testing'
---

# Playwright Testing Workflow

## Overview

This Skill orchestrates comprehensive end-to-end testing using Playwright, including test setup, execution, reporting, and integration with CI/CD pipelines.

## Prerequisites

- Node.js 18+ environment
- Playwright installed and configured
- Test environment setup (browsers, devices)
- Test data and fixtures available
- CI/CD pipeline integration

## Workflow Steps

### 1. Setup Test Environment

**Action:** Initialize Playwright testing environment and configuration

**Validation:**
- Playwright browsers installed (Chrome, Firefox, Safari)
- Test configuration files created
- Test data fixtures loaded
- Environment variables configured

**MCP Server:** filesystem (for config files)

**Expected Output:** Configured Playwright testing environment

### 2. Write Test Specifications

**Action:** Create or update test specifications and test cases

**Validation:**
- Test files follow naming conventions
- Test cases cover critical user flows
- Page object models implemented
- Test data properly isolated

**MCP Server:** filesystem (for test templates)

**Expected Output:** Complete test specifications

### 3. Execute Test Suite

**Action:** Run Playwright test suite with specified configuration

**Validation:**
- Tests execute without errors
- Test coverage meets requirements
- Cross-browser compatibility verified
- Performance metrics collected

**MCP Server:** filesystem (for test execution)

**Expected Output:** Test execution results and reports

### 4. Generate Test Reports

**Action:** Generate comprehensive test reports and analytics

**Validation:**
- HTML reports generated with detailed results
- Screenshots captured for failures
- Video recordings of test runs
- Analytics data collected

**MCP Server:** filesystem (for report generation)

**Expected Output:** Complete test reports and analytics

### 5. Integrate with CI/CD

**Action:** Integrate Playwright testing with CI/CD pipeline

**Validation:**
- CI pipeline configuration updated
- Test triggers configured
- Artifacts properly stored
- Notifications configured

**MCP Server:** fetch (for CI/CD API calls)

**Expected Output:** Integrated CI/CD testing pipeline

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Environment Setup | Browser installation failed | Install missing browsers | No |
| Test Writing | Template errors | Use fallback templates | Partial |
| Test Execution | Test failures | Debug and fix issues | No |
| Report Generation | Report errors | Use fallback format | No |
| CI/CD Integration | Pipeline errors | Manual intervention | No |

## Success Criteria

- Playwright environment properly configured
- Test suite covers critical functionality
- Tests pass across target browsers
- Comprehensive reports generated
- CI/CD integration functional
- Test metrics meet quality thresholds

## Environment Variables

```bash
# Required
PLAYWRIGHT_BROWSERS=chrome,firefox,safari
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_HEADLESS=true
TEST_BASE_URL=http://localhost:3000

# Optional
PLAYWRIGHT_VIDEO=true
PLAYWRIGHT_SCREENSHOT=only-on-failure
PLAYWRIGHT_RETRY=3
PLAYWRIGHT_PARALLEL_WORKERS=4
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
claude, execute the playwright-test workflow with the following parameters:
- test-suite: "e2e-tests"
- browsers: "chrome,firefox"
- headless: true
- generate-reports: true
```

**For Cursor/Claude Code:**

```text
Execute skill playwright-test with:
--test-suite=e2e-tests
--browsers=chrome,firefox
--headless=true
--generate-reports=true
```

**Direct MCP Tool Usage:**

```text
Use the filesystem MCP server to access test files and the fetch server for CI/CD integration.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Browser installation | Run Playwright install script |
| Test failures | Debug test code and fix issues |
| Report errors | Check report configuration and permissions |
| CI/CD issues | Verify pipeline configuration and access |

## Related Skills

- [mcp-build](mcp-build.md) - For MCP server testing
- [doc-generate](doc-generate.md) - For test documentation
- [api-connect](api-connect.md) - For API testing integration

## References

- Playwright documentation
- Test automation best practices
- Cross-browser testing guide
- CI/CD integration patterns
