---
doc_id: "ADR-E-TEMPLATE-2026"
doc_version: "1.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "architecture-team@marketing-websites.com"

# Bimodal Classification
ai_readiness_score: 0.92
human_ttv_seconds: 18
bimodal_grade: "A"

# Technical Context
type: template
language: markdown
framework: adr-e
runtime: documentation
complexity: enterprise

# Compliance & Governance
compliance_frameworks:
- "SOC2-Type-II"
- "GDPR-Article-32"
- "ISO-27001"
- "EU-AI-Act-High-Risk"
risk_classification: "medium-risk"
data_governance: "PII-Encrypted"

# AI Retrieval Optimization
rag_optimization:
  chunk_strategy: "recursive-headers"
  chunk_size: 800
  chunk_overlap: 120
  late_chunking: true
  embedding_model: "text-embedding-3-large"
  hybrid_search: true

# Executable Documentation
executable_status: true
ci_validation: true
last_executed: "2026-02-27T13:30:00Z"

# Maintenance & Quality
maintenance_mode: "active"
stale_threshold_days: 90
audit_trail: "github-actions"
---

# ADR-E: [Decision Title]

## Status
**Status**: [Proposed/Approved/Implemented/Rejected]  
**Date**: [YYYY-MM-DD]  
**Decision ID**: ADR-E-[YYYY]-[NNN]  
**Economic Impact**: [High/Medium/Low]  

## Context

This section provides the background and context for the architectural decision, including the problem statement, current state, and business drivers.

### Problem Statement
[Describe the problem or challenge that this decision addresses]

### Current State
[Describe the current situation and limitations]

### Business Drivers
[Explain the business reasons for making this decision]

## Decision

This section describes the architectural decision made, including the chosen approach and key implementation details.

### Chosen Approach
[Describe the selected solution or approach]

### Implementation Details
[Provide specific implementation details and considerations]

## Economic Impact Analysis

This section quantifies the economic impact of the decision using the ADR-E framework.

### Direct Cost Impact
- **Infrastructure Costs**: [Monthly/Annual cost impact]
- **Development Costs**: [Engineering hours required]
- **Operational Costs**: [Ongoing operational expenses]

### Velocity Impact
- **Development Velocity**: [Hours saved/week]
- **Time to Market**: [Days/Weeks improvement]
- **Team Productivity**: [Percentage increase]

### Risk-Adjusted ROI
- **Expected Benefits**: [Quantified benefits]
- **Implementation Risk**: [Risk level and mitigation]
- **Break-even Timeline**: [Months to break-even]

### Chesterton's Fence
- **Historical Context**: [Previous attempts and failures]
- **Lessons Learned**: [Key insights from past experiences]
- **Risk Mitigation**: [How this decision addresses known risks]

## Alternatives Considered

This section outlines alternative approaches that were considered and rejected, with economic rationale.

### Alternative 1: [Alternative Name]
- **Description**: [Brief description]
- **Cost Impact**: [Economic analysis]
- **Rejection Reason**: [Why this was not chosen]

### Alternative 2: [Alternative Name]
- **Description**: [Brief description]
- **Cost Impact**: [Economic analysis]
- **Rejection Reason**: [Why this was not chosen]

## Implementation Plan

This section provides a detailed implementation plan with timeline and resource requirements.

### Phase 1: [Phase Name] - [Duration]
- **Objectives**: [Key objectives]
- **Activities**: [Specific activities]
- **Resources**: [Required resources]
- **Success Criteria**: [Measurable outcomes]

### Phase 2: [Phase Name] - [Duration]
- **Objectives**: [Key objectives]
- **Activities**: [Specific activities]
- **Resources**: [Required resources]
- **Success Criteria**: [Measurable outcomes]

### Rollback Strategy
- **Rollback Triggers**: [Conditions that trigger rollback]
- **Rollback Process**: [Step-by-step rollback procedure]
- **Rollback Cost**: [Estimated cost of rollback]

## Monitoring and Evaluation

This section defines how the decision will be monitored and evaluated over time.

### Success Metrics
- **Technical Metrics**: [Technical KPIs]
- **Business Metrics**: [Business KPIs]
- **Economic Metrics**: [Financial KPIs]

### Review Schedule
- **30-Day Review**: [Post-implementation review]
- **Quarterly Review**: [Ongoing evaluation]
- **Annual Review**: [Long-term impact assessment]

### Adjustment Criteria
- **Performance Thresholds**: [Performance benchmarks]
- **Economic Thresholds**: [ROI targets]
- **Adjustment Triggers**: [Conditions for re-evaluation]

## Compliance and Governance

This section addresses compliance requirements and governance considerations.

### Regulatory Compliance
- **EU AI Act**: [Compliance status and requirements]
- **SOC2**: [Security compliance considerations]
- **GDPR**: [Data privacy implications]

### Governance Framework
- **Approval Process**: [Required approvals]
- **Documentation Requirements**: [Documentation standards]
- **Audit Trail**: [Audit logging requirements]

## References

- [Reference 1]
- [Reference 2]
- [Reference 3]

---

**Economic Impact Summary**:
- **Total Investment**: [$X]
- **Expected ROI**: [Y%]
- **Payback Period**: [Z months]
- **Risk Level**: [Low/Medium/High]

**Next Review Date**: [YYYY-MM-DD]
