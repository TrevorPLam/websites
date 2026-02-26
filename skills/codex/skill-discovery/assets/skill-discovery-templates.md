---
name: skill-discovery-templates
description: |
  **ASSET TEMPLATE** - Skill discovery templates and patterns for Codex agents.
  USE FOR: Standardizing skill discovery processes, ensuring comprehensive coverage.
  DO NOT USE FOR: Direct execution - template reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "template"
---

# Skill Discovery Templates and Patterns

## Overview
This document provides standardized templates and patterns for Codex skill discovery agents to ensure consistent, comprehensive, and effective skill discovery processes.

## Skill Templates

### 1. Workflow Skill Template

```markdown
---
name: workflow-template
description: |
  **WORKFLOW SKILL TEMPLATE** - Template for creating workflow-based skills.
  USE FOR: Multi-step processes, automation workflows.
  DO NOT USE FOR: Simple single-action tasks.
  INVOKES: [list-mcp-servers-needed].
meta:
  version: '1.0.0'
  author: 'your-name'
  category: 'workflow'
---

# [Skill Name] Workflow

## Overview

This Skill orchestrates [brief description of the workflow].

## Prerequisites

- [List prerequisites]
- [Required tools/credentials]
- [Environment setup]

## Workflow Steps

### 1. [Step Name]

**Action:** [Description of the action]

**Validation:** [What to validate before proceeding]

** MCP Server:** [Which MCP server to use]

**Expected Output:** [What should be the result]

### 2. [Step Name]

**Action:** [Description of the action]

**Validation:** [What to validate before proceeding]

** MCP Server:** [Which MCP server to use]

**Expected Output:** [What should be the result]

### 3. [Additional Steps...]

[Continue with additional steps as needed]

## Error Handling

- [Common error scenarios]
- [Recovery strategies]
- [Fallback options]

## Success Criteria

- [What constitutes success]
- [Validation checkpoints]
- [Final verification steps]

## Environment Variables

```bash
# Required
SKILL_ENV_VAR=value

# Optional
OPTIONAL_VAR=default_value
```

## Usage Examples

```bash
# Basic usage
skill invoke [skill-name] --param=value

# Advanced usage
skill invoke [skill-name] --param=value --option=advanced
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| [Common issue] | [Solution] |
| [Another issue] | [Solution] |

## Related Skills

- [Related skill 1]
- [Related skill 2]

## References

- [Relevant documentation]
- [API references]
- [External resources]
```

### 2. Reference Skill Template

```markdown
---
name: reference-template
description: |
  **REFERENCE SKILL** - Reference material and documentation.
  USE FOR: Understanding concepts, best practices, and guidance.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "your-name"
  category: "reference"
---

# [Reference Title]

## Overview

This document provides [brief description of the reference content].

## Content Structure

### [Section 1]

[Content for section 1]

### [Section 2]

[Content for section 2]

### [Section 3]

[Content for section 3]

## Usage Guidelines

### When to Use

- [Use case 1]
- [Use case 2]
- [Use case 3]

### When Not to Use

- [Avoid case 1]
- [Avoid case 2]
- [Avoid case 3]

## Best Practices

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

## Examples

### Example 1

[Example 1 description]

```typescript
// Example 1 code
```

### Example 2

[Example 2 description]

```typescript
// Example 2 code
```

## References

- [Reference 1]
- [Reference 2]
- [Reference 3]
```

### 3. Scripting Skill Template

```markdown
---
name: scripting-template
description: |
  **SCRIPTING SKILL** - Automation scripts and executable code.
  USE FOR: Code generation, automated tasks, system administration.
  DO NOT USE FOR: Manual processes - use automation patterns.
  INVOKES: [list-mcp-servers-needed].
meta:
  version: '1.0.0'
  author: 'your-name'
  category: 'scripting'
---

# [Script Name]

## Overview

This script automates [brief description of what the script does].

## Prerequisites

- [System requirements]
- [Dependencies]
- [Permissions]
- [Environment setup]

## Usage

```bash
# Basic usage
pnpm run script-name --option=value

# Advanced usage
pnpm run script-name --option=value --flag
```

## Script Arguments

| Argument | Type | Description | Default |
|----------|------|-------------|---------|
| --option | string | [Description] | [default] |
| --flag | boolean | [Description] | false |

