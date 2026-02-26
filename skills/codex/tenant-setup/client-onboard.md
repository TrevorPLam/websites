---
name: client-onboard
description: |
  **WORKFLOW SKILL** - Complete client tenant onboarding for marketing websites SaaS.
  USE FOR: "client onboarding", "tenant setup", "new client configuration".
  DO NOT USE FOR: Simple site creation - use full tenant workflow.
  INVOKES: filesystem, sqlite, github, knowledge-graph, fetch.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "workflow"
---

# Client Tenant Onboarding Workflow

## Overview
This Skill orchestrates the complete tenant onboarding process for new marketing website clients in the multi-tenant SaaS platform.

## Prerequisites

- Admin access to tenant management system
- GitHub repository access
- Database connection for tenant records
- Client information package (domain, branding, requirements)

## Workflow Steps

### 1. Client Information Validation

**Action:** Validate and process client onboarding data

** MCP Server:** filesystem

**Expected Output:** Structured client data with validation status

```bash
# Validate client package
/filesystem read-file --path=onboarding/{client-name}/client-info.json
```

**Validation Checklist:**
- Client name and contact information
- Domain name and DNS configuration
- Brand assets (logos, colors, fonts)
- Feature requirements and customizations
- Subscription plan and billing tier

### 2. Tenant Database Setup

**Action:** Create tenant database record with proper isolation

** MCP Server:** sqlite

**Expected Output:** Tenant ID and database configuration

```bash
# Create tenant record
/sqlite execute-query --query="
INSERT INTO tenants (id, name, domain, plan, status, created_at) 
VALUES (uuid(), ?, ?, 'active', 'professional', NOW())
" --params=["{client-name}", "{client-domain}"]
```

**Security Requirements:**
- Generate unique tenant UUID
- Set up Row Level Security policies
- Configure tenant-specific schemas
- Initialize default tenant settings

### 3. Repository Structure Creation

**Action:** Create client-specific repository structure

** MCP Server:** github

**Expected Output:** Repository branches and initial structure

```bash
# Create client branch
/github create-branch --repo="marketing-websites" --branch="client/{client-name}"

# Create client directory structure
/filesystem create-directory --path="clients/{client-name}"
/filesystem create-directory --path="clients/{client-name}/config"
/filesystem create-directory --path="clients/{client-name}/assets"
/filesystem create-directory --path="clients/{client-name}/content"
```

**Directory Structure:**
```
clients/{client-name}/
├── config/
│   ├── tenant.json
│   ├── site-config.json
│   └── features.json
├── assets/
│   ├── logos/
│   ├── images/
│   └── fonts/
├── content/
│   ├── pages/
│   ├── posts/
│   └── media/
└── custom/
    ├── components/
    ├── styles/
    └── scripts/
```

### 4. Configuration File Generation

**Action:** Generate tenant-specific configuration files

** MCP Server:** filesystem

**Expected Output:** Complete configuration file set

```bash
# Generate tenant configuration
/filesystem write-file --path="clients/{client-name}/config/tenant.json" --content='{
  "tenantId": "{generated-uuid}",
  "clientName": "{client-name}",
  "domain": "{client-domain}",
  "plan": "professional",
  "features": ["blog", "analytics", "forms"],
  "branding": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#64748b",
    "logoPath": "/assets/logos/primary.png"
  }
}'
```

**Configuration Files:**
- `tenant.json` - Core tenant settings
- `site-config.json` - Website configuration
- `features.json` - Enabled features list
- `branding.json` - Visual identity settings
- `integrations.json` - Third-party service configs

### 5. Brand Asset Processing

**Action:** Process and optimize client brand assets

** MCP Server:** filesystem

**Expected Output:** Optimized asset library

```bash
# Process logo files
/filesystem copy-file --source="onboarding/{client-name}/logo.png" --destination="clients/{client-name}/assets/logos/primary.png"

# Generate responsive variants
/filesystem create-directory --path="clients/{client-name}/assets/logos/responsive"
# Process different sizes for responsive design
```

**Asset Processing:**
- Logo optimization (PNG, SVG, favicon generation)
- Color palette extraction and validation
- Font loading and optimization
- Image compression and responsive variants

### 6. Knowledge Graph Integration

**Action:** Register client in knowledge graph for AI context

** MCP Server:** knowledge-graph

**Expected Output:** Client entity with relationships

```bash
# Create client entity
/knowledge-graph create-entity --type="client" --name="{client-name}" --properties='{
  "tenantId": "{generated-uuid}",
  "domain": "{client-domain}",
  "plan": "professional",
  "onboardingDate": "{current-date}",
  "features": ["blog", "analytics", "forms"]
}'
```

**Knowledge Graph Entities:**
- Client entity with basic information
- Domain entity for web properties
- Feature entities for enabled capabilities
- Relationship mappings between entities

### 7. DNS and SSL Configuration

**Action:** Configure domain settings and SSL certificates

** MCP Server:** fetch (for DNS API calls)

**Expected Output:** Configured domain with SSL

```bash
# Check DNS configuration
/fetch fetch --url="https://dns.api.example.com/check?domain={client-domain}"

# Configure SSL certificate
/fetch fetch --url="https://ssl.api.example.com/request" --method=POST --body='{
  "domain": "{client-domain}",
  "tenantId": "{generated-uuid}"
}'
```

