---
name: production-deploy
description: |
  **PRODUCTION DEPLOYMENT WORKFLOW** - Automated production deployment with safety checks.
  USE FOR: Production deployments, hotfixes, rollback operations.
  DO NOT USE FOR: Development deployments, local testing.
  INVOKES: [github-mcp, fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Production Deployment Workflow

## Overview

This Skill orchestrates safe production deployments with comprehensive pre-flight checks, automated testing, deployment execution, and post-deployment validation with rollback capabilities.

## Prerequisites

- Production environment access
- Deployment pipeline configuration
- Monitoring and alerting setup
- Backup and rollback procedures
- Change approval process

## Workflow Steps

### 1. Pre-Flight Validation

**Action:** Validate deployment readiness and prerequisites

**Validation:**
- Branch protection rules satisfied
- Code review approvals completed
- All tests passing in CI/CD
- Security scans passed
- Performance benchmarks met

**MCP Server:** github-mcp (for branch and PR validation)

**Expected Output:** Pre-flight check report with go/no-go decision

### 2. Environment Preparation

**Action:** Prepare production environment for deployment

**Validation:**
- Database backups completed
- Configuration files validated
- Environment variables verified
- Service dependencies checked
- Capacity planning confirmed

**MCP Server:** fetch-mcp (for environment APIs)

**Expected Output:** Environment readiness confirmation with backup verification

### 3. Blue-Green Deployment

**Action:** Execute blue-green deployment strategy

**Validation:**
- New environment provisioned
- Application deployed to green environment
- Health checks passing
- Load balancer configuration ready
- Traffic routing prepared

**MCP Server:** fetch-mcp (for deployment APIs)

**Expected Output:** Green environment ready for traffic switching

### 4. Smoke Testing

**Action:** Perform comprehensive smoke testing on green environment

**Validation:**
- Critical user journeys tested
- API endpoints responding
- Database connectivity verified
- Third-party integrations working
- Performance within acceptable ranges

**MCP Server:** fetch-mcp (for testing automation)

**Expected Output:** Smoke test report with all critical paths verified

### 5. Traffic Switch

**Action:** Switch production traffic to new deployment

**Validation:**
- Load balancer configuration updated
- Traffic routing verified
- Error rates monitored
- Response times tracked
- User experience validated

**MCP Server:** fetch-mcp (for traffic management APIs)

**Expected Output:** Traffic successfully switched with monitoring active

### 6. Post-Deployment Validation

**Action:** Validate deployment success and system stability

**Validation:**
- Health checks passing
- Error rates within thresholds
- Performance metrics stable
- User feedback monitored
- Business metrics tracked

**MCP Server:** fetch-mcp (for monitoring APIs)

**Expected Output:** Post-deployment validation report with stability confirmation

### 7. Cleanup and Finalization

**Action:** Clean up old deployment and finalize process

**Validation:**
- Blue environment decommissioned
- Resources cleaned up
- Documentation updated
- Team notifications sent
- Deployment recorded

**MCP Server:** filesystem-mcp (for cleanup scripts)

**Expected Output:** Cleanup completed with deployment finalized

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Pre-Flight Validation | Check failures | Block deployment, fix issues | No |
| Environment Preparation | Backup failures | Reschedule deployment, investigate | No |
| Blue-Green Deployment | Deployment failures | Rollback to blue, investigate | Yes |
| Smoke Testing | Critical failures | Block traffic switch, fix issues | No |
| Traffic Switch | Routing errors | Immediate rollback to blue | Yes |
| Post-Deployment Validation | Stability issues | Monitor, prepare rollback if needed | Yes |
| Cleanup | Resource issues | Manual cleanup, document issues | No |

## Success Criteria

- All pre-flight checks passed
- Environment successfully prepared with backups
- Blue-green deployment completed without errors
- Smoke testing validates all critical functionality
- Traffic switched successfully with no user impact
- Post-deployment metrics within acceptable ranges
- Cleanup completed and deployment documented

## Environment Variables

```bash
# Required
DEPLOY_PLATFORM=vercel
MONITORING_SERVICE=datadog
BACKUP_SERVICE=aws-s3
NOTIFICATION_SERVICE=slack
TRAFFIC_MANAGER=cloudflare

# Optional
HEALTH_CHECK_TIMEOUT=300
PERFORMANCE_THRESHOLD_MS=500
ERROR_RATE_THRESHOLD=0.01
ROLLBACK_TIMEOUT=600
```

## Usage Examples

```bash
# Standard production deployment
skill invoke production-deploy --branch="main" --environment="production" --strategy="blue-green"

# Emergency hotfix deployment
skill invoke production-deploy --branch="hotfix/critical-bug" --environment="production" --strategy="immediate" --rollback-window="15m"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pre-flight check failures | Review failed checks, fix issues, reschedule deployment |
| Deployment timeouts | Increase timeout values, check resource availability |
| Smoke test failures | Investigate failing tests, fix issues before traffic switch |
| Traffic switch errors | Verify load balancer configuration, check DNS propagation |
| Post-deployment instability | Monitor metrics, prepare rollback if thresholds exceeded |

## Related Skills

- [code-review](code-review.md) - For pre-deployment code validation
- [service-discovery](service-discovery.md) - For dependency management
- [azure-deploy](../integration/azure/azure-deploy.md) - For Azure-specific deployments

## References

- Production deployment best practices guide
- Blue-green deployment documentation
- Infrastructure as code patterns
- Monitoring and alerting setup
- Rollback procedures and runbooks