## Implementation Details

### Core Logic

[Description of core logic]

### Error Handling

[Error handling approach]

### Logging

[Logging strategy]

### Configuration

[Configuration management]

## Examples

### Example 1: [Example Title]

```bash
# Command
pnpm run script-name --example-param=value

# Expected output
[Expected output]
```

### Example 2: [Example Title]

```bash
# Command
pnpm run script-name --advanced-option

# Expected output
[Expected output]
```

## Troubleshooting

### Common Issues

- [Issue 1]
- [Solution 1]
- [Issue 2]
- [Solution 2]

### Error Codes

| Code | Description | Resolution |
|------|-------------|----------|
| E001 | [Error description] | [Resolution] |
| E002 | [Error description] | [Resolution] |

## Dependencies

- [Dependency 1]
- [Dependency 2]
- [Dependency 3]

## Security Considerations

- [Security consideration 1]
- [Security consideration 2]
- [Security consideration 3]

## Performance Notes

- [Performance note 1]
- [Performance note 2]
- [Performance note 3]

## Maintenance

- [Maintenance task 1]
- [Maintenance task 2]
- [Maintenance task 3]

## Version History

- [Version 1.0] - Initial release
- [Version 1.1] - [Change description]
- [Version 1.2] - [Change description]

## Contributing

[Contributing guidelines]
```

## References

- [Reference 1]
- [Reference 2]
- [Reference 3]
```
```

### 4. Agent Configuration Template

```markdown
---
name: agent-config-template
description: |
  **AGENT CONFIGURATION** - Agent configuration and behavior patterns.
  USE FOR: Understanding agent behavior, optimization patterns, and coordination.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "your-name"
  category: "agent-config"
---

# [Agent Name] Configuration

## Overview

This document defines the configuration and behavior patterns for the [agent name] agent.

## Agent Characteristics

### Core Capabilities

- [Capability 1]
- [Capability 2]
- [Capability 3]

### Specialization

- [Specialization 1]
- [Specialization 2]
- [Specialization 3]

### Optimization Patterns

- [Optimization pattern 1]
- [Optimization pattern 2]
- [Optimization pattern 3]

## Configuration

### Basic Configuration

```typescript
interface AgentConfig {
  name: string;
  version: string;
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  timeout: number;
  retryPolicy: RetryPolicy;
}
```

### Advanced Configuration

```typescript
interface AdvancedAgentConfig extends AgentConfig {
  expertise: string[];
  preferences: AgentPreferences;
  resources: ResourceAllocation;
  coordination: CoordinationConfig;
  monitoring: MonitoringConfig;
}
```

## Behavior Patterns

### Interaction Patterns

- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

### Decision Making

- [Decision pattern 1]
- [Decision pattern 2]
- [Decision pattern 3]

### Error Handling

- [Error handling pattern 1]
- [Error handling pattern 2]
- [Error handling pattern 3]

## Integration Patterns

### MCP Integration

- [MCP integration pattern 1]
- [MCP integration pattern 2]
- [MCP integration pattern 3]

### Agent Communication

- [Communication pattern 1]
- [Communication pattern 2]
- [Communication pattern 3]

### Resource Management

- [Resource pattern 1]
- [Resource pattern 2]
- [Resource pattern 3]

## Performance Optimization

### Memory Management

- [Memory pattern 1]
- [Memory pattern 2]
- [Memory pattern 3]

### Caching Strategies

- [Caching pattern 1]
- [Caching pattern 2]
- [Caching pattern 3]

### Load Balancing

- [Load balancing pattern 1]
- [Load balancing pattern 2]
- [Load balancing pattern 3]

## Quality Assurance

### Testing Patterns

- [Testing pattern 1]
- [Testing pattern 2]
- [Testing pattern 3]

### Validation Patterns

- [Validation pattern 1]
- [Validation pattern 2]
- [Validation pattern 3]

### Monitoring Patterns

- [Monitoring pattern 1]
- [Monitoring pattern 2]
- [Monitoring pattern 3]

## Troubleshooting

### Common Issues

- [Issue 1]
- [Solution 1]
- [Issue 2]
- [Solution 2]

### Debugging

- [Debugging technique 1]
- [Debugging technique 2]
- [Debugging technique 3]

### Performance Issues

- [Performance issue 1]
- [Performance issue 2]
- [Performance issue 3]

