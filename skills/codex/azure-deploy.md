---
name: azure-deploy
description: |
  **WORKFLOW SKILL** - Deploy to Azure using azd optimized for Claude Code.
  USE FOR: "deploy", "azd up", "provision infrastructure" with code generation.
  DO NOT USE FOR: general Azure queries (use azure-mcp directly).
  INVOKES: azure-mcp, github.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  agent: 'claude-code'
---

# Azure Deployment Workflow (Claude Code-Optimized)

## Overview

This Skill orchestrates Azure deployment using the Azure Developer CLI (azd) with Claude Code-specific optimizations for code generation, file operations, and development workflow integration.

## Claude Code-Specific Features

- **Code Generation**: Automated creation of deployment scripts and configuration files
- **File Operations**: Direct manipulation of project files and deployment artifacts
- **Development Integration**: Seamless integration with local development environments
- **Build Process**: Optimized for compilation and build pipeline integration

## Prerequisites

- Azure CLI installed and authenticated
- azd CLI installed
- GitHub repository with azd configuration
- Slack webhook configured (optional)

## Workflow Steps

### 1. Environment Validation

**Action:** Validate Azure environment and authentication

- **Tool:** `azure-mcp` → `az` → `group` → `list`
- **Purpose:** Ensure Azure CLI is authenticated and environment is ready
- **Failure:** Abort deployment with authentication instructions

### 2. Infrastructure Provisioning

**Action:** Provision Azure resources using azd

- **Tool:** `azure-mcp` → `web` → `app` → `create`
- **Purpose:** Deploy infrastructure and application to Azure
- **Failure:** Provide detailed error logs and rollback suggestions

### 3. GitHub Integration

**Action:** Update GitHub status and deployment metadata

- **Tool:** `github` → `update-deployment-status`
- **Purpose:** Mark deployment status in GitHub PR/issues
- **Failure:** Continue deployment, log GitHub sync failure

## Environment Variables Required

- `AZURE_SUBSCRIPTION_ID`: Azure subscription identifier
- `AZURE_RESOURCE_GROUP`: Target resource group
- `AZURE_LOCATION`: Azure region (e.g., eastus)

## Error Handling

- **Authentication Failures**: Clear instructions for Azure CLI login
- **Provisioning Failures**: Detailed Azure error logs with remediation steps
- **GitHub Sync Failures**: Continue deployment, log for manual update

## Success Criteria

- Azure resources provisioned successfully
- Application deployed and accessible
- GitHub status updated (if applicable)

## MCP Server Dependencies

- `azure-mcp`: Azure CLI and azd integration
- `github`: GitHub repository status management

## Notes

- Requires proper Azure permissions for resource provisioning
- Supports multiple environments (dev, staging, prod)
- Integrates with existing GitHub workflows
