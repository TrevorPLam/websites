---
name: code-review
description: |
  **WORKFLOW SKILL** - Comprehensive code review with security analysis.
  USE FOR: "code review", "pr review", "security review", "quality check".
  DO NOT USE FOR: automated linting, simple syntax checks.
  INVOKES: github-mcp, enterprise-security, sequential-thinking.
meta:
  version: "1.0.0"
  author: "cascade-ai"
---

# Code Review Workflow

## Overview
This Skill orchestrates a comprehensive code review process using MCP servers for security analysis, reasoning, and GitHub integration.

## Review Scope
- Security vulnerability assessment
- Code quality and best practices
- Architecture and design patterns
- Performance considerations
- Testing coverage

## Workflow Steps

### 1. Repository Analysis
**Action:** Fetch PR details and changed files
- **Tool:** `github-mcp` → `get-pull-request`
- **Purpose:** Analyze changes and context
- **Failure:** Request valid PR URL

### 2. Security Assessment
**Action:** Scan for security vulnerabilities
- **Tool:** `enterprise-security` → `code-security-scan`
- **Purpose:** Identify security issues and compliance violations
- **Failure:** Report security findings

### 3. Code Quality Analysis
**Action:** Analyze code quality and patterns
- **Tool:** `sequential-thinking` → `analyze-code-quality`
- **Purpose:** Evaluate maintainability, readability, and best practices
- **Failure:** Provide improvement suggestions

### 4. Architecture Review
**Action:** Assess architectural impact
- **Tool:** `sequential-thinking` → `review-architecture`
- **Purpose:** Evaluate design patterns and system impact
- **Failure:** Suggest architectural improvements

### 5. Generate Review Report
**Action:** Compile comprehensive review
- **Tool:** `sequential-thinking` → `generate-review-summary`
- **Purpose:** Create actionable review summary
- **Failure:** Provide basic findings

## Review Criteria

### Security
- Authentication and authorization patterns
- Data validation and sanitization
- Dependency vulnerabilities
- Information disclosure risks

### Quality
- Code readability and maintainability
- Adherence to coding standards
- Error handling patterns
- Documentation completeness

### Architecture
- Design pattern consistency
- Separation of concerns
- Performance implications
- Scalability considerations

## Output Format
- Executive summary
- Detailed findings by category
- Severity classification
- Actionable recommendations
- Approval/rejection rationale

## MCP Server Dependencies
- `github-mcp`: PR analysis and file changes
- `enterprise-security`: Security vulnerability scanning
- `sequential-thinking`: Code analysis and reasoning

## Notes
- Integrates with GitHub PR workflow
- Customizable review criteria per project
- Supports automated and manual review modes
