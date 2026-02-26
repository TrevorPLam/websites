---
name: lead-research
description: |
  **LEAD RESEARCH WORKFLOW** - Automated lead generation and qualification workflow.
  USE FOR: Lead prospecting, qualification scoring, contact enrichment.
  DO NOT USE FOR: Simple data entry, basic contact lookups.
  INVOKES: [fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Lead Research Workflow

## Overview

This Skill orchestrates comprehensive lead research and qualification processes, including prospect identification, data enrichment, qualification scoring, and CRM integration for agency client acquisition.

## Prerequisites

- Access to lead data sources (LinkedIn, company databases)
- CRM system integration
- Email verification services
- Lead scoring model configuration

## Workflow Steps

### 1. Define Lead Criteria

**Action:** Establish target lead parameters and qualification criteria

**Validation:**
- Target industry segments defined
- Company size parameters set
- Geographic scope confirmed
- Decision-maker roles identified
- Budget range requirements

**MCP Server:** filesystem-mcp (for criteria configuration)

**Expected Output:** Lead qualification framework with scoring weights

### 2. Prospect Data Collection

**Action:** Gather potential lead data from multiple sources

**Validation:**
- Data source accessibility confirmed
- API rate limits respected
- Data quality thresholds met
- Duplicate detection enabled
- Compliance requirements checked

**MCP Server:** fetch-mcp (for data source APIs)

**Expected Output:** Raw prospect data with source attribution

### 3. Data Enrichment

**Action:** Enhance prospect data with additional information

**Validation:**
- Email addresses verified
- Company information updated
- Social media profiles linked
- Technology stack identified
- Recent activities tracked

**MCP Server:** fetch-mcp (for enrichment APIs)

**Expected Output:** Enriched prospect profiles with confidence scores

### 4. Qualification Scoring

**Action:** Apply lead scoring model to rank prospects

**Validation:**
- Scoring model parameters applied
- Weight distribution verified
- Threshold settings confirmed
- Manual review flags set
- Ranking consistency checked

**MCP Server:** filesystem-mcp (for scoring algorithms)

**Expected Output:** Qualified lead list with scores and priority rankings

### 5. Contact Information Verification

**Action:** Verify and validate contact information accuracy

**Validation:**
- Email deliverability tested
- Phone number format verified
- Social profile authenticity checked
- Company domain confirmed
- GDPR compliance verified

**MCP Server:** fetch-mcp (for verification services)

**Expected Output:** Verified contact data with accuracy indicators

### 6. CRM Integration

**Action:** Import qualified leads into CRM system

**Validation:**
- Duplicate prevention enabled
- Data mapping confirmed
- Lead assignment rules applied
- Follow-up sequences triggered
- Integration health checked

**MCP Server:** fetch-mcp (for CRM API)

**Expected Output:** CRM records created with automated follow-up setup

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Criteria Definition | Invalid parameters | Use default criteria, flag for review | No |
| Data Collection | API rate limits | Implement backoff, use alternative sources | No |
| Data Enrichment | Verification failures | Use partial data, note confidence level | No |
| Scoring | Model errors | Use fallback scoring, manual review required | No |
| Verification | Contact invalid | Flag for manual research, remove from automation | No |
| CRM Integration | Import failures | Queue for retry, create manual import file | Yes |

## Success Criteria

- Lead criteria clearly defined and validated
- Comprehensive prospect data collected from multiple sources
- Data enrichment completed with accuracy thresholds met
- Lead scoring applied with consistent rankings
- Contact information verified and deliverable
- CRM integration successful with follow-up automation

## Environment Variables

```bash
# Required
LINKEDIN_API_KEY=your_linkedin_key
CRM_API_URL=https://api.crm.agency.com
CRM_API_KEY=your_crm_key
EMAIL_VERIFICATION_API_KEY=your_email_verify_key
DATA_SOURCE_API_KEY=your_data_source_key

# Optional
LEAD_SCORE_THRESHOLD=75
DATA_RETENTION_DAYS=90
VERIFICATION_TIMEOUT=30
BATCH_SIZE=50
```

## Usage Examples

```bash
# Basic lead research
skill invoke lead-research --industry="technology" --company-size="100-500" --location="US"

# Advanced with custom criteria
skill invoke lead-research --industry="healthcare" --company-size="50-1000" --location="US,EU" --lead-score-threshold=80 --batch-size=100
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Low data quality | Adjust source parameters, implement additional validation |
| High verification failure rates | Update verification methods, check data source reliability |
| CRM import errors | Verify field mapping, check API permissions |
| Scoring inconsistencies | Review model parameters, validate weight distributions |

## Related Skills

- [client-intake](client-intake.md) - For converting qualified leads to clients
- [seo-audit](seo-audit.md) - For pre-qualification website analysis
- [website-build](website-build.md) - For post-conversion project setup

## References

- Lead generation best practices guide
- Data enrichment service documentation
- CRM integration API documentation
- Email verification service guidelines
- GDPR compliance for lead processing