## Examples

### Basic Usage

```typescript
// Basic agent configuration
const config: AgentConfig = {
  name: 'example-agent',
  version: '1.0.0',
  enabled: true,
  logLevel: 'info',
  timeout: 30000,
  retryPolicy: {
    maxAttempts: 3,
    backoff: 'exponential'
  }
};

const agent = new ExampleAgent(config);
```

### Advanced Usage

```typescript
// Advanced agent configuration
const advancedConfig: AdvancedAgentConfig = {
  ...config,
  expertise: ['pattern-recognition', 'capability-mapping'],
  preferences: {
    learningRate: 0.1,
    adaptationSpeed: 'medium',
    riskTolerance: 'low'
  },
  resources: {
    memory: '512MB',
    cpu: '2 cores',
    storage: '1GB'
  },
  coordination: {
    protocol: 'a2a',
    timeout: 60000,
    retryPolicy: 'exponential'
  },
  monitoring: {
    metrics: ['performance', 'accuracy', 'resource-usage'],
    alerts: ['error-rate', 'timeout', 'resource-exhaustion']
  }
};

const advancedAgent = new AdvancedAgent(advancedConfig);
```

## Best Practices

### Configuration Management

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Performance Optimization

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Security Considerations

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Maintenance

- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

## References

- [Reference 1]
- [Reference 2]
- [Reference 3]
```
```

## Discovery Checklists

### 1. Skill Discovery Checklist

```markdown
# Skill Discovery Checklist

## Discovery Preparation
- [ ] Define discovery scope and objectives
- [ ] Identify target directories and file types
- [ ] Configure discovery parameters
- [ ] Set up quality gates and thresholds
- [ ] Prepare reporting templates

## File System Scanning
- [ ] Scan all skill directories recursively
- [ ] Identify skill files by extension (.md, .json, .yml)
- [ ] Extract file metadata and structure
- [ ] Detect duplicate or orphaned files
- [ ] Validate file permissions and accessibility

## Pattern Recognition
- [ ] Recognize workflow skill patterns
- [ ] Identify reference skill patterns
- [ ] Detect scripting skill patterns
- [ ] Analyze content structure patterns
- [] Extract metadata patterns
- [ ] Validate pattern consistency

## Capability Mapping
- [ ] Map skills to capabilities
- [] Identify capability gaps
- [] Detect capability overlaps
- [ ] Calculate coverage metrics
- [ ] Generate mapping recommendations
- [ ] Validate mapping accuracy

## Quality Validation
- [ ] Validate metadata completeness
- [ ] Check content quality
- [] Verify structural integrity
- [] Test pattern recognition accuracy
- [ ] Validate mapping relevance
- [ ] Check for consistency issues

## Reporting Generation
- [ ] Generate comprehensive discovery report
- [ ] Include metrics and analytics
- [ ] Provide recommendations
- [ ] Create visual representations
- [ ] Export in multiple formats
- [ ] Archive historical results

## Post-Discovery Actions
- [ ] Update skill catalog
- [] Optimize discovered skills
- [] Address identified gaps
- [ ] Implement recommendations
- [] Schedule follow-up discovery
- [ ] Share findings with team
```

### 2. Quality Assessment Checklist

```markdown
# Skill Quality Assessment Checklist

## Metadata Quality
- [ ] Frontmatter present and valid YAML
- [ ] Required fields complete
- [ ] Optional fields appropriate
- [ ] Data types correct
- [ ] Naming conventions followed

## Content Quality
- [ ] Clear and concise descriptions
- [ ] Proper structure and organization
- [ ] Accurate and up-to-date information
- [ ] Comprehensive examples included
- [ ] Language and grammar correct
- [ ] Formatting consistent

## Structure Quality
- [ ] Logical section organization
- [ ] Proper heading hierarchy
- [] Consistent formatting style
- [   ] Adequate detail level
- [ ] Appropriate length for content
- [ ] Cross-references included

## Technical Quality
- [ ] Code examples functional
- [ ] Commands tested and verified
- [ ] Parameters documented
- [   Error handling implemented
- [   Security considerations addressed
- [   Performance optimized

## Discoverability
- [ ] Searchable keywords included
- [ ] Proper categorization
- [   Tagging implemented
- [   Metadata optimized
- [   Path structure logical
- [   Naming conventions followed

## Compliance Standards
- [ ] Template compliance maintained
- [ ] Standards adherence verified
- [ ] Version tracking implemented
- [   License information included
- [   Attribution maintained
- [   Copyright notices included
```

