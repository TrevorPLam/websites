---
name: tenant-setup
description: |
  **WORKFLOW SKILL** - Complete multi-tenant onboarding with security isolation.
  USE FOR: "tenant setup", "client onboarding", "new tenant", "provision tenant".
  DO NOT USE FOR: tenant configuration changes, billing updates.
  INVOKES: multi-tenant, enterprise-auth, enterprise-security, github.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
---

# Tenant Setup Workflow

## Overview

This Skill orchestrates secure multi-tenant provisioning with proper isolation, authentication, and compliance setup.

## Prerequisites

- Valid tenant information (name, domain, plan)
- Authentication credentials
- Compliance requirements identified

## Workflow Steps

### 1. Tenant Identity Creation

**Action:** Create tenant identity and configuration

- **Tool:** `multi-tenant` → `create-tenant`
- **Purpose:** Establish tenant with unique ID and basic config
- **Failure:** Abort with detailed validation errors

### 2. Security Isolation Setup

**Action:** Configure tenant-specific security boundaries

- **Tool:** `enterprise-security` → `setup-tenant-isolation`
- **Purpose:** Implement data isolation and access controls
- **Failure:** Rollback tenant creation

### 3. Authentication Configuration

**Action:** Set up tenant-specific authentication

- **Tool:** `enterprise-auth` → `configure-tenant-auth`
- **Purpose:** Configure SSO, OAuth, or tenant-specific auth
- **Failure:** Continue with basic auth, flag for manual setup

### 4. Resource Provisioning

**Action:** Allocate tenant resources and quotas

- **Tool:** `multi-tenant` → `allocate-resources`
- **Purpose:** Set up databases, storage, and compute resources
- **Failure:** Partial provisioning with retry logic

### 5. Compliance Validation

**Action:** Verify compliance with tenant requirements

- **Tool:** `enterprise-security` → `compliance-check`
- **Purpose:** Ensure GDPR, HIPAA, or other compliance
- **Failure:** Flag compliance issues, proceed with warnings

### 6. Repository Setup

**Action:** Create tenant-specific repository structure

- **Tool:** `github` → `create-tenant-repo`
- **Purpose:** Set up tenant code repository and configurations
- **Failure:** Use template repository, flag for manual setup

### 7. Onboarding Documentation

**Action:** Generate tenant-specific documentation

- **Tool:** `multi-tenant` → `generate-onboarding-docs`
- **Purpose:** Create setup guides and configuration docs
- **Failure:** Provide generic documentation

## Security Requirements

### Data Isolation

- Separate database schemas
- Row-level security policies
- Tenant-specific encryption keys
- Network segmentation

### Access Control

- Role-based permissions
- Least-privilege access
- Audit logging enabled
- Session management

### Compliance

- Data residency requirements
- Privacy policy compliance
- Security standards adherence
- Documentation completeness

## Output Components

- Tenant configuration file
- Security credentials package
- Resource allocation report
- Compliance checklist
- Onboarding documentation
- Support contact information

## MCP Server Dependencies

- `multi-tenant`: Tenant management and resource allocation
- `enterprise-auth`: Authentication and authorization setup
- `enterprise-security`: Security isolation and compliance
- `github`: Repository creation and configuration

## Notes

- Supports multiple tenant tiers (basic, professional, enterprise)
- Automated compliance checks for major frameworks
- Customizable resource allocation per tenant plan
- Integration with existing billing systems
