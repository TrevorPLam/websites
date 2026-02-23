#!/usr/bin/env node

/**
 * Final Task Generator - Complete Multi-Agent Task Creation
 * Properly parses domain files and generates high-quality tasks
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  domainsDir: path.join(__dirname, '../docs/plan'),
  tasksDir: path.join(__dirname, '../tasks'),
  templatePath: path.join(__dirname, '../tasks/template.md'),
};

/**
 * Parse domain file properly
 */
function parseDomainFile(domainNumber, fileName) {
  const filePath = path.join(CONFIG.domainsDir, `domain-${domainNumber}`, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Extract title (first H1)
  let title = '';
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.substring(2).trim();
      break;
    }
  }

  // Extract description (first paragraph after title or Overview section)
  let description = '';
  let foundTitle = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#')) {
      description = line.trim();
      break;
    }
    if (line.startsWith('## Overview')) {
      // Look for content after Overview
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (nextLine.trim() && !nextLine.startsWith('#')) {
          description = nextLine.trim();
          break;
        }
      }
      break;
    }
  }

  // Extract topics from Key Topics section
  let topics = [];
  let inTopicsSection = false;

  for (const line of lines) {
    if (line.startsWith('#### Key Topics:')) {
      inTopicsSection = true;
      const topicsLine = line.substring(18).trim();
      topics = topicsLine.split(',').map((t) => t.trim());
      continue;
    }

    if (inTopicsSection && line.startsWith('#### ')) {
      inTopicsSection = false;
      continue;
    }

    if (inTopicsSection && line.trim().startsWith('- ')) {
      topics.push(line.substring(2).trim());
    }
  }

  // Extract section number
  const sectionNumber = fileName.split('-')[1];

  return {
    file: fileName,
    title: title || `Section ${sectionNumber}`,
    description:
      description || `Implementation for domain ${domainNumber} section ${sectionNumber}`,
    topics: topics.length > 0 ? topics : [`Domain ${domainNumber} implementation`],
    sectionNumber,
    content,
    domainNumber,
  };
}

/**
 * Generate comprehensive task content
 */
