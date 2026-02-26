---
name: review-checklists
description: |
  **ASSET CHECKLIST** - Comprehensive code review checklists for different review types.
  USE FOR: Systematic review coverage, quality assurance, and review standardization.
  DO NOT USE FOR: Direct execution - checklist reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "checklist"
---

# Code Review Checklists

## Overview
This document provides comprehensive checklists for different types of code reviews to ensure systematic coverage and consistent quality standards.

## Quick Reference Checklists

### 1. 5-Minute Security Checklist

```markdown
## 🔒 Quick Security Review (5 minutes)

### Critical Checks
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All database queries include tenant_id filter
- [ ] Input validation on all user inputs
- [ ] Proper error handling (no stack traces to users)

### High Priority Checks  
- [ ] Authentication required for protected endpoints
- [ ] Authorization checks implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)

### Result
- [ ] **PASS** - No critical security issues
- [ ] **FAIL** - Critical issues found, block merge
- [ ] **REVIEW** - Issues found, require detailed review
```

### 2. 5-Minute Performance Checklist

```markdown
## ⚡ Quick Performance Review (5 minutes)

### Critical Checks
- [ ] Bundle size under 250KB gzipped
- [ ] No synchronous file operations
- [ ] Database queries optimized (indexes, no N+1)
- [ ] Images properly sized and compressed

### High Priority Checks
- [ ] Code splitting implemented for large components
- [ ] Lazy loading for heavy resources
- [ ] Proper caching headers set
- [ ] No memory leaks in event listeners

### Result
- [ ] **PASS** - Performance acceptable
- [ ] **WARN** - Minor performance issues
- [ ] **FAIL** - Major performance problems
```

### 3. 5-Minute Architecture Checklist

```markdown
## 🏗️ Quick Architecture Review (5 minutes)

### Critical Checks
- [ ] FSD layer boundaries respected
- [ ] No circular dependencies
- [ ] Proper import directions (app → pages → widgets → features → entities → shared)
- [ ] Tenant isolation maintained

### High Priority Checks
- [ ] Single Responsibility Principle followed
- [ ] Proper abstraction layers
- [ ] Consistent error handling patterns
- [ ] Repository pattern for data access

### Result
- [ ] **PASS** - Architecture sound
- [ ] **REVIEW** - Minor architectural concerns
- [ ] **FAIL** - Major architectural violations
```

## Comprehensive Checklists

### 1. Complete Security Review Checklist

