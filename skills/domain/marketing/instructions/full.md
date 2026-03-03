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

**Action:** Perform comprehensive SEO audit via the `seo-tools` server

- **Tool:** `seo-tools` → `audit_site_seo` (audit `{url}` with `depth: full`)
- **Tool:** `seo-tools` → `check_meta_tags` (validate meta tags for key pages)
- **Purpose:** Analyze site SEO performance and identify issues
- **Failure:** Continue with partial audit, flag missing data

### 2. Content Optimization

**Action:** Read existing content and produce optimized version

- **Tool:** `content-management` → `get_content` (read current page content)
- **Tool:** `seo-tools` → `check_meta_tags` (validate updated content meta tags)
- **Purpose:** Improve content SEO score and readability
- **Failure:** Use baseline optimization rules

### 3. Content Publishing

**Action:** Write optimized content back to repository

- **Tool:** `content-management` → `update_content` (persist updated content)
- **Tool:** `content-management` → `publish_content` (commit and push changes)
- **Purpose:** Deploy content to website and distribution channels
- **Failure:** Queue content for manual review

### 4. Campaign Setup

**Action:** Create and configure a marketing campaign

- **Tool:** `campaign-automation` → `create_campaign` (create campaign with channel + budget)
- **Tool:** `campaign-automation` → `schedule_campaign` (schedule for launch date)
- **Purpose:** Set up tracking pixels, analytics, and attribution
- **Failure:** Use default tracking configuration

### 5. Performance Monitoring

**Action:** Monitor campaign and content performance

- **Tool:** `marketing-analytics` → `get_dashboard_data` (real-time performance data)
- **Tool:** `marketing-analytics` → `get_campaign_metrics` (campaign-specific metrics)
- **Tool:** `knowledge-graph` → `create_entities` (cache performance data locally)
- **Purpose:** Real-time performance monitoring and alerting
- **Failure:** Use cached performance data from knowledge-graph

### 6. A/B Testing

**Action:** Read A/B test configuration and update variant weights

- **Tool:** `content-management` → `get_content` (read experiment config)
- **Tool:** `content-management` → `update_content` (write updated variant weights)
- **Purpose:** Optimize conversion rates through testing
- **Failure:** Deploy with single variant

### 7. Reporting & Insights

**Action:** Generate comprehensive marketing reports

- **Tool:** `marketing-analytics` → `query_analytics` (query Tinybird reporting pipe)
- **Tool:** `content-management` → `create_content` (write report to `reports/marketing/`)
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

## Reference Documents

- `references/client-intake.md` — Client onboarding and data collection workflow
- `references/lead-research.md` — Lead research and qualification workflow
- `references/seo-audit.md` — SEO audit and analysis reference
- `references/website-build.md` — Website build and launch workflow

## MCP Server Dependencies

- `marketing-analytics`: Query analytics events, campaign metrics, and dashboard data (Tinybird / GA4)
- `content-management`: Read, write, and publish content files via filesystem and Git
- `seo-tools`: SEO auditing, meta tag validation, search rankings, and sitemap generation
- `campaign-automation`: Campaign lifecycle management (create, update, schedule, pause)
- `knowledge-graph`: Cache and retrieve performance data and experiment results locally

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
