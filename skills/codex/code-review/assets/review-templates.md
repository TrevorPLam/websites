---
name: review-templates
description: |
  **ASSET TEMPLATE** - Code review templates and checklists for Codex agents.
  USE FOR: Standardizing review processes, ensuring comprehensive coverage.
  DO NOT USE FOR: Direct execution - template reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "template"
---

# Code Review Templates and Checklists

## Overview
This document provides standardized templates and checklists for Codex code review agents to ensure comprehensive, consistent, and high-quality code reviews.

## Review Templates

### 1. Security Review Template

```markdown
# Security Review Report

## Review Information
- **Reviewer**: [Agent Name]
- **Date**: [Review Date]
- **Scope**: [Files/Components Reviewed]
- **Risk Level**: [Critical/High/Medium/Low]

## Security Findings

### Critical Issues
- [ ] Authentication vulnerabilities
- [ ] Authorization bypasses
- [ ] Data exposure risks
- [ ] Injection vulnerabilities

### High Priority Issues
- [ ] Tenant isolation gaps
- [ ] Input validation missing
- [ ] Output encoding issues
- [ ] Configuration security

### Medium Priority Issues
- [ ] Logging deficiencies
- [ ] Error information disclosure
- [ ] Session management issues
- [ ] Cryptographic weaknesses

### Low Priority Issues
- [ ] Security headers missing
- [ ] Dependency vulnerabilities
- [ ] Code quality security risks
- [ ] Documentation security gaps

## Detailed Analysis

### Authentication & Authorization
- **OAuth 2.1 Compliance**: [✅/❌] 
- **PKCE Implementation**: [✅/❌]
- **Tenant Context Validation**: [✅/❌]
- **Role-Based Access Control**: [✅/❌]

### Data Protection
- **Encryption at Rest**: [✅/❌]
- **Encryption in Transit**: [✅/❌]
- **Data Minimization**: [✅/❌]
- **Audit Logging**: [✅/❌]

### Input Validation
- **SQL Injection Prevention**: [✅/❌]
- **XSS Prevention**: [✅/❌]
- **CSRF Protection**: [✅/❌]
- **File Upload Security**: [✅/❌]

## Recommendations
1. [Priority 1 recommendation]
2. [Priority 2 recommendation]
3. [Priority 3 recommendation]

## References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Guidelines](../../../references/security-patterns.md)
```

### 2. Performance Review Template

```markdown
# Performance Review Report

## Review Information
- **Reviewer**: [Agent Name]
- **Date**: [Review Date]
- **Scope**: [Files/Components Reviewed]
- **Performance Impact**: [Critical/High/Medium/Low]

## Performance Analysis

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: [Measured value] ms (Target: <2500ms)
- **Interaction to Next Paint (INP)**: [Measured value] ms (Target: <200ms)
- **Cumulative Layout Shift (CLS)**: [Measured value] (Target: <0.1)

### Bundle Size Analysis
- **Total Bundle Size**: [Size] KB (Target: <250KB gzipped)
- **Chunk Analysis**: [Breakdown by chunk]
- **Tree Shaking Effectiveness**: [Percentage]
- **Code Splitting Coverage**: [Percentage]

### Database Performance
- **Query Execution Time**: [Average] ms (Target: <100ms)
- **Index Usage**: [Percentage]
- **Connection Pool Efficiency**: [Percentage]
- **N+1 Query Issues**: [Count]

### API Performance
- **Response Time**: [Average] ms (Target: <200ms)
- **Throughput**: [Requests/second]
- **Error Rate**: [Percentage]
- **Cache Hit Ratio**: [Percentage]

## Performance Issues

### Critical Issues
- [ ] Bundle size exceeds limits
- [ ] Database query timeouts
- [ ] Memory leaks detected
- [ ] Blocking operations identified

### High Priority Issues
- [ ] Suboptimal database queries
- [ ] Missing caching strategies
- [ ] Inefficient rendering patterns
- [ ] Large asset optimization needed

### Medium Priority Issues
- [ ] Code splitting opportunities
- [ ] Lazy loading implementation
- [ ] Image optimization gaps
- [ ] Font loading optimization

### Low Priority Issues
- [ ] Minor bundle optimizations
- [ ] Cache configuration tweaks
- [ ] Asset compression improvements
- [ ] Monitoring enhancements

## Optimization Recommendations

### Immediate Actions (Critical)
1. [Critical optimization action]
2. [Critical optimization action]

### Short-term Improvements (High Priority)
1. [High priority optimization]
2. [High priority optimization]

### Long-term Enhancements (Medium/Low)
1. [Long-term enhancement]
2. [Long-term enhancement]

## Performance Monitoring
- [ ] Core Web Vitals tracking implemented
- [ ] Database performance monitoring
- [ ] API response time monitoring
- [ ] Bundle size tracking

## References
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Performance Optimization Guide](../../../references/performance-patterns.md)
```