```markdown
## 🔒 Complete Security Review Checklist

### Authentication & Authorization
#### OAuth 2.1 Implementation
- [ ] PKCE (Proof Key for Code Exchange) implemented
- [ ] Authorization code flow used (not implicit)
- [ ] State parameter for CSRF protection
- [ ] Token refresh mechanism implemented
- [ ] Proper token validation and expiration

#### Multi-Tenant Security
- [ ] Tenant context extracted from verified JWT
- [ ] All database queries include tenant_id filter
- [ ] Tenant data isolation verified
- [ ] Cross-tenant data access prevention
- [ ] Tenant-specific rate limiting

#### Access Control
- [ ] Role-based access control (RBAC) implemented
- [ ] Principle of least privilege followed
- [ ] Resource-level permissions checked
- [ ] API endpoint protection verified
- [ ] Administrative access properly restricted

### Data Protection
#### Encryption
- [ ] Data encrypted at rest (AES-256)
- [ ] Data encrypted in transit (TLS 1.3)
- [ ] Key management system implemented
- [ ] Certificate rotation procedures
- [ ] Sensitive environment variables encrypted

#### Data Handling
- [ ] Personal data minimization practiced
- [ ] Data retention policies implemented
- [ ] Right to be forgotten mechanisms
- [ ] Data anonymization for analytics
- [ ] Secure data backup and recovery

#### GDPR/CCPA Compliance
- [ ] Consent management system
- [ ] Privacy policy compliance
- [ ] Data breach notification procedures
- [ ] User data export functionality
- [ ] Cookie consent management

### Input Validation & Output Encoding
#### Input Validation
- [ ] All user inputs validated server-side
- [ ] Type validation with Zod schemas
- [ ] Length limits enforced
- [ ] Format validation (email, phone, URL)
- [ ] File upload restrictions (type, size)

#### Output Encoding
- [ ] HTML output encoded (XSS prevention)
- [ ] JSON responses properly sanitized
- [ ] URL encoding for parameters
- [ ] CSS encoding for dynamic styles
- [ ] JavaScript encoding for dynamic scripts

#### Injection Prevention
- [ ] SQL injection prevention (parameterized queries)
- [ ] NoSQL injection prevention
- [ ] Command injection prevention
- [ ] LDAP injection prevention
- [ ] XML injection prevention

### Error Handling & Logging
#### Secure Error Handling
- [ ] No sensitive information in error messages
- [ ] Generic error messages for users
- [ ] Detailed errors logged securely
- [ ] Error correlation IDs implemented
- [ ] Graceful degradation for failures

#### Logging & Monitoring
- [ ] Comprehensive audit logging
- [ ] Security events logged and monitored
- [ ] Failed authentication attempts tracked
- [ ] Data access logging
- [ ] Suspicious activity alerts

#### Rate Limiting & Abuse Prevention
- [ ] API rate limiting implemented
- [ ] Brute force protection active
- [ ] CAPTCHA for sensitive operations
- [ ] IP-based blocking for abuse
- [ ] Account lockout mechanisms

### Infrastructure Security
#### Network Security
- [ ] Firewall rules configured
- [ ] DDoS protection implemented
- [ ] VPN access for admin functions
- [ ] Network segmentation
- [ ] Intrusion detection system

#### Application Security
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] Content Security Policy implemented
- [ ] Cross-Origin Resource Sharing (CORS) properly configured
- [ ] Subresource Integrity (SRI) for external resources
- [ ] HTTP-only cookies for session tokens

#### Dependency Security
- [ ] Dependency vulnerability scanning
- [ ] Software Bill of Materials (SBOM)
- [ ] Third-party library vetting
- [ ] Supply chain security
- [ ] Automated security updates

### Testing & Validation
#### Security Testing
- [ ] Penetration testing completed
- [ ] Security unit tests implemented
- [ ] Integration security tests
- [ ] Static application security testing (SAST)
- [ ] Dynamic application security testing (DAST)

#### Compliance Testing
- [ ] GDPR compliance testing
- [ ] SOC 2 compliance validation
- [ ] Industry-specific compliance checks
- [ ] Accessibility security testing
- [ ] Performance security testing

### Documentation & Training
#### Security Documentation
- [ ] Security architecture documented
- [ ] Incident response procedures
- [ ] Security best practices guide
- [ ] Configuration security guide
- [ ] Security contact information

#### Team Training
- [ ] Security awareness training
- [ ] Secure coding practices
- [ ] Incident response drills
- [ ] Phishing awareness
- [ ] Data handling procedures
```

### 2. Complete Performance Review Checklist

