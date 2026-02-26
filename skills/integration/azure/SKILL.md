---
name: azure-deploy
description: |
  **WORKFLOW SKILL** - Deploy to Azure using azd.
  USE FOR: "deploy", "azd up", "provision infrastructure".
  DO NOT USE FOR: general Azure queries (use azure-mcp directly).
  INVOKES: azure-mcp, github, fetch.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
---

# Azure Deployment Workflow

## Overview

This Skill orchestrates Azure deployment using the Azure Developer CLI (azd) with proper validation, provisioning, and notification workflows.

## Prerequisites

- Azure CLI installed and authenticated
- azd CLI installed
- GitHub repository with azd configuration
- Slack webhook configured (optional)

## Workflow Steps

### 1. Environment Validation

**Action:** Validate Azure environment and authentication

- **Tool:** `azure-mcp` → `validate-config`
- **Purpose:** Ensure Azure CLI is authenticated and environment is ready
- **Failure:** Abort deployment with authentication instructions

### 2. Infrastructure Provisioning

**Action:** Provision Azure resources using azd

- **Tool:** `azure-mcp` → `azd-up`
- **Purpose:** Deploy infrastructure and application to Azure
- **Failure:** Provide detailed error logs and rollback suggestions

### 3. GitHub Integration

**Action:** Update GitHub status and deployment metadata

- **Tool:** `github` → `update-deployment-status`
- **Purpose:** Mark deployment status in GitHub PR/issues
- **Failure:** Continue deployment, log GitHub sync failure

### 4. Notification (Optional)

**Action:** Send deployment notification to Slack

- **Tool:** `fetch` → `send-webhook-notification`
- **Purpose:** Notify team of deployment completion
- **Failure:** Non-critical, continue without notification

## Environment Variables Required

- `AZURE_SUBSCRIPTION_ID`: Azure subscription identifier
- `AZURE_RESOURCE_GROUP`: Target resource group
- `AZURE_LOCATION`: Azure region (e.g., eastus)
- `SLACK_WEBHOOK_URL`: Optional Slack webhook URL

## Error Handling

- **Authentication Failures**: Clear instructions for Azure CLI login
- **Provisioning Failures**: Detailed Azure error logs with remediation steps
- **GitHub Sync Failures**: Continue deployment, log for manual update
- **Notification Failures**: Non-critical, deployment considered successful

## Success Criteria

- Azure resources provisioned successfully
- Application deployed and accessible
- GitHub status updated (if applicable)
- Team notified (if Slack configured)

## MCP Server Dependencies

- `azure-mcp`: Azure CLI and azd integration
- `github`: GitHub repository status management
- `fetch`: Webhook delivery for notifications

## Notes

- Requires proper Azure permissions for resource provisioning
- Supports multiple environments (dev, staging, prod)
- Integrates with existing GitHub workflows
- Configurable notification channels