### 3. Optimization Checklist

```markdown
# Skill Optimization Checklist

## Content Optimization
- [ ] Remove redundant content
- [ ] Enhance clarity and readability
- [ ] Add missing sections
- [ ] Update outdated information
- [ ] Improve examples and samples
- [ ] Expand technical details

## Metadata Optimization
- [ ] Add missing required fields
- [ ] Update category classification
- [ ] Enhance expertise level
- [ ] Add relevant tags
- [ ] Optimize for search
- [ ] Update version information

## Structure Optimization
- [ ] Improve section organization
- [   Add missing navigation
- [   Enhance cross-references
- [   Optimize heading hierarchy
- [   Balance content depth
- [   Improve internal linking

## Performance Optimization
- [ ] Reduce file size where possible
- [ ] Optimize image sizes
- [   Minimize parsing complexity
- [   Optimize loading patterns
- [   Cache frequently accessed content
- [   Implement lazy loading

## SEO Optimization
- [ ] Optimize keyword density
- [ ] Enhance meta descriptions
- [ ] Improve internal linking
- [   Add structured data
- [   Optimize for search engines
- [   Include alt text for images
-   Use semantic HTML

## Accessibility Optimization
- [ ] Add alt text for images
- [   Use semantic HTML structure
- [   Include ARIA labels
- [   Ensure keyboard navigation
- [   Test with screen readers
- [   Validate color contrast
-   Check focus management

## Integration Optimization
- [ ] Update cross-references
- [   Validate MCP server references
- [   Test tool invocations
-   Verify integration patterns
-   Update dependency lists
-   Test automation scripts
-   Validate CLI commands
```

## Discovery Report Templates

### 1. Executive Summary Template

```markdown
# Skill Discovery Report - [Date]

## Executive Summary

### Overview
- **Discovery Date**: [Date]
- **Discovery Scope**: [Scope description]
- **Total Skills Discovered**: [Number]
- **Quality Score**: [Score/10]
- **Coverage**: [Percentage]%

### Key Findings
- [Key finding 1]
- [Key finding 2]
- [Key finding 3]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

### Next Steps
- [Next step 1]
- [Next step 2]
- [Next step 3]
```

### 2. Detailed Analysis Template

