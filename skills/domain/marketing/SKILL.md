---
name: marketing
description: |
  **WORKFLOW SKILL** - Comprehensive marketing tools and campaign management.
  USE FOR: "SEO audit", "content publish", "campaign tracking", "marketing analytics".
  DO NOT USE FOR: tenant setup, billing management, technical deployment.
  INVOKES: analytics, content-management, seo-tools, campaign-automation.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
---

# Marketing Workflow

## Overview

This Skill provides comprehensive marketing tools including SEO auditing, content publishing, and campaign tracking for multi-tenant marketing websites.

## Prerequisites

- Access to analytics platforms
- Content management system credentials
- SEO tool API keys
- Campaign tracking configuration

## Workflow Steps

### 1. SEO Audit & Analysis

**Action:** Perform comprehensive SEO audit

- **Tool:** `seo-tools` → `run-seo-audit`
- **Purpose:** Analyze site SEO performance and identify issues
- **Failure:** Continue with partial audit, flag missing data

### 2. Content Optimization

**Action:** Optimize content for search engines

- **Tool:** `seo-tools` → `optimize-content`
- **Purpose:** Improve content SEO score and readability
- **Failure:** Use baseline optimization rules

### 3. Content Publishing

**Action:** Publish optimized content across channels

- **Tool:** `content-management` → `publish-content`
- **Purpose:** Deploy content to website and distribution channels
- **Failure:** Queue content for manual review

### 4. Campaign Setup

**Action:** Configure marketing campaign tracking

- **Tool:** `campaign-automation` → `setup-campaign`
- **Purpose:** Set up tracking pixels, analytics, and attribution
- **Failure:** Use default tracking configuration

### 5. Performance Monitoring

**Action:** Monitor campaign and content performance

- **Tool:** `analytics` → `track-performance`
- **Purpose:** Real-time performance monitoring and alerting
- **Failure:** Use cached performance data

### 6. A/B Testing

**Action:** Set up A/B tests for content and campaigns

- **Tool:** `campaign-automation` → `setup-ab-test`
- **Purpose:** Optimize conversion rates through testing
- **Failure:** Deploy with single variant

### 7. Reporting & Insights

**Action:** Generate comprehensive marketing reports

- **Tool:** `analytics` → `generate-report`
- **Purpose:** Create performance reports and actionable insights
- **Failure:** Provide basic performance summary

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

- `seo-tools`: SEO analysis and optimization
- `content-management`: Content publishing and management
- `campaign-automation`: Campaign setup and tracking
- `analytics`: Performance monitoring and reporting

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