### 3. Architecture Review Template

```markdown
# Architecture Review Report

## Review Information
- **Reviewer**: [Agent Name]
- **Date**: [Review Date]
- **Scope**: [Architecture Components Reviewed]
- **Complexity**: [Low/Medium/High/Very High]

## Architecture Assessment

### Feature-Sliced Design Compliance
- **Layer Isolation**: [✅/❌] - Proper separation between layers
- **Import Direction**: [✅/❌] - Unidirectional dependencies
- **Slice Boundaries**: [✅/❌] - Clear slice definitions
- **Cross-Slice Communication**: [✅/❌] - Proper @x notation usage

### Multi-Tenant Architecture
- **Tenant Isolation**: [✅/❌] - Data and logic separation
- **Scalability Patterns**: [✅/❌] - Horizontal scaling support
- **Resource Management**: [✅/❌] - Efficient resource allocation
- **Configuration Management**: [✅/❌] - Tenant-specific configs

### System Design Patterns
- **Repository Pattern**: [✅/❌] - Data access abstraction
- **Service Layer**: [✅/❌] - Business logic encapsulation
- **Dependency Injection**: [✅/❌] - Loose coupling implementation
- **Event-Driven Architecture**: [✅/❌] - Decoupled communication

### Database Architecture
- **Schema Design**: [✅/❌] - Normalization and relationships
- **Index Strategy**: [✅/❌] - Query optimization
- **Migration Strategy**: [✅/❌] - Schema evolution management
- **Data Consistency**: [✅/❌] - Transactional integrity

## Architecture Issues

### Critical Issues
- [ ] Circular dependencies detected
- [ ] Tight coupling between components
- [ ] Single Responsibility Principle violations
- [ ] Scalability bottlenecks

### High Priority Issues
- [ ] Inconsistent architectural patterns
- [ ] Missing abstraction layers
- [ ] Poor separation of concerns
- [ ] Inadequate error handling

### Medium Priority Issues
- [ ] Code organization improvements
- [ ] Interface design gaps
- [ ] Documentation inconsistencies
- [ ] Testing architecture gaps

### Low Priority Issues
- [ ] Minor naming inconsistencies
- [ ] Code style improvements
- [ ] Comment quality enhancements
- [ ] Documentation updates

## Recommendations

### Structural Changes
1. [Architectural restructuring recommendation]
2. [Pattern implementation recommendation]

### Process Improvements
1. [Development process improvement]
2. [Review process enhancement]

### Documentation Updates
1. [Architecture documentation update]
2. [API documentation improvement]

## Compliance Check
- [ ] FSD v2.1 compliance verified
- [ ] Multi-tenant patterns implemented
- [ ] Security architecture validated
- [ ] Performance architecture optimized

## References
- [FSD Documentation](../../../references/fsd-patterns.md)
- [Architecture Guidelines](../../../references/architecture-patterns.md)
```

## Review Checklists

### 1. Pre-Review Checklist

