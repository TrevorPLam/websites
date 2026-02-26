---
name: seo-audit
description: |
  **SEO AUDIT WORKFLOW** - Comprehensive SEO analysis and optimization workflow.
  USE FOR: Website SEO audits, competitive analysis, optimization recommendations.
  DO NOT USE FOR: Simple SEO checks, single-page analysis.
  INVOKES: [fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# SEO Audit Workflow

## Overview

This Skill orchestrates comprehensive SEO audits for client websites, including technical analysis, content evaluation, competitive benchmarking, and actionable optimization recommendations.

## Prerequisites

- Access to website crawling tools
- Google Search Console API credentials
- Competitor analysis tools
- SEO performance metrics database

## Workflow Steps

### 1. Initial Website Crawl

**Action:** Perform comprehensive website crawl to discover pages and structure

**Validation:**
- Website accessibility confirmed
- Robots.txt compliance checked
- Sitemap discovery and validation
- Crawl depth and scope defined

**MCP Server:** fetch-mcp (for crawling API calls)

**Expected Output:** Complete site inventory with page metadata and structure

### 2. Technical SEO Analysis

**Action:** Analyze technical SEO factors and identify issues

**Validation:**
- Page load speed measurements
- Mobile responsiveness verification
- SSL certificate status
- Schema markup validation
- Canonical tag verification

**MCP Server:** filesystem-mcp (for analysis scripts)

**Expected Output:** Technical SEO report with prioritized issues

### 3. Content Quality Assessment

**Action:** Evaluate content quality, relevance, and optimization

**Validation:**
- Content uniqueness checks
- Keyword density analysis
- Readability scores
- Content length optimization
- Internal linking structure

**MCP Server:** fetch-mcp (for content analysis APIs)

**Expected Output:** Content quality report with optimization opportunities

### 4. Competitive Analysis

**Action:** Analyze competitor SEO strategies and performance

**Validation:**
- Competitor identification confirmed
- Keyword overlap analysis
- Backlink profile comparison
- Content gap identification
- Ranking position tracking

**MCP Server:** fetch-mcp (for competitive intelligence APIs)

**Expected Output:** Competitive analysis report with strategic insights

### 5. Performance Metrics Analysis

**Action:** Analyze historical SEO performance and trends

**Validation:**
- Google Search Console data retrieved
- Traffic trend analysis
- Ranking position changes
- Click-through rate analysis
- Conversion impact assessment

**MCP Server:** fetch-mcp (for analytics API calls)

**Expected Output:** Performance dashboard with trend analysis

### 6. Generate Recommendations

**Action:** Create prioritized SEO optimization recommendations

**Validation:**
- Impact vs effort assessment
- Technical feasibility verification
- Resource requirement analysis
- Timeline estimation
- ROI projection

**MCP Server:** filesystem-mcp (for report generation)

**Expected Output:** Comprehensive SEO audit report with actionable recommendations

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Website Crawl | Site inaccessible | Schedule retry, notify client | No |
| Technical Analysis | API rate limiting | Use cached data, retry later | No |
| Content Analysis | Content blocked | Respect robots.txt, note limitations | No |
| Competitive Data | Data unavailable | Use alternative sources, note limitations | No |
| Performance Data | API authentication failure | Refresh credentials, retry | No |
| Report Generation | Template failure | Use fallback template format | No |

## Success Criteria

- Complete website inventory collected
- All critical technical issues identified
- Content optimization opportunities documented
- Competitive landscape analyzed
- Performance trends established
- Actionable recommendations generated

## Environment Variables

```bash
# Required
CRAWLING_API_URL=https://api.crawler.service.com
CRAWLING_API_KEY=your_crawler_key
GOOGLE_SEARCH_CONSOLE_CLIENT_ID=your_gsc_client_id
GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=your_gsc_secret
COMPETITIVE_API_KEY=your_competitive_key

# Optional
CRAWL_DEPTH=3
CONTENT_MIN_LENGTH=300
PERFORMANCE_DAYS_BACK=90
REPORT_FORMAT=html
```

## Usage Examples

```bash
# Basic SEO audit
skill invoke seo-audit --website="https://client-website.com" --competitors="competitor1.com,competitor2.com"

# Advanced with custom parameters
skill invoke seo-audit --website="https://client-website.com" --crawl-depth=5 --content-min-length=500 --report-format=pdf
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Website crawl fails | Check robots.txt, verify site accessibility |
| API rate limits exceeded | Implement backoff strategy, use cached data |
| Incomplete competitive data | Use multiple data sources, note limitations |
| Report generation errors | Verify template integrity, use fallback format |

## Related Skills

- [client-intake](client-intake.md) - For initial client data gathering
- [lead-research](lead-research.md) - For pre-audit lead qualification
- [website-build](website-build.md) - For implementing SEO recommendations

## References

- Google Search Console API documentation
- Technical SEO best practices guide
- Content optimization frameworks
- Competitive analysis methodologies
- SEO performance measurement standards
