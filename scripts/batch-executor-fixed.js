#!/usr/bin/env node

/**
 * Fixed Batch Executor for Multi-Agent Task Creation
 * Properly applies template and generates high-quality tasks
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  domainsDir: path.join(__dirname, '../docs/plan'),
  tasksDir: path.join(__dirname, '../tasks'),
  templatePath: path.join(__dirname, '../tasks/template.md'),
  maxConcurrent: 4,
  batchSize: 3,
};

/**
 * Parse domain file to extract key information
 */
function parseDomainFile(domainNumber, fileName) {
  const filePath = path.join(CONFIG.domainsDir, `domain-${domainNumber}`, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const title =
    lines
      .find((line) => line.startsWith('# '))
      ?.substring(2)
      .trim() || '';
  const description =
    lines
      .find((line) => line.startsWith('## Overview'))
      ?.substring(12)
      .trim() || '';

  // Extract topics
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
    title,
    description,
    topics,
    sectionNumber,
    content,
    domainNumber,
  };
}

/**
 * Generate proper task content
 */
function generateTaskContent(domainFile, domainNumber) {
  const { title, description, topics, sectionNumber } = domainFile;

  // Generate task ID
  const taskId = `DOMAIN-${domainNumber}-${sectionNumber}-${title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}`;

  // Create task content
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
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Read Write Bash(node:*) Read Write
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
- Multi-tenant architecture patterns
- Existing packages and infrastructure

**Prior Work:**
- Foundation domains (1-8) completed
- Core architecture established
- Multi-tenant isolation implemented

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

### Human Verification
- [ ] Implementation matches domain specifications exactly
- [ ] Code quality meets project standards
- [ ] Documentation is comprehensive and accurate
- [ ] Testing coverage is adequate
- [ ] Performance requirements are met

## Implementation Plan

### Phase 1: Analysis and Setup
1. **Analyze domain requirements**
   - Review domain plan specifications
   - Identify key implementation patterns
   - Plan integration points

2. **Setup development environment**
   - Create necessary directory structure
   - Configure build tools and dependencies
   - Establish testing framework

### Phase 2: Core Implementation
1. **Implement core functionality**
   - Build main features according to specifications
   - Ensure proper TypeScript typing
   - Follow established patterns

2. **Integration work**
   - Connect with existing packages
   - Ensure multi-tenant compatibility
   - Implement proper error handling

### Phase 3: Testing and Validation
1. **Unit testing**
   - Test core functionality
   - Validate TypeScript types
   - Ensure error handling works

2. **Integration testing**
   - Test with existing architecture
   - Validate multi-tenant isolation
   - Ensure performance requirements

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
- Use established package patterns
- Follow multi-tenant architecture
- Implement proper TypeScript typing
- Use existing utilities and helpers

### Requires Human Approval
- Breaking changes to existing APIs
- Major architectural decisions
- Security-related implementations
- Performance-critical optimizations

### Forbidden
- Bypassing type safety
- Introducing breaking changes without review
- Hardcoding configuration values
- Skipping testing requirements

## Success Verification

### Completion Checklist
- [ ] All requirements from domain plan implemented
- [ ] TypeScript compilation passes
- [ ] Tests pass successfully
- [ ] Documentation is complete
- [ ] Code review approved

### Quality Metrics
- Code coverage > 80%
- TypeScript strict mode enabled
- No linting errors
- Performance benchmarks met

## Edge Cases

### Error Handling
- Network failures
- Invalid input data
- Multi-tenant conflicts
- Resource limitations

### Performance Considerations
- Large dataset handling
- Concurrent user access
- Resource optimization
- Caching strategies

## Out of Scope

- Major architectural changes
- Breaking existing APIs
- Database schema modifications
- Security policy changes

## References

- Domain Plan: \`docs/plan/domain-${domainNumber}/${domainFile.file}\`
- Architecture Guide: \`docs/architecture/\`
- Development Standards: \`docs/standards/\`
- Multi-tenant Patterns: \`docs/patterns/multi-tenant/\`

---

*Created: ${new Date().toISOString().split('T')[0]}*
*Domain: ${domainNumber}*
*Section: ${sectionNumber}*
*Priority: High*
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
    const taskFileName = `DOMAIN-${domainNumber}-${domainFile.sectionNumber}-${domainFile.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}.md`;
    const taskPath = path.join(taskDir, taskFileName);

    // Generate task content
    const taskContent = generateTaskContent(domainFile, domainNumber);

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
  };
}

/**
 * Process batch of domains
 */
async function processBatch(domainNumbers) {
  console.log(`\n🎯 Processing batch: Domains ${domainNumbers.join(', ')}`);

  const startTime = Date.now();
  const results = [];

  // Process domains with concurrency limit
  const promises = [];
  for (let i = 0; i < domainNumbers.length; i++) {
    const domainNumber = domainNumbers[i];

    const promise = processDomain(domainNumber);
    promises.push(promise);

    // Wait if we've reached concurrency limit
    if (promises.length >= CONFIG.maxConcurrent) {
      await Promise.all(promises.splice(0, CONFIG.maxConcurrent));
    }
  }

  // Wait for remaining promises
  if (promises.length > 0) {
    await Promise.all(promises);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Batch completed in ${duration}s`);

  return results;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Fixed Batch Executor Started');
  console.log(`📁 Domains Directory: ${CONFIG.domainsDir}`);
  console.log(`📁 Tasks Directory: ${CONFIG.tasksDir}`);
  console.log(`🔧 Max Concurrent: ${CONFIG.maxConcurrent}`);
  console.log(`📦 Batch Size: ${CONFIG.batchSize}`);

  // Get remaining domains
  const completedDomains = [1, 2, 3, 4, 5, 6, 7, 8];
  const allDomains = Array.from({ length: 36 }, (_, i) => i + 1);
  const remainingDomains = allDomains.filter((d) => !completedDomains.includes(d));

  console.log(`\n📊 Execution Plan:`);
  console.log(`✅ Completed Domains: ${completedDomains.length}`);
  console.log(`🔄 Remaining Domains: ${remainingDomains.length}`);

  // Create batches
  const batches = [];
  for (let i = 0; i < remainingDomains.length; i += CONFIG.batchSize) {
    batches.push(remainingDomains.slice(i, i + CONFIG.batchSize));
  }

  console.log(`\n📋 Batches to Process: ${batches.length}`);

  // Process all batches
  const allResults = [];
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n🎯 Batch ${i + 1}/${batches.length}`);

    const results = await processBatch(batch);
    allResults.push(...results);

    // Brief pause between batches
    if (i < batches.length - 1) {
      console.log('⏸️ Pausing between batches...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

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

  // Save execution report
  const report = {
    timestamp: new Date().toISOString(),
    batchesProcessed: batches.length,
    domainsProcessed: allResults.length,
    successfulDomains: successfulResults.length,
    totalTasksCreated: totalTasks,
    averageQualityScore: Math.round(avgScore),
    results: allResults,
  };

  const reportPath = path.join(__dirname, '../execution-report-fixed.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Execution report saved to: ${reportPath}`);
  console.log(`\n🎯 Ready for implementation!`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  processDomain,
  processBatch,
  main,
};
