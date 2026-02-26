---
name: client-intake
description: |
  **CLIENT INTAKE WORKFLOW** - Automated client onboarding and data collection workflow.
  USE FOR: New client registration, initial data gathering, project setup.
  DO NOT USE FOR: Existing client updates, simple data entry.
  INVOKES: [fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Client Intake Workflow

## Overview

This Skill orchestrates the complete client onboarding process, from initial contact form submission to project setup in the agency management system. It handles data validation, duplicate checking, and automated project creation.

## Prerequisites

- Access to agency CRM system
- Valid API credentials for project management tools
- Email service integration for notifications
- Client data validation schemas

## Workflow Steps

### 1. Validate Client Information

**Action:** Validate and sanitize incoming client data from intake forms

**Validation:** 
- Required fields present (name, email, company, project type)
- Email format validation
- Company name uniqueness check
- Project type compatibility

**MCP Server:** filesystem-mcp (for data validation rules)

**Expected Output:** Sanitized and validated client data object

### 2. Duplicate Client Check

**Action:** Search existing client database to prevent duplicate entries

**Validation:**
- Email address match check
- Company name similarity check
- Phone number match check
- Domain overlap check

**MCP Server:** fetch-mcp (for API calls to CRM)

**Expected Output:** Duplicate status report and existing client info if found

### 3. Create Client Record

**Action:** Create new client record in CRM system

**Validation:**
- Unique client ID generated
- All required fields populated
- Data integrity checks passed
- Database write confirmation

**MCP Server:** fetch-mcp (for CRM API calls)

**Expected Output:** New client record with unique ID and confirmation

### 4. Setup Project Structure

**Action:** Create initial project structure and assign project manager

**Validation:**
- Project ID generated
- Project template applied
- Team members assigned
- Timeline initialized

**MCP Server:** filesystem-mcp (for project template files)

**Expected Output:** Project setup confirmation with team assignments

### 5. Send Welcome Notification

**Action:** Send automated welcome email and project kickoff information

**Validation:**
- Email delivery confirmation
- Link tracking verification
- Client portal access created
- Notification preferences set

**MCP Server:** fetch-mcp (for email service API)

**Expected Output:** Welcome email sent and client portal access confirmed

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Validation | Missing required fields | Request missing information | No |
| Duplicate Check | Potential duplicate found | Flag for manual review | No |
| Client Creation | API failure | Retry with exponential backoff | Yes |
| Project Setup | Template failure | Use default template | Partial |
| Email Send | Delivery failure | Queue for retry | No |

## Success Criteria

- Client record created with all required information
- No duplicate entries in database
- Project structure properly initialized
- Welcome notification successfully delivered
- Client portal access configured

## Environment Variables

```bash
# Required
CRM_API_URL=https://api.crm.agency.com
CRM_API_KEY=your_crm_api_key
EMAIL_SERVICE_API_KEY=your_email_key
PROJECT_TEMPLATE_PATH=/templates/client-projects

# Optional
DUPLICATE_CHECK_THRESHOLD=0.8
EMAIL_RETRY_ATTEMPTS=3
PROJECT_MANAGER_ID=default_pm_id
```

## Usage Examples

```bash
# Basic client intake
skill invoke client-intake --name="John Doe" --email="john@company.com" --company="Acme Corp" --project-type="website"

# Advanced with custom project manager
skill invoke client-intake --name="Jane Smith" --email="jane@startup.io" --company="Startup Inc" --project-type="mobile-app" --project-manager="pm_123"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Duplicate client detected | Review existing client records and merge if appropriate |
| Project template missing | Verify template path and recreate default template |
| Email delivery failure | Check email service credentials and retry |
| API rate limiting | Implement backoff strategy and retry later |

## Related Skills

- [lead-research](lead-research.md) - For pre-intake lead qualification
- [website-build](website-build.md) - For website project setup
- [seo-audit](seo-audit.md) - For post-intake SEO analysis

## References

- Agency CRM API documentation
- Project management system integration guide
- Email service provider documentation
- Client data protection and privacy policies