function generateTaskContent(domainFile) {
  const { title, description, topics, sectionNumber, domainNumber } = domainFile;

  // Generate clean task ID
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const taskId = `DOMAIN-${domainNumber}-${sectionNumber}-${cleanTitle}`;

  // Create comprehensive task content
  const taskContent = `---
id: ${taskId}
title: '${title}'
status: pending
priority: high
type: feature
created: ${new Date().toISOString().split('T')[0]}
updated: ${new Date().toISOString().split('T')[0]}
owner: 'ai-agent'
branch: feat/${taskId}
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Read Write Bash(node:*) Read Write Bash(pnpm:*) Read Write
---

# ${taskId}

## Objective

Implement ${title.toLowerCase()} for Domain ${domainNumber} following the specifications in the domain plan. This task focuses on ${topics.join(', ')} and ensures proper integration with the existing monorepo architecture.

## Context

**Domain:** Domain ${domainNumber}
**Section:** ${sectionNumber}
**Files:** ${domainFile.file}

**Codebase Area:**
- Location: \`docs/plan/domain-${domainNumber}/\`
- Focus: ${topics.join(', ')}
- Integration: Multi-tenant marketing platform

**Dependencies:**
- Next.js 16 with App Router
- TypeScript with strict typing
- pnpm workspace management
- Turborepo build orchestration
- Multi-tenant architecture patterns
- Existing packages and infrastructure

**Prior Work:**
- Foundation domains (1-8) completed
- Core architecture established
- Multi-tenant isolation implemented
- Security patterns in place

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework with App Router |
| TypeScript | Type safety and development |
| pnpm | Package management |
| Turborepo | Build orchestration |
| Multi-tenant patterns | Architecture |

## Acceptance Criteria

### Agent Verification
- [ ] All implementation requirements from domain plan are met
- [ ] Code follows established patterns and conventions
- [ ] TypeScript compilation passes without errors
- [ ] Integration with existing architecture is seamless
- [ ] Multi-tenant isolation is maintained

### Human Verification
- [ ] Implementation matches domain specifications exactly
- [ ] Code quality meets project standards
- [ ] Documentation is comprehensive and accurate
- [ ] Testing coverage is adequate
- [ ] Performance requirements are met

## Implementation Plan

### Phase 1: Analysis and Setup
1. **Analyze domain requirements**
   - Review domain plan specifications in detail
   - Identify key implementation patterns
   - Plan integration points with existing architecture

2. **Setup development environment**
   - Create necessary directory structure
   - Configure build tools and dependencies
   - Establish testing framework and fixtures

### Phase 2: Core Implementation
1. **Implement core functionality**
   - Build main features according to specifications
   - Ensure proper TypeScript typing throughout
   - Follow established architectural patterns

2. **Integration work**
   - Connect with existing packages and utilities
   - Ensure multi-tenant compatibility
   - Implement proper error handling and logging

### Phase 3: Testing and Validation
1. **Unit testing**
   - Test core functionality with comprehensive coverage
   - Validate TypeScript types and interfaces
   - Ensure error handling works correctly

2. **Integration testing**
   - Test with existing architecture components
   - Validate multi-tenant isolation
   - Ensure performance requirements are met

## Commands

### Development
\`\`\`bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
\`\`\`

### Build and Deploy
\`\`\`bash
# Build for production
pnpm build

# Run production tests
pnpm test:prod

# Deploy to staging
pnpm deploy:staging
\`\`\`

## Code Style

### Correct Patterns
\`\`\`typescript
// Use proper TypeScript typing
interface ExampleInterface {
  property: string;
  method(): void;
}

// Follow established patterns
export function exampleFunction(param: string): string {
  return param.toUpperCase();
}
\`\`\`

### Incorrect Patterns
\`\`\`typescript
// Avoid any types
const data: any = {};

// Avoid unnecessary complexity
function badExample(x: any, y: any): any {
  return x + y;
}
\`\`\`

## Boundaries

### Always Allowed
- Use established package patterns and utilities
- Follow multi-tenant architecture principles
- Implement proper TypeScript typing
- Use existing helpers and shared components
- Follow security best practices

### Requires Human Approval
- Breaking changes to existing APIs
- Major architectural decisions
- Security-related implementations
- Performance-critical optimizations
- Database schema modifications

### Forbidden
- Bypassing type safety with any types
- Introducing breaking changes without review
- Hardcoding configuration values
- Skipping testing requirements
- Violating multi-tenant isolation

## Success Verification

### Completion Checklist
- [ ] All requirements from domain plan implemented
- [ ] TypeScript compilation passes without errors
- [ ] Tests pass successfully with adequate coverage
- [ ] Documentation is complete and accurate
- [ ] Code review approved by human reviewer
- [ ] Multi-tenant isolation verified
- [ ] Performance benchmarks met

### Quality Metrics
- Code coverage > 80%
- TypeScript strict mode enabled
- No linting errors or warnings
- Performance benchmarks within acceptable range
- Security scan passes

## Edge Cases

### Error Handling
- Network failures and timeouts
- Invalid input data and validation
- Multi-tenant conflicts and isolation
- Resource limitations and scaling
- Database connection issues

### Performance Considerations
- Large dataset handling and pagination
- Concurrent user access and load balancing
- Resource optimization and caching
- Memory usage and garbage collection

## Out of Scope

- Major architectural changes without review
- Breaking existing APIs without migration
- Database schema modifications without planning
- Security policy changes without approval
- Performance optimizations without benchmarks

## References

- Domain Plan: \`docs/plan/domain-${domainNumber}/${domainFile.file}\`
- Architecture Guide: \`docs/architecture/\`
- Development Standards: \`docs/standards/\`
- Multi-tenant Patterns: \`docs/patterns/multi-tenant/\`
- Security Guidelines: \`docs/security/\`

---

*Created: ${new Date().toISOString().split('T')[0]}*
*Domain: ${domainNumber}*
*Section: ${sectionNumber}*
*Priority: High*
*Type: Feature Implementation*
`;

  return taskContent;
}

/**
 * Validate task structure
 */
function validateTask(taskContent) {
  const requiredSections = [
    'id:',
    'title:',
    'status:',
    'priority:',
    'type:',
    'created:',
    'updated:',
    'owner:',
    'branch:',
    'allowed-tools:',
    '# Objective',
    '## Context',
    '## Tech Stack',
    '## Acceptance Criteria',
    '## Implementation Plan',
    '## Commands',
    '## Code Style',
    '## Boundaries',
    '## Success Verification',
    '## Edge Cases',
    '## Out of Scope',
    '## References',
  ];

  const missingSections = requiredSections.filter((section) => !taskContent.includes(section));

  return {
    isValid: missingSections.length === 0,
    missingSections,
    score: Math.max(0, 100 - missingSections.length * 5),
  };
}