```markdown
# Pre-Review Checklist

## Context Preparation
- [ ] Understand the purpose and scope of changes
- [ ] Review related documentation and requirements
- [ ] Identify affected components and dependencies
- [ ] Check for breaking changes and compatibility

## Environment Setup
- [ ] Ensure development environment is up to date
- [ ] Verify all dependencies are installed
- [ ] Check build and test processes
- [ ] Validate code formatting and linting rules

## Review Strategy
- [ ] Determine appropriate review depth
- [ ] Select relevant review agents and criteria
- [ ] Plan review sequence and priorities
- [ ] Prepare review templates and checklists

## Quality Gates
- [ ] Confirm all tests pass
- [ ] Verify build process succeeds
- [ ] Check code coverage requirements
- [ ] Validate documentation completeness
```

### 2. Security Review Checklist

```markdown
# Security Review Checklist

## Authentication & Authorization
- [ ] OAuth 2.1 compliance verified
- [ ] PKCE flow implemented correctly
- [ ] Token validation and refresh logic
- [ ] Role-based access control implemented
- [ ] Tenant context isolation verified

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Data encrypted in transit (TLS 1.3)
- [ ] Proper key management implemented
- [ ] Data minimization principles followed
- [ ] Right to be forgotten mechanisms

## Input Validation & Output Encoding
- [ ] All user inputs validated and sanitized
- [ ] SQL injection prevention measures
- [ ] XSS prevention implemented
- [ ] CSRF protection in place
- [ ] File upload security validated

## Error Handling & Logging
- [ ] No sensitive information in error messages
- [ ] Comprehensive audit logging implemented
- [ ] Security events logged and monitored
- [ ] Rate limiting implemented
- [ ] Brute force protection active

## Infrastructure Security
- [ ] Security headers configured
- [ ] Content Security Policy implemented
- [ ] Dependency vulnerability scanning
- [ ] Network security measures in place
- [ ] Backup and recovery procedures

## Compliance
- [ ] GDPR/CCPA compliance verified
- [ ] Data retention policies implemented
- [ ] Consent management system
- [ ] Privacy policy compliance
- [ ] Regulatory requirements met
```

### 3. Performance Review Checklist

```markdown
# Performance Review Checklist

## Core Web Vitals
- [ ] LCP < 2.5 seconds measured
- [ ] INP < 200 milliseconds measured
- [ ] CLS < 0.1 measured
- [ ] Performance budgets defined
- [ ] Performance monitoring implemented

## Bundle Optimization
- [ ] Bundle size < 250KB gzipped
- [ ] Code splitting implemented
- [ ] Tree shaking effective
- [ ] Dead code elimination
- [ ] Dynamic imports for heavy components

## Database Performance
- [ ] Query execution time < 100ms
- [ ] Proper indexing strategy
- [ ] Connection pooling optimized
- [ ] N+1 query problems resolved
- [ ] Database caching implemented

## API Performance
- [ ] Response time < 200ms
- [ ] Proper HTTP caching headers
- [ ] API rate limiting implemented
- [ ] Pagination for large datasets
- [ ] Compression enabled

## Asset Optimization
- [ ] Images optimized and compressed
- [ ] WebP format support
- [ ] Font loading optimization
- [ ] CDN utilization
- [ ] Lazy loading for images

## Caching Strategy
- [ ] Browser caching configured
- [ ] CDN caching implemented
- [ ] Application-level caching
- [ ] Database query caching
- [ ] Cache invalidation strategy
```

### 4. Architecture Review Checklist

```markdown
# Architecture Review Checklist

## Feature-Sliced Design
- [ ] Proper layer isolation (app → pages → widgets → features → entities → shared)
- [ ] Unidirectional dependencies maintained
- [ ] @x notation used for cross-slice imports
- [ ] Clear slice boundaries defined
- [ ] Public API properly exported

## Multi-Tenant Architecture
- [ ] Tenant data isolation implemented
- [ ] Tenant context propagation
- [ ] Scalable tenant management
- [ ] Tenant-specific configurations
- [ ] Resource allocation per tenant

## Design Patterns
- [ ] Repository pattern for data access
- [ ] Service layer for business logic
- [ ] Dependency injection implemented
- [ ] Factory patterns for object creation
- [ ] Observer patterns for events

## Error Handling
- [ ] Consistent error handling strategy
- [ ] Proper error categorization
- [ ] User-friendly error messages
- [ ] Error logging and monitoring
- [ ] Graceful degradation

## Testing Architecture
- [ ] Unit test coverage > 80%
- [ ] Integration test strategy
- [ ] E2E test implementation
- [ ] Test data management
- [ ] Mock strategies defined

## Documentation
- [ ] Architecture documentation current
- [ ] API documentation complete
- [ ] Code comments adequate
- [ ] Decision records maintained
- [ ] Onboarding guides available
```

