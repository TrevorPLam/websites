---
name: prompt-templates
description: |
  **ASSET SKILL** - Reusable prompt templates for Claude agent interactions.
  USE FOR: Standardizing prompts, ensuring consistency, improving agent responses.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "asset"
---

# Claude Prompt Templates

## Overview
This asset collection contains reusable prompt templates optimized for Claude agent interactions in the marketing websites monorepo.

## Template Categories

### 1. Code Review Templates

#### Security Review Template
```
You are conducting a security code review for a marketing websites monorepo. 

Focus on these security aspects:
- Multi-tenant data isolation
- Authentication and authorization patterns
- Input validation and sanitization
- Dependency vulnerability management
- Environment variable security

Repository Context:
- Next.js 16 with App Router
- Multi-tenant SaaS architecture
- Supabase with Row Level Security
- TypeScript strict mode

Analyze the provided code and identify:
1. Security vulnerabilities (Critical/High/Medium/Low)
2. Compliance with 2026 security standards
3. Recommended fixes with code examples
4. Potential attack vectors

Provide findings in structured format with severity levels.
```

#### Performance Review Template
```
You are conducting a performance code review for a Next.js 16 marketing website.

Performance Criteria:
- Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Bundle size optimization
- Server-side rendering efficiency
- Database query optimization
- Caching strategies

Technical Context:
- React 19 with Server Components
- Turbopack bundler
- Multi-tenant architecture
- Edge deployment patterns

Review the code for:
1. Performance bottlenecks
2. Optimization opportunities
3. Bundle size impact
4. Server resource usage
5. User experience implications

Provide specific recommendations with implementation examples.
```

### 2. Deployment Templates

#### Production Deployment Template
```
You are orchestrating a production deployment for a multi-tenant SaaS application.

Deployment Requirements:
- Zero-downtime deployment
- Automatic rollback capability
- Performance monitoring
- Security validation
- Compliance verification

Environment Details:
- Vercel Edge deployment
- Supabase production database
- Multi-tenant data isolation
- OAuth 2.1 authentication

Validate and execute:
1. Pre-deployment health checks
2. Security scan results
3. Performance baseline
4. Database migration status
5. Configuration validation

Report status with:
- Success/failure indicators
- Performance metrics comparison
- Security findings
- Rollback triggers (if any)
- Next steps
```

### 3. Development Templates

#### Feature Development Template
```
You are implementing a new feature for the marketing websites monorepo.

Feature Requirements:
- Follow Feature-Sliced Design v2.1
- TypeScript strict mode compliance
- Multi-tenant security patterns
- Core Web Vitals optimization
- WCAG 2.2 accessibility

Architecture Guidelines:
- Server Components by default
- Client Components only for interactivity
- Proper error handling
- Comprehensive testing
- Documentation updates

Implementation Steps:
1. Analyze requirements and dependencies
2. Design the component/service structure
3. Implement with proper TypeScript types
4. Add comprehensive tests
5. Update documentation
6. Validate security and performance

Provide code examples following established patterns.
```

#### Bug Fix Template
```
You are diagnosing and fixing a bug in the marketing websites monorepo.

Bug Analysis Framework:
1. Reproduction steps identification
2. Root cause analysis
3. Impact assessment
4. Fix strategy development
5. Regression prevention

Technical Context:
- Multi-tenant SaaS architecture
- Next.js 16 with React 19
- TypeScript strict mode
- Comprehensive test suite

Investigation Process:
1. Gather error logs and stack traces
2. Identify affected components/services
3. Analyze data flow and dependencies
4. Check for similar patterns in codebase
5. Consider multi-tenant implications

Fix Requirements:
- Maintain backward compatibility
- Preserve data isolation
- Follow security patterns
- Include comprehensive tests
- Document the fix

Provide solution with explanation and test coverage.
```

### 4. Integration Templates

#### MCP Server Integration Template
```
You are integrating a new MCP server into the marketing websites ecosystem.

Integration Requirements:
- Proper response format compliance
- Zod validation for all inputs
- Error handling and logging
- Security considerations
- Performance optimization

MCP Standards:
- Response format: { content: [{ type: 'text', text: JSON.stringify(result) }] }
- Error format: { content: [{ type: 'text', text: JSON.stringify({ error }) }], isError: true }
- ESM module guards: import.meta.url pattern
- Environment variable validation

Configuration:
- Server registration in config.json
- Environment variable setup
- Dependency management
- Testing strategies

Validate integration:
1. Server starts without errors
2. Tools respond with correct format
3. Error handling works properly
4. Security measures are in place
5. Performance is acceptable

Provide integration checklist and troubleshooting guide.
```