**DNS Configuration:**
- A record for main domain
- CNAME for www subdomain
- MX records for email (if required)
- TXT records for verification

### 8. Initial Content Setup

**Action:** Create initial website content and pages

** MCP Server:** filesystem

**Expected Output:** Basic website structure

```bash
# Create home page
/filesystem write-file --path="clients/{client-name}/content/pages/index.md" --content='---
title: "Welcome to {client-name}"
description: "Professional marketing website"
layout: "default"
---

# Welcome to {client-name}

Your professional marketing website is now ready.
'

# Create about page
/filesystem write-file --path="clients/{client-name}/content/pages/about.md" --content='---
title: "About {client-name}"
description: "Learn more about our company"
layout: "default"
---

# About {client-name}

Add your company story here.
'
```

**Default Pages:**
- Home page with welcome message
- About page with company information
- Contact page with form integration
- Privacy policy and terms pages

### 9. Integration Configuration

**Action:** Set up third-party service integrations

** MCP Server:** filesystem

**Expected Output:** Configured integrations

```bash
# Configure analytics
/filesystem write-file --path="clients/{client-name}/config/integrations.json" --content='{
  "analytics": {
    "provider": "google-analytics",
    "trackingId": "{ga-tracking-id}",
    "tenantId": "{generated-uuid}"
  },
  "forms": {
    "provider": "hubspot",
    "portalId": "{hubspot-portal-id}",
    "formId": "{hubspot-form-id}"
  }
}'
```

**Common Integrations:**
- Google Analytics 4
- HubSpot Forms and CRM
- Mailchimp Email Marketing
- Social media platforms

### 10. Quality Assurance Testing

**Action:** Perform comprehensive QA checks

** MCP Server:** fetch (for testing endpoints)

**Expected Output:** QA report with pass/fail status

```bash
# Test website accessibility
/fetch fetch --url="https://{client-domain}" --check-status=200

# Test SSL certificate
/fetch fetch --url="https://{client-domain}/health" --verify-ssl=true

# Test tenant isolation
/fetch fetch --url="https://api.{platform-domain}/tenants/{generated-uuid}/validate"
```

**QA Checklist:**
- Website loads without errors
- SSL certificate valid and trusted
- All pages accessible (200 status)
- Mobile responsive design
- Core Web Vitals within thresholds
- Tenant data isolation verified

## Error Handling

### Onboarding Failures
- **Data Validation Errors**: Return specific field requirements
- **Database Creation Failures**: Retry with alternative tenant ID
- **Repository Creation Failures**: Manual intervention required
- **DNS Configuration Issues**: Provide manual setup instructions

### Rollback Procedures
```bash
# Delete tenant database record
/sqlite execute-query --query="DELETE FROM tenants WHERE id = ?" --params=["{tenant-id}"]

# Remove client directory
/filesystem delete-directory --path="clients/{client-name}" --recursive=true

# Remove knowledge graph entities
/knowledge-graph delete-entity --type="client" --id="{client-name}"
```

## Success Criteria

- [ ] Tenant database record created with proper UUID
- [ ] Repository structure established
- [ ] Configuration files generated and validated
- [ ] Brand assets processed and optimized
- [ ] Knowledge graph entities created
- [ ] DNS and SSL configured
- [ ] Initial content created
- [ ] Third-party integrations configured
- [ ] Quality assurance tests passed
- [ ] Client access credentials provided

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@localhost/marketing_sites
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
KNOWLEDGE_GRAPH_API_KEY=kg_xxxxxxxxxxxxxxxxxxxx
DNS_API_KEY=dns_xxxxxxxxxxxxxxxxxxxx
SSL_API_KEY=ssl_xxxxxxxxxxxxxxxxxxxx

# Optional
ANALYTICS_API_KEY=ga_xxxxxxxxxxxxxxxxxxxx
CRM_API_KEY=hubspot_xxxxxxxxxxxxxxxxxxxx
EMAIL_API_KEY=mailchimp_xxxxxxxxxxxxxxxxxxxx
```

## Usage Examples

```bash
# Basic onboarding
"Start client onboarding for Acme Corporation at acme.com"

# Advanced onboarding with custom features
"Onboard client InnovateTech at innovatetech.io with enterprise plan and custom analytics integration"

# Onboarding with specific requirements
"Set up tenant for GlobalMarketing with custom domain, blog features, and HubSpot CRM integration"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tenant ID collision | Regenerate UUID and retry database creation |
| DNS propagation delay | Provide temporary staging URL |
| Asset upload failures | Check file formats and sizes |
| SSL certificate errors | Verify domain ownership and retry |
| Integration API failures | Validate API keys and permissions |

## Related Skills

- `claude/deploy-production` - For deploying tenant sites
- `claude/code-review` - For reviewing custom tenant code
- `domain/marketing/client-intake` - For initial client data collection

## References

- [Multi-Tenant Architecture Guide](../references/multi-tenant-patterns.md)
- [Tenant Isolation Security](../references/tenant-security.md)
- [DNS Configuration Guide](../references/dns-setup.md)
- [SSL Certificate Management](../references/ssl-management.md)

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