```markdown
## ⚡ Complete Performance Review Checklist

### Core Web Vitals Optimization
#### Largest Contentful Paint (LCP)
- [ ] Critical resources preloaded
- [ ] Images optimized and compressed
- [ ] WebP format with fallbacks
- [ ] Proper image sizing and aspect ratios
- [ ] Server response time < 600ms

#### Interaction to Next Paint (INP)
- [ ] JavaScript execution optimized
- [ ] Long tasks broken up
- [ ] Event listeners optimized
- [ ] Third-party script optimization
- [ ] Main thread work minimized

#### Cumulative Layout Shift (CLS)
- [ ] Dimensions explicitly set for images and videos
- [ ] Space reserved for dynamic content
- [ ] Font loading optimization (font-display: swap)
- [ ] No insertions above existing content
- [ ] Transform animations instead of layout changes

### Bundle Size Optimization
#### Code Analysis
- [ ] Bundle analysis completed
- [ ] Tree shaking effective
- [ ] Dead code elimination
- [ ] Duplicate dependency removal
- [ ] Moment.js replaced with date-fns/luxon

#### Code Splitting
- [ ] Route-based code splitting
- [ ] Component-level lazy loading
- [ ] Vendor chunk separation
- [ ] Dynamic imports implemented
- [ ] Preloading for critical chunks

#### Asset Optimization
- [ ] Images compressed and optimized
- [ ] SVG optimization
- [ ] Font subsetting
- [ ] CSS minification
- [ ] JavaScript minification and compression

### Database Performance
#### Query Optimization
- [ ] Query execution time < 100ms
- [ ] Proper indexing strategy
- [ ] Query plans analyzed
- [ ] N+1 query problems resolved
- [ ] Pagination for large datasets

#### Connection Management
- [ ] Connection pooling configured
- [ ] Connection limits appropriate
- [ ] Connection timeout settings
- [ ] Database connection monitoring
- [ ] Failover mechanisms

#### Caching Strategy
- [ ] Query result caching
- [ ] Application-level caching
- [ ] Database query caching
- [ ] Cache invalidation strategy
- [ ] Cache hit ratio monitoring

### API Performance
#### Response Optimization
- [ ] API response time < 200ms
- [ ] Response compression enabled
- [ ] JSON response optimization
- [ ] Field selection implemented
- [ ] Response size monitoring

#### Caching Implementation
- [ ] HTTP caching headers configured
- [ ] CDN caching implemented
- [ ] Edge caching strategies
- [ ] Cache warming procedures
- [ ] Cache invalidation automation

#### Rate Limiting & Throttling
- [ ] API rate limiting implemented
- [ ] Throttling for expensive operations
- [ ] Priority queues for requests
- [ ] Load balancing configured
- [ ] Circuit breaker patterns

### Frontend Performance
#### Rendering Optimization
- [ ] Server-side rendering (SSR) where appropriate
- [ ] Static site generation (SSG) for content
- [ ] Incremental Static Regeneration (ISR)
- [ ] Client-side rendering optimization
- [ ] Hydration strategies

#### Resource Loading
- [ ] Critical CSS inlined
- [ ] Non-critical CSS loaded asynchronously
- [ ] JavaScript loading optimized
- [ ] Font loading strategies
- [ ] Image lazy loading

#### User Experience
- [ ] Loading states implemented
- [ ] Skeleton screens for content
- [ ] Progressive enhancement
- [ ] Graceful degradation
- [ ] Offline functionality

### Monitoring & Analytics
#### Performance Monitoring
- [ ] Real User Monitoring (RUM)
- [ ] Synthetic monitoring
- [ ] Core Web Vitals tracking
- [ ] Performance budgets defined
- [ ] Performance regression detection

#### Analytics & Insights
- [ ] User behavior analysis
- [ ] Conversion impact measurement
- [ ] Performance ROI tracking
- [ ] A/B testing for performance
- [ ] Performance benchmarking

### Infrastructure Performance
#### Server Optimization
- [ ] Server response time optimization
- [ ] Load balancing configured
- [ ] Auto-scaling implemented
- [ ] Geographic distribution
- [ ] Edge computing utilization

#### Network Optimization
- [ ] CDN utilization
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Network latency optimization
- [ ] DNS optimization
- [ ] TCP connection optimization

#### Container & Deployment
- [ ] Container image optimization
- [ ] Deployment strategies (blue-green, canary)
- [ ] Health checks implemented
- [ ] Resource limits configured
- [ ] Monitoring and alerting
```

### 3. Complete Architecture Review Checklist

