---
name: deploy-production
description: |
  **WORKFLOW SKILL** - Deploy to production with comprehensive safety checks.
  USE FOR: "deploy to prod", "production release", "deploy to production".
  DO NOT USE FOR: development deployments, environment-specific config changes.
  INVOKES: github-mcp, enterprise-security, observability, secure-deployment.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
---

# Production Deployment Workflow

## Overview

This Skill orchestrates a secure production deployment using enterprise MCP servers for validation, security checks, and deployment orchestration.

## Prerequisites

- All tests passing in CI/CD
- GitHub status checks green
- Security scan completed
- Deployment window approved

## Workflow Steps

### 1. Pre-Deployment Validation

**Action:** Check repository status and CI health

- **Tool:** `github-mcp` → `get-repo-status`
- **Purpose:** Verify branch is clean and CI checks pass
- **Failure:** Abort deployment with detailed status

### 2. Security Assessment

**Action:** Run comprehensive security analysis

- **Tool:** `enterprise-security` → `security-scan`
- **Purpose:** Check for vulnerabilities, dependency issues, and compliance
- **Failure:** Block deployment and generate security report

### 3. Observability Baseline

**Action:** Capture current system metrics

- **Tool:** `observability` → `capture-baseline`
- **Purpose:** Establish pre-deployment performance baseline
- **Failure:** Warning only, proceed with monitoring

### 4. Deployment Execution

**Action:** Execute secure deployment

- **Tool:** `secure-deployment` → `deploy-production`
- **Purpose:** Coordinated deployment with rollback capability
- **Failure:** Automatic rollback and alerting

### 5. Post-Deployment Verification

**Action:** Validate deployment success

- **Tool:** `observability` → `health-check`
- **Purpose:** Verify system health and performance
- **Failure:** Trigger rollback protocol

## Error Handling

- **Automatic Rollback:** Triggered on health check failures
- **Alerting:** Notify team via configured channels
- **Audit Logging:** All actions logged with correlation IDs

## Success Criteria

- All services healthy
- Performance metrics within acceptable ranges
- No security vulnerabilities introduced
- User-facing functionality verified

## MCP Server Dependencies

- `github-mcp`: Repository status and branch management
- `enterprise-security`: Security scanning and compliance
- `observability`: System monitoring and health checks
- `secure-deployment`: Deployment orchestration and rollback

## Notes

- This Skill requires elevated permissions for production deployments
- Integration with existing CI/CD pipeline recommended
- Customizable approval workflows available per organization
