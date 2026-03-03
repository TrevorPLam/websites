---
name: website-build
description: |
  **WEBSITE BUILD WORKFLOW** - Complete website development and deployment workflow.
  USE FOR: New website projects, site redesigns, multi-site deployments.
  DO NOT USE FOR: Simple content updates, minor design changes.
  INVOKES: [fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Website Build Workflow

## Overview

This Skill orchestrates the complete website development process, from project kickoff through development, testing, deployment, and post-launch optimization for agency client websites.

## Prerequisites

- Access to development environments
- Deployment pipeline configuration
- Domain management tools
- Performance monitoring setup
- Client approval workflow system

## Workflow Steps

### 1. Project Setup and Architecture

**Action:** Initialize project structure and technical architecture

**Validation:**
- Technology stack confirmed
- Project repository created
- Development environment provisioned
- Team access configured
- Architecture documentation prepared

**MCP Server:** filesystem-mcp (for project templates)

**Expected Output:** Initialized project with development environment and team access

### 2. Design Implementation

**Action:** Convert approved designs into functional code

**Validation:**
- Design assets received and organized
- Component library initialized
- Responsive breakpoints defined
- Accessibility requirements confirmed
- Cross-browser compatibility planned

**MCP Server:** filesystem-mcp (for component scaffolding)

**Expected Output:** Frontend components implementing approved designs

### 3. Content Management Setup

**Action:** Configure CMS and content structure

**Validation:**
- CMS platform selected and configured
- Content types defined
- User roles and permissions set
- Content migration plan prepared
- Editorial workflow established

**MCP Server:** fetch-mcp (for CMS API configuration)

**Expected Output:** Functional CMS with content structure and user access

### 4. Integration Development

**Action:** Implement third-party integrations and APIs

**Validation:**
- API requirements documented
- Authentication credentials secured
- Data flow mappings created
- Error handling implemented
- Performance impact assessed

**MCP Server:** fetch-mcp (for integration testing)

**Expected Output:** Working integrations with error handling and monitoring

### 5. Performance Optimization

**Action:** Optimize site performance and loading speed

**Validation:**
- Core Web Vitals targets defined
- Image optimization implemented
- Code minification and bundling
- Caching strategies configured
- CDN setup verified

**MCP Server:** filesystem-mcp (for optimization scripts)

**Expected Output:** Optimized website meeting performance benchmarks

### 6. Testing and Quality Assurance

**Action:** Comprehensive testing across devices and browsers

**Validation:**
- Functional testing completed
- Cross-browser compatibility verified
- Mobile responsiveness confirmed
- Accessibility compliance validated
- Security testing performed

**MCP Server:** fetch-mcp (for automated testing services)

**Expected Output:** Test reports with identified issues resolved

### 7. Deployment and Launch

**Action:** Deploy website to production and go live

**Validation:**
- Production environment prepared
- Domain configuration verified
- SSL certificates installed
- DNS propagation confirmed
- Monitoring systems active

**MCP Server:** fetch-mcp (for deployment APIs)

**Expected Output:** Live website with monitoring and backup systems

### 8. Post-Launch Optimization

**Action:** Monitor performance and implement improvements

**Validation:**
- Analytics tracking verified
- Performance metrics monitored
- User feedback collected
- SEO optimization implemented
- Security updates applied

**MCP Server:** fetch-mcp (for monitoring APIs)

**Expected Output:** Optimized live website with ongoing monitoring

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Project Setup | Repository creation failure | Use alternative repository, retry | Yes |
| Design Implementation | Component conflicts | Refactor components, update dependencies | Partial |
| CMS Setup | Configuration errors | Reset configuration, use defaults | Yes |
| Integration Development | API failures | Implement fallback integrations | Partial |
| Performance Optimization | Benchmark failures | Revert optimizations, try alternative approaches | No |
| Testing | Critical test failures | Block deployment, fix issues | No |
| Deployment | Launch failure | Rollback to previous version, investigate | Yes |
| Post-Launch | Performance degradation | Emergency optimizations, temporary fixes | No |

## Success Criteria

- Project structure properly initialized with team access
- Design implementation matches approved mockups
- CMS functional with content management workflow
- All integrations working with proper error handling
- Performance targets met (Core Web Vitals)
- Comprehensive testing completed with no critical issues
- Successful deployment to production environment
- Post-launch monitoring active and optimized

## Environment Variables

```bash
# Required
REPO_PLATFORM=github
CMS_PLATFORM=contentful
DEPLOY_PLATFORM=vercel
MONITORING_SERVICE=datadog
DOMAIN_REGISTRAR=cloudflare

# Optional
PERFORMANCE_BUDGET_LCP=2.5
PERFORMANCE_BUDGET_FID=100
TEST_COVERAGE_THRESHOLD=80
BACKUP_RETENTION_DAYS=30
```

## Usage Examples

```bash
# Basic website build
skill invoke website-build --client="acme-corp" --tech-stack="nextjs,react,tailwind" --cms="contentful"

# Advanced with custom parameters
skill invoke website-build --client="startup-io" --tech-stack="gatsby,typescript,styled-components" --cms="strapi" --performance-target="lcp<2.0"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Performance benchmarks not met | Optimize images, reduce bundle size, implement caching |
| Integration failures | Verify API credentials, check rate limits, implement retries |
| Deployment errors | Check environment configuration, verify domain settings |
| CMS configuration issues | Reset to defaults, reconfigure user permissions |

## Related Skills

- [client-intake](client-intake.md) - For project initialization requirements
- [seo-audit](seo-audit.md) - For pre and post-launch SEO optimization
- [lead-research](lead-research.md) - For lead capture integration setup

## References

- Web development best practices guide
- Performance optimization documentation
- CMS integration manuals
- Deployment platform documentation
- Accessibility compliance standards