```markdown
## 🏗️ Complete Architecture Review Checklist

### Feature-Sliced Design (FSD) Compliance
#### Layer Structure
- [ ] Proper layer hierarchy: app → pages → widgets → features → entities → shared
- [ ] Each layer has clear responsibility
- [ ] No business logic in app layer
- [ ] No UI components in entities layer
- [ ] Shared layer contains only utilities

#### Import Rules
- [ ] Unidirectional dependencies maintained
- [ ] Lower layers can import higher layers
- [ ] Higher layers cannot import lower layers
- [ ] Cross-slice imports use @x notation
- [ ] No circular dependencies

#### Slice Organization
- [ ] Clear slice boundaries defined
- [ ] Each slice is self-contained
- [ ] Public API properly exported
- [ ] Private implementation hidden
- [ ] Slice composition in pages layer

### Multi-Tenant Architecture
#### Tenant Isolation
- [ ] Data isolation at database level
- [ ] Tenant context propagation
- [ ] Row Level Security (RLS) policies
- [ ] Tenant-specific configurations
- [ ] Cross-tenant data access prevention

#### Scalability Patterns
- [ ] Horizontal scaling support
- [ ] Tenant resource allocation
- [ ] Load balancing per tenant
- [ ] Database sharding strategy
- [ ] Cache distribution

#### Tenant Management
- [ ] Tenant provisioning workflow
- [ ] Tenant configuration management
- [ ] Tenant upgrade/downgrade
- [ ] Tenant data migration
- [ ] Tenant deletion procedures

### Design Patterns Implementation
#### Data Access Patterns
- [ ] Repository pattern implemented
- [ ] Unit of Work pattern
- [ ] Data Transfer Objects (DTOs)
- [ ] Query Object pattern
- [ ] Specification pattern

#### Business Logic Patterns
- [ ] Service layer architecture
- [ ] Domain services
- [ ] Application services
- [ ] Command Query Responsibility Segregation (CQRS)
- [ ] Event sourcing where appropriate

#### Integration Patterns
- [ ] Dependency injection container
- [ ] Factory patterns for object creation
- [ ] Strategy patterns for algorithms
- [ ] Observer patterns for events
- [ ] Adapter patterns for integrations

### System Architecture
#### Microservices Architecture
- [ ] Service boundaries clearly defined
- [ ] Inter-service communication patterns
- [ ] Service discovery mechanisms
- [ ] API gateway implementation
- [ ] Service mesh configuration

#### Event-Driven Architecture
- [ ] Event bus implementation
- [ ] Message queue configuration
- [ ] Event sourcing patterns
- [ ] CQRS implementation
- [ ] Eventual consistency handling

#### API Architecture
- [ ] RESTful API design principles
- [ ] GraphQL implementation (if used)
- [ ] API versioning strategy
- [ ] Documentation generation
- [ ] API testing strategies

### Database Architecture
#### Schema Design
- [ ] Normalization principles followed
- [ ] Proper relationships defined
- [ ] Indexing strategy optimized
- [ ] Constraint implementation
- [ ] Data migration strategy

#### Performance Optimization
- [ ] Query optimization
- [ ] Index usage analysis
- [ ] Connection pooling
- [ ] Read replicas configuration
- [ ] Caching strategies

#### Data Consistency
- [ ] Transaction management
- [ ] Distributed transactions
- [ ] Eventual consistency
- [ ] Data synchronization
- [ ] Conflict resolution

### Security Architecture
#### Authentication & Authorization
- [ ] Centralized authentication
- [ ] OAuth 2.1 implementation
- [ ] JWT token management
- [ ] Role-based access control
- [ ] API key management

#### Data Protection
- [ ] Encryption at rest
- [ ] Encryption in transit
- [ ] Key management
- [ ] Data masking
- [ ] Audit logging

#### Infrastructure Security
- [ ] Network security
- [ ] Container security
- [ ] Cloud security
- [ ] Secrets management
- [ ] Compliance monitoring

### Testing Architecture
#### Test Strategy
- [ ] Test pyramid implemented
- [ ] Unit test coverage > 80%
- [ ] Integration test strategy
- [ ] End-to-end test automation
- [ ] Performance testing

#### Test Organization
- [ ] Test data management
- [ ] Mock strategies
- [ ] Test environment setup
- [ ] Continuous testing
- [ ] Test reporting

#### Quality Assurance
- [ ] Code review processes
- [ ] Static analysis tools
- [ ] Security scanning
- [ ] Dependency checking
- [ ] Compliance validation

### DevOps Architecture
#### CI/CD Pipeline
- [ ] Automated build process
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Environment promotion
- [ ] Rollback procedures

#### Infrastructure as Code
- [ ] Terraform/Pulumi implementation
- [ ] Configuration management
- [ ] Infrastructure provisioning
- [ ] Environment consistency
- [ ] Cost optimization

#### Monitoring & Observability
- [ ] Application monitoring
- [ ] Infrastructure monitoring
- [ ] Log aggregation
- [ ] Distributed tracing
- [ ] Alert management

### Documentation Architecture
#### Technical Documentation
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Database documentation
- [ ] Deployment guides
- [ ] Troubleshooting guides

#### Development Documentation
- [ ] Getting started guides
- [ ] Coding standards
- [ ] Contribution guidelines
- [ ] Design decision records
- [ ] Onboarding materials

#### Business Documentation
- [ ] User guides
- [ ] Feature documentation
- [ ] Integration guides
- [ ] Compliance documentation
- [ ] Support procedures
```

