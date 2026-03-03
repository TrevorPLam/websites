---
name: marketing
description: |
  **WORKFLOW SKILL** - Comprehensive marketing tools and campaign management.
  USE FOR: "SEO audit", "content publish", "campaign tracking", "marketing analytics".
  DO NOT USE FOR: tenant setup, billing management, technical deployment.
  INVOKES: fetch, filesystem, github, knowledge-graph.
meta:
  version: '1.1.0'
  author: 'cascade-ai'
---

# Marketing Workflow

## Overview

This Skill provides comprehensive marketing tools including SEO auditing, content publishing, and campaign tracking for multi-tenant marketing websites.

## Prerequisites

- Access to analytics platforms (Tinybird, Google Analytics)
- Content stored in repository or filesystem
- External SEO/analytics API keys set in environment
- Campaign tracking configuration

## Workflow Steps

### 1. SEO Audit & Analysis

**Action:** Perform comprehensive SEO audit via external API

- **Tool:** `fetch` → `fetch` (GET `https://api.example.com/seo/audit?site={url}`)
- **Purpose:** Analyze site SEO performance and identify issues
- **Failure:** Continue with partial audit, flag missing data

### 2. Content Optimization

**Action:** Read existing content and produce optimized version

- **Tool:** `filesystem` → `read_file` (read current page content)
- **Tool:** `fetch` → `fetch` (POST to content optimization endpoint)
- **Purpose:** Improve content SEO score and readability
- **Failure:** Use baseline optimization rules

### 3. Content Publishing

**Action:** Write optimized content back to repository

- **Tool:** `filesystem` → `write_file` (persist updated content)
- **Tool:** `github` → `create-commit` (commit and push changes)
- **Purpose:** Deploy content to website and distribution channels
- **Failure:** Queue content for manual review

### 4. Campaign Setup

**Action:** Configure marketing campaign tracking configuration file

- **Tool:** `filesystem` → `write_file` (write campaign config JSON)
- **Tool:** `fetch` → `fetch` (POST campaign setup to analytics endpoint)
- **Purpose:** Set up tracking pixels, analytics, and attribution
- **Failure:** Use default tracking configuration

### 5. Performance Monitoring

**Action:** Monitor campaign and content performance via analytics API

- **Tool:** `fetch` → `fetch` (GET analytics dashboard endpoint)
- **Tool:** `knowledge-graph` → `create_entities` (cache performance data locally)
- **Purpose:** Real-time performance monitoring and alerting
- **Failure:** Use cached performance data from knowledge-graph

### 6. A/B Testing

**Action:** Read A/B test configuration and update variant weights

- **Tool:** `filesystem` → `read_file` (read experiment config)
- **Tool:** `filesystem` → `write_file` (write updated variant weights)
- **Purpose:** Optimize conversion rates through testing
- **Failure:** Deploy with single variant

### 7. Reporting & Insights

**Action:** Generate comprehensive marketing reports from analytics API

- **Tool:** `fetch` → `fetch` (GET reporting endpoint, e.g. Tinybird pipe)
- **Tool:** `filesystem` → `write_file` (write report to `reports/marketing/`)
- **Purpose:** Create performance reports and actionable insights
- **Failure:** Provide basic performance summary from cached data

## Marketing Tools

### SEO Analysis
- Technical SEO audit
- Keyword performance tracking
- Competitor analysis
- Backlink monitoring
- Content gap analysis

### Content Management
- Multi-channel publishing
- Content calendar management
- SEO optimization
- Performance tracking
- A/B testing integration

### Campaign Automation
- Campaign setup and management
- Multi-channel tracking
- Attribution modeling
- Conversion optimization
- Budget management

### Analytics & Reporting
- Real-time performance dashboards
- Custom report generation
- Trend analysis
- ROI tracking
- Predictive analytics

## Integration Capabilities

### Search Engines
- Google Search Console
- Bing Webmaster Tools
- Google Analytics 4
- Google Tag Manager

### Social Media
- Meta Business Suite
- LinkedIn Campaign Manager
- Twitter Analytics
- TikTok Business Center

### Content Platforms
- WordPress
- Contentful
- Sanity CMS
- Storyblok

### Email Marketing
- Mailchimp
- ConvertKit
- Klaviyo
- SendGrid

## Output Components

- SEO audit report with action items
- Published content with performance tracking
- Campaign configuration and tracking setup
- Performance dashboards and reports
- A/B test results and recommendations
- Marketing calendar and content schedule

## MCP Server Dependencies

- `fetch`: HTTP requests to SEO, analytics, and campaign APIs
- `filesystem`: Read/write content files and reports
- `github`: Commit and publish content changes
- `knowledge-graph`: Cache and retrieve performance data locally

## Security & Compliance

### Data Privacy
- GDPR compliance for tracking
- CCPA compliance for data collection
- Cookie consent management
- Data anonymization for analytics

### Brand Safety
- Content moderation filters
- Brand safety monitoring
- Ad fraud detection
- Compliance with advertising policies

## Notes

- Supports multi-tenant marketing campaigns
- Automated SEO optimization recommendations
- Real-time performance monitoring and alerting
- Integration with major marketing platforms
- Customizable reporting and dashboards
- A/B testing for continuous optimization