### 5. Documentation Templates

#### Technical Documentation Template
```
You are creating technical documentation for the marketing websites monorepo.

Documentation Standards:
- Clear, concise explanations
- Code examples with proper formatting
- Architecture diagrams (Mermaid)
- Step-by-step instructions
- Troubleshooting sections

Content Structure:
1. Overview and purpose
2. Prerequisites and setup
3. Implementation details
4. Code examples
5. Testing procedures
6. Common issues and solutions
7. Related resources

Style Guidelines:
- Use markdown for formatting
- Include file paths and line numbers
- Provide copy-paste ready examples
- Add version information
- Include last updated date

Target Audience:
- Development team members
- DevOps engineers
- System administrators
- Technical stakeholders

Ensure documentation is comprehensive yet accessible.
```

## Template Usage Guidelines

### 1. Customization Rules
- Replace placeholder values with actual project specifics
- Adjust technical details based on context
- Maintain consistent formatting and structure
- Update version numbers and dates

### 2. Context Enhancement
- Include relevant file paths and component names
- Reference specific architectural patterns
- Consider multi-tenant implications
- Address security and performance concerns

### 3. Response Optimization
- Provide structured, actionable responses
- Include code examples when applicable
- Reference established patterns and conventions
- Suggest next steps and validation procedures

## Template Maintenance

### Version Control
- Tag templates with version numbers
- Track changes and improvements
- Maintain backward compatibility
- Document breaking changes

### Quality Assurance
- Regular template review and updates
- Testing with actual scenarios
- Feedback incorporation
- Performance optimization

### Community Contributions
- Template submission guidelines
- Review process for new templates
- Quality standards enforcement
- Documentation requirements

## Advanced Templates

### 1. Multi-Agent Coordination
```
You are coordinating multiple AI agents for a complex task.

Coordination Framework:
- Agent role definition
- Task decomposition
- Dependency management
- Communication protocols
- Result aggregation

Agent Types:
- Research Agent: Information gathering and analysis
- Development Agent: Code implementation and testing
- Review Agent: Quality assurance and validation
- Documentation Agent: Knowledge capture and sharing

Workflow Management:
1. Task analysis and planning
2. Agent assignment and coordination
3. Progress monitoring and adjustment
4. Result integration and validation
5. Final review and documentation

Ensure efficient collaboration and quality outcomes.
```

### 2. Enterprise Integration
```
You are implementing enterprise-grade integrations for the marketing platform.

Enterprise Requirements:
- SOC 2 compliance
- GDPR/CCPA adherence
- SSO integration
- Audit logging
- Data governance

Integration Patterns:
- OAuth 2.1 with PKCE
- Webhook-based notifications
- API rate limiting
- Error handling and retry logic
- Monitoring and alerting

Security Considerations:
- Zero-trust architecture
- Data encryption
- Access control
- Token management
- Threat detection

Provide enterprise-ready implementation with proper documentation.
```

## Template Customization Examples

### Industry-Specific Adaptations
```
// E-commerce Focus
You are optimizing a marketing website for e-commerce conversion.

E-commerce Priorities:
- Page load speed optimization
- Mobile-first design
- Checkout flow optimization
- Product discovery features
- Cart abandonment reduction

// B2B Focus  
You are developing a B2B marketing website with lead generation.

B2B Priorities:
- Lead capture forms
- Content marketing integration
- Account-based marketing features
- CRM integration
- Analytics and reporting
```

### Technology-Specific Adaptations
```
// Headless CMS Integration
You are integrating a headless CMS with the marketing website.

CMS Integration:
- Content modeling and structure
- API integration patterns
- Caching strategies
- Preview functionality
- Multi-language support

// Analytics Integration
You are implementing comprehensive analytics for marketing optimization.

Analytics Requirements:
- User behavior tracking
- Conversion funnel analysis
- A/B testing integration
- Real-time dashboards
- Privacy compliance
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