/**
 * Process single domain
 */
async function processDomain(domainNumber) {
  console.log(`\n🚀 Processing Domain ${domainNumber}`);

  const domainDir = path.join(CONFIG.domainsDir, `domain-${domainNumber}`);
  if (!fs.existsSync(domainDir)) {
    console.warn(`⚠️ Domain ${domainNumber} directory not found`);
    return { domainNumber, success: false, error: 'Directory not found' };
  }

  // Get domain files
  const domainFiles = fs
    .readdirSync(domainDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .map((file) => parseDomainFile(domainNumber, file));

  if (domainFiles.length === 0) {
    console.warn(`⚠️ No files found in Domain ${domainNumber}`);
    return { domainNumber, success: false, error: 'No files found' };
  }

  // Create tasks directory
  const taskDir = path.join(CONFIG.tasksDir, `domain-${domainNumber}`);
  if (!fs.existsSync(taskDir)) {
    fs.mkdirSync(taskDir, { recursive: true });
  }

  // Generate tasks
  const tasks = [];
  const validationResults = [];

  for (const domainFile of domainFiles) {
    const cleanTitle = domainFile.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    const taskFileName = `DOMAIN-${domainNumber}-${domainFile.sectionNumber}-${cleanTitle}.md`;
    const taskPath = path.join(taskDir, taskFileName);

    // Generate task content
    const taskContent = generateTaskContent(domainFile);

    // Validate task
    const validation = validateTask(taskContent);
    validationResults.push(validation);

    // Write task file
    fs.writeFileSync(taskPath, taskContent);

    tasks.push({
      domainNumber,
      fileName: taskFileName,
      path: taskPath,
      validation,
      domainFile,
    });

    console.log(`✅ Created: ${taskFileName} (${validation.score}% valid)`);
  }

  // Calculate domain score
  const avgScore =
    validationResults.reduce((sum, r) => sum + r.score, 0) / validationResults.length;

  return {
    domainNumber,
    success: true,
    tasksCreated: tasks.length,
    averageScore: Math.round(avgScore),
    validationResults,
    tasks,
  };
}

/**
 * Process all remaining domains
 */
async function processAllDomains() {
  console.log('🚀 Final Task Generator Started');
  console.log(`📁 Domains Directory: ${CONFIG.domainsDir}`);
  console.log(`📁 Tasks Directory: ${CONFIG.tasksDir}`);

  // Get remaining domains
  const completedDomains = [1, 2, 3, 4, 5, 6, 7, 8];
  const allDomains = Array.from({ length: 36 }, (_, i) => i + 1);
  const remainingDomains = allDomains.filter((d) => !completedDomains.includes(d));

  console.log(`\n📊 Execution Plan:`);
  console.log(`✅ Completed Domains: ${completedDomains.length}`);
  console.log(`🔄 Remaining Domains: ${remainingDomains.length}`);

  // Process all domains
  const allResults = [];
  const startTime = Date.now();

  for (const domainNumber of remainingDomains) {
    const result = await processDomain(domainNumber);
    allResults.push(result);

    // Brief pause between domains
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Generate final report
  const successfulResults = allResults.filter((r) => r.success);
  const totalTasks = successfulResults.reduce((sum, r) => sum + r.tasksCreated, 0);
  const avgScore =
    successfulResults.reduce((sum, r) => sum + r.averageScore, 0) / successfulResults.length;

  console.log(`\n🎉 Execution Complete!`);
  console.log(`\n📊 Final Results:`);
  console.log(`✅ Successful Domains: ${successfulResults.length}/${allResults.length}`);
  console.log(`📝 Total Tasks Created: ${totalTasks}`);
  console.log(`📊 Average Quality Score: ${Math.round(avgScore)}%`);
  console.log(`⏱️ Total Duration: ${duration}s`);

  // Save execution report
  const report = {
    timestamp: new Date().toISOString(),
    domainsProcessed: allResults.length,
    successfulDomains: successfulResults.length,
    totalTasksCreated: totalTasks,
    averageQualityScore: Math.round(avgScore),
    duration: parseFloat(duration),
    results: allResults,
  };

  const reportPath = path.join(__dirname, '../final-execution-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Execution report saved to: ${reportPath}`);
  console.log(`\n🎯 Ready for implementation!`);

  return report;
}

// Run if called directly
if (require.main === module) {
  processAllDomains().catch(console.error);
}

module.exports = {
  processDomain,
  processAllDomains,
  generateTaskContent,
  validateTask,
};