```markdown
# Detailed Skill Analysis Report

## Skill Categories Analysis

### Workflow Skills
- **Count**: [Number]
- **Quality Score**: [Score/10]
- **Coverage**: [Percentage]%
- **Gaps Identified**: [Number]

### Reference Skills
- **Count**: [Number]
- **Quality Score**: [Score/10]
- **Coverage**: [Percentage]%
- **Gaps Identified**: [Number]

### Scripting Skills
- **Count**: [Number]
- **Quality Score**: [Quality Score/10]
- **Coverage**: [Percentage]%
- **Gaps Identified**: [Number]

## Individual Skill Analysis

### [Skill Name]
- **Category**: [Category]
- **Quality Score**: [Score/10]
- **Confidence**: [Confidence/10]
- **Patterns Identified**: [Number]
- **Capabilities Mapped**: [Number]
- **Gaps Identified**: [Number]
- **Optimization Needs**: [High/Medium/Low]

#### Content Analysis
- **Structure**: [Structure quality assessment]
- **Clarity**: [Clarity assessment]
- **Completeness**: [Completeness assessment]
- **Accuracy**: [Accuracy assessment]

#### Metadata Analysis
- **Completeness**: [Completeness score]
- **Accuracy**: [Accuracy score]
- **Consistency**: [Consistency score]
- **Discoverability**: [Discoverability score]

#### Pattern Recognition
- **Pattern Types**: [Pattern types identified]
- **Confidence Level**: [Average confidence]
- **Evidence Count**: [Number of evidence points]
- **Validation Status**: [Validated/unvalidated]

#### Capability Mapping
- **Mapped Capabilities**: [List of capabilities]
- **Mapping Confidence**: [Average confidence]
- **Gap Analysis**: [Gap summary]
- **Coverage Percentage**: [Coverage percentage]

#### Optimization Opportunities
- **Content**: [Content optimization needs]
- **Metadata**: [Metadata optimization needs]
- **Structure**: [Structure optimization needs]
- **Integration**: [Integration optimization needs]

## Gap Analysis

### Critical Gaps
- [Gap 1]: [Gap description]
- [Impact]: [Impact assessment]
- **Priority**: [Priority level]
- **Recommended Action**: [Action recommendation]

### Minor Gaps
- [Gap 1]: [Gap description]
- [Impact**: [Impact assessment]
- **Priority**: [Priority level]
- **Recommended Action**: [Action recommendation]

### Overlap Analysis
- [Overlap 1]: [Overlap description]
- **Impact**: [Impact assessment]
- **Recommended Action**: [Action recommendation]

## Recommendations

### Immediate Actions (P0)
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Short-term Improvements (P1)
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Long-term Enhancements (P2)
1. [Action 1]
2. [Action 2]
3. [Action 3]

## Metrics and Analytics

### Discovery Metrics
- **Total Skills**: [Number]
- **Discovery Duration**: [Duration]
- **Processing Speed**: [Skills per minute]
- **Accuracy Rate**: [Percentage]
- **Quality Score**: [Average score]
- **Coverage Percentage**: [Percentage]

### Quality Metrics
- **Metadata Completeness**: [Score/10]
- **Content Quality**: [Score/10]
- **Structure Quality**: [Score/10]
- **Pattern Recognition**: [Score/10]
- **Capability Mapping**: [Score/10]

### Performance Metrics
- **Processing Speed**: [Skills/minute]
- **Memory Usage**: [Memory usage]
- **CPU Usage**: [CPU usage]
- **Network I/O**: [Network I/O]

### Business Impact Metrics
- **Skill Coverage**: [Percentage]
- **Capability Coverage**: [Percentage]
- **Optimization Potential**: [Percentage]
- **ROI Improvement**: [Estimated percentage]
```

### 3. Technical Analysis Template

```markdown
# Technical Analysis Report

## Infrastructure Analysis

### File System Structure
- **Total Directories**: [Number]
- **Skill Files**: [Number]
- **File Types**: [Types and counts]
- **Directory Depth**: [Max depth]
- **Orphaned Files**: [Number]
- **Duplicate Files**: [Number]

### Content Analysis
- **Total Content Size**: [Size]
- **Average File Size**: [Size]
- **Largest File**: [File name and size]
- **Code Blocks**: [Number]
- **Tables**: [Number]
- **Images**: [Number]

### Metadata Analysis
- **Files with Metadata**: [Number]
- **Complete Frontmatter**: [Number]
- **Incomplete Frontmatter**: [Number]
- **Invalid Frontmatter**: [Number]
- **Missing Required Fields**: [Number]
- **Custom Fields**: [Number]

## Pattern Recognition Results

### Pattern Recognition Accuracy
- **Overall Accuracy**: [Percentage]
- **Workflow Patterns**: [Percentage]
- **Reference Patterns**: [Percentage]
- **Scripting Patterns**: [Percentage]
- **Agent Patterns**: [Percentage]

### Confidence Distribution
- **High Confidence (>0.8)**: [Percentage]
- **Medium Confidence (0.5-0.8)**: [Percentage]
- **Low Confidence (<0.5)**: [Percentage]

### Pattern Types Identified
- **Workflow Steps**: [Count]
- **Tool References**: [Count]
- **Error Handling**: [Count]
- **Validation Steps**: [Count]
- **Success Criteria**: [Count]

## Capability Mapping Results

### Capability Coverage
- **Total Capabilities**: [Number]
- **Mapped Capabilities**: [Number]
- **Coverage Percentage**: [Percentage]
- **Gap Count**: [Number]
- **Overlap Count**: [Number]

### Capability Distribution
- **Technical Capabilities**: [Count]
- **Business Capabilities**: [Count]
- **Integration Capabilities**: [Count]
- **Security Capabilities**: [Count]

### High-Priority Gaps
- [Gap 1]: [Gap description]
- [Gap 2]: [Gap description]
- [Gap 3]: [Gap description]

### Optimization Opportunities
- [Opportunity 1]: [Opportunity description]
- [Opportunity 2]: [Opportunity description]
- [Opportunity 3]: [Opportunity description]
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