## Review Process Templates

### 1. PR Review Template

```markdown
## 📋 Pull Request Review Template

### Overview
- **PR Title**: [Clear, descriptive title]
- **Description**: [What changes are being made]
- **Type**: [feature/bugfix/hotfix/documentation/refactor]
- **Breaking Changes**: [yes/no with details]

### Review Checklist

#### 🔒 Security Review
- [ ] No hardcoded secrets or credentials
- [ ] All database queries include tenant_id
- [ ] Input validation implemented
- [ ] Authentication/authorization verified

#### ⚡ Performance Review
- [ ] Bundle size impact assessed
- [ ] Database queries optimized
- [ ] No performance regressions
- [ ] Core Web Vitals considered

#### 🏗️ Architecture Review
- [ ] FSD compliance verified
- [ ] No circular dependencies
- [ ] Proper layer separation
- [ ] Design patterns followed

#### 🧪 Testing Review
- [ ] Tests added for new functionality
- [ ] Test coverage maintained/improved
- [ ] Integration tests updated
- [ ] E2E tests considered

#### 📚 Documentation Review
- [ ] Code comments added where needed
- [ ] README updated if required
- [ ] API documentation updated
- [ ] Change log updated

### Review Results
- **Security**: [PASS/FAIL/NEEDS_REVIEW]
- **Performance**: [PASS/FAIL/NEEDS_REVIEW]
- **Architecture**: [PASS/FAIL/NEEDS_REVIEW]
- **Testing**: [PASS/FAIL/NEEDS_REVIEW]
- **Documentation**: [PASS/FAIL/NEEDS_REVIEW]

### Overall Decision
- [ ] **APPROVED** - Ready to merge
- [ ] **REQUESTED_CHANGES** - Issues to address
- [ ] **NEEDS_REVIEW** - Requires detailed review
```

### 2. Issue Triage Template

```markdown
## 🎯 Issue Triage Template

### Issue Information
- **Issue ID**: [Number]
- **Title**: [Clear, descriptive title]
- **Reporter**: [Who reported it]
- **Priority**: [Critical/High/Medium/Low]
- **Type**: [Bug/Feature/Enhancement/Documentation]

### Triage Checklist

#### Initial Assessment
- [ ] Issue title is clear and descriptive
- [ ] Issue description is complete
- [ ] Steps to reproduce provided
- [ ] Expected vs actual behavior clear
- [ ] Environment details included

#### Impact Analysis
- [ ] Number of users affected
- [ ] Business impact assessed
- [ ] Security implications considered
- [ ] Performance impact evaluated
- [ ] Technical debt implications

#### Triage Decision
- [ ] **BUG** - Confirmed bug, assign to development
- [ ] **FEATURE** - New feature request, add to backlog
- [ ] **ENHANCEMENT** - Improvement, consider for next sprint
- [ ] **DOCUMENTATION** - Docs issue, assign to technical writer
- [ ] **INVALID** - Not a valid issue, close with explanation

#### Assignment
- [ ] **OWNER**: [Primary assignee]
- [ ] **REVIEWERS**: [Code reviewers needed]
- [ ] **STAKEHOLDERS**: [People to keep informed]
- [ ] **DEPENDENCIES**: [Blocking issues]
- [ ] **TIMELINE**: [Expected resolution time]

### Follow-up Actions
- [ ] Create development branch
- [ ] Add to appropriate sprint
- [ ] Set up automated testing
- [ ] Schedule review meeting
- [ ] Update project documentation
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