## Review Scoring Matrix

### 1. Issue Severity Scoring

| Severity | Score | Impact | Timeline |
|----------|-------|--------|----------|
| Critical | 10 | Blocks release/production | Immediate |
| High | 7 | Significant impact on quality/security | 1-2 days |
| Medium | 4 | Moderate impact on maintainability | 1 week |
| Low | 2 | Minor improvements | 2 weeks |

### 2. Quality Metrics Scoring

| Metric | Excellent (9-10) | Good (7-8) | Fair (5-6) | Poor (1-4) |
|--------|------------------|------------|-----------|------------|
| Security | No critical issues | No high issues | 1-2 high issues | >2 high issues |
| Performance | All targets met | Minor deviations | Some issues | Major issues |
| Architecture | Excellent patterns | Minor improvements needed | Some refactoring needed | Major redesign needed |
| Code Quality | >95% coverage | >80% coverage | >60% coverage | <60% coverage |

### 3. Overall Review Score

```typescript
interface ReviewScore {
  security: number;      // 0-10
  performance: number;   // 0-10
  architecture: number;  // 0-10
  codeQuality: number;   // 0-10
  documentation: number; // 0-10
  
  overall: number;       // Weighted average
  status: 'approved' | 'needs-work' | 'rejected';
}

function calculateReviewScore(issues: ReviewIssue[]): ReviewScore {
  const weights = {
    security: 0.3,
    performance: 0.25,
    architecture: 0.2,
    codeQuality: 0.15,
    documentation: 0.1
  };
  
  // Calculate individual scores
  const scores = {
    security: calculateSecurityScore(issues),
    performance: calculatePerformanceScore(issues),
    architecture: calculateArchitectureScore(issues),
    codeQuality: calculateCodeQualityScore(issues),
    documentation: calculateDocumentationScore(issues)
  };
  
  // Calculate weighted average
  const overall = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (scores[key] * weight);
  }, 0);
  
  // Determine status
  let status: ReviewScore['status'];
  if (overall >= 8) status = 'approved';
  else if (overall >= 6) status = 'needs-work';
  else status = 'rejected';
  
  return {
    ...scores,
    overall,
    status
  };
}
```

## Review Automation Templates

### 1. Automated Review Trigger

```yaml
# .github/workflows/automated-review.yml
name: Automated Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Security Review
        run: pnpm run review:security
  
  performance-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Performance Review
        run: pnpm run review:performance
  
  architecture-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Architecture Review
        run: pnpm run review:architecture
```

### 2. Review Comment Template

```markdown
## 🤖 Automated Code Review Results

### 🔒 Security Review
- **Score**: {{ security_score }}/10
- **Critical Issues**: {{ security_critical }}
- **High Issues**: {{ security_high }}

### ⚡ Performance Review  
- **Score**: {{ performance_score }}/10
- **Bundle Size**: {{ bundle_size }}KB
- **LCP**: {{ lcp }}ms

### 🏗️ Architecture Review
- **Score**: {{ architecture_score }}/10
- **FSD Compliance**: {{ fsd_compliance }}
- **Issues Found**: {{ architecture_issues }}

### 📝 Code Quality Review
- **Score**: {{ code_quality_score }}/10
- **Test Coverage**: {{ test_coverage }}%
- **Lint Issues**: {{ lint_issues }}

## 📊 Overall Assessment
**Total Score**: {{ overall_score }}/10
**Status**: {{ review_status }}

### 🔧 Recommended Actions
{{#each recommendations}}
- [ ] {{ this }}
{{/each}}

### 📋 Detailed Report
[View full review report]({{ report_url }})
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
