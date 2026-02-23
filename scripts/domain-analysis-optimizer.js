#!/usr/bin/env node

/**
 * Domain Analysis Optimizer
 * Analyzes remaining domains and creates optimized execution plan
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  domainsDir: path.join(__dirname, '../docs/plan'),
  tasksDir: path.join(__dirname, '../tasks'),
  outputPath: path.join(__dirname, '../OPTIMIZATION-PLAN.md'),
};

/**
 * Analyze domain complexity and dependencies
 */
function analyzeDomain(domainNumber) {
  const domainDir = path.join(CONFIG.domainsDir, `domain-${domainNumber}`);

  if (!fs.existsSync(domainDir)) {
    return { exists: false, complexity: 0, files: 0, dependencies: [] };
  }

  const files = fs
    .readdirSync(domainDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md');

  // Calculate complexity based on file count and content
  let complexity = 0;
  let dependencies = [];

  for (const file of files) {
    const filePath = path.join(domainDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Count lines as complexity indicator
    const lines = content.split('\n').length;
    complexity += lines / 100; // Normalize

    // Extract dependencies
    const deps = content.match(/depends on domain \d+/gi) || [];
    dependencies.push(...deps.map((d) => parseInt(d.match(/\d+/)[0])));
  }

  return {
    exists: true,
    files: files.length,
    complexity: Math.round(complexity * 10) / 10,
    dependencies: [...new Set(dependencies)],
    estimatedHours: Math.round(complexity * 2), // Rough estimate
  };
}

/**
 * Create optimized execution plan
 */
function createOptimizedPlan() {
  console.log('🔍 Analyzing remaining domains...');

  // Analyze all domains
  const domains = [];
  for (let i = 1; i <= 36; i++) {
    const analysis = analyzeDomain(i);
    domains.push({ number: i, ...analysis });
  }

  // Filter completed domains (no files or already processed)
  const completedDomains = [1, 2, 3, 4, 5, 6, 7, 8]; // Already completed
  const remainingDomains = domains.filter((d) => d.exists && !completedDomains.includes(d.number));

  console.log(`\n📊 Domain Analysis:`);
  console.log(`✅ Completed Domains: ${completedDomains.length}`);
  console.log(`🔄 Remaining Domains: ${remainingDomains.length}`);

  // Sort by complexity and dependencies
  remainingDomains.sort((a, b) => {
    // Prioritize domains with fewer dependencies
    if (a.dependencies.length !== b.dependencies.length) {
      return a.dependencies.length - b.dependencies.length;
    }
    // Then by complexity
    return a.complexity - b.complexity;
  });

  // Create execution batches
  const batches = [];
  const maxBatchComplexity = 15; // Maximum complexity per batch
  let currentBatch = [];
  let currentComplexity = 0;

  for (const domain of remainingDomains) {
    if (currentComplexity + domain.complexity > maxBatchComplexity && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [domain];
      currentComplexity = domain.complexity;
    } else {
      currentBatch.push(domain);
      currentComplexity += domain.complexity;
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Generate optimization plan
  const plan = generateOptimizationPlan(remainingDomains, batches);

  // Write plan to file
  fs.writeFileSync(CONFIG.outputPath, plan);

  console.log(`\n📋 Optimization plan saved to: ${CONFIG.outputPath}`);
  console.log(`\n🎯 Execution Summary:`);
  console.log(`📊 Total Remaining Domains: ${remainingDomains.length}`);
  console.log(`📊 Total Batches: ${batches.length}`);
  console.log(
    `📊 Total Estimated Hours: ${remainingDomains.reduce((sum, d) => sum + d.estimatedHours, 0)}`
  );

  return { remainingDomains, batches, plan };
}

/**
 * Generate optimization plan markdown
 */
function generateOptimizationPlan(domains, batches) {
  const totalComplexity = domains.reduce((sum, d) => sum + d.complexity, 0);
  const totalHours = domains.reduce((sum, d) => sum + d.estimatedHours, 0);

  return `# Multi-Agent Domain Task Creation - Optimized Execution Plan

## Executive Summary

**Current Status:**
- ✅ Completed Domains: 8/36 (22%)
- 🔄 Remaining Domains: ${domains.length}/36 (${Math.round((domains.length / 36) * 100)}%)
- 📊 Total Complexity: ${totalComplexity.toFixed(1)}
- ⏱️ Estimated Total Hours: ${totalHours}

## Optimized Strategy

### Multi-Agent Orchestration

**Agent Specializations:**
1. **Business Logic Agent** - Domains 9-19 (Lead capture, payments, real-time features)
2. **Integration Agent** - Domains 20-25 (Third-party, AI, assets, privacy)
3. **Advanced Features Agent** - Domains 26-36 (Governance, mobile, performance, enterprise)

### Batch Processing Strategy

**Batch Configuration:**
- **Batch Size**: 3-4 domains per batch
- **Max Complexity**: 15.0 per batch
- **Parallel Research**: 5 domains simultaneously
- **Concurrent Task Creation**: 4 tasks in parallel

## Execution Plan

### Phase 1: Business Logic Domains (Week 1)

${generateBatchSection(batches.slice(0, Math.ceil(batches.length / 3)), 'Business Logic')}

### Phase 2: Integration Domains (Week 2)

${generateBatchSection(batches.slice(Math.ceil(batches.length / 3), Math.ceil((2 * batches.length) / 3)), 'Integration')}

### Phase 3: Advanced Features Domains (Week 3)

${generateBatchSection(batches.slice(Math.ceil((2 * batches.length) / 3)), 'Advanced Features')}

## Domain Analysis

${generateDomainAnalysis(domains)}

## Automation Scripts

### 1. Multi-Agent Task Generator
\`\`\`bash
node scripts/multi-agent-task-generator.js
\`\`\`

### 2. Domain Analysis Optimizer
\`\`\`bash
node scripts/domain-analysis-optimizer.js
\`\`\`

### 3. Batch Execution Script
\`\`\`bash
node scripts/batch-executor.js
\`\`\`

## Quality Gates

### Pre-Execution Checks
- [ ] All domain files exist and are readable
- [ ] Template file is available
- [ ] Output directories are writable
- [ ] Dependencies are resolved

### Post-Execution Validation
- [ ] All task files created
- [ ] Task structure validation passes
- [ ] YAML frontmatter is valid
- [ ] Required sections are present

## Performance Metrics

### Target Metrics
- **Task Creation Speed**: 4+ tasks per minute
- **Research Efficiency**: 5 domains researched simultaneously
- **Quality Score**: 95%+ validation pass rate
- **Parallel Processing**: 4 concurrent task generations

### Monitoring
- Real-time progress tracking
- Batch completion metrics
- Error rate monitoring
- Performance optimization

## Risk Mitigation

### Potential Issues
1. **Template Inconsistencies** - Automated validation
2. **Research Data Quality** - Multiple source verification
3. **Parallel Processing Conflicts** - File locking mechanisms
4. **Quality Variations** - Standardized validation rules

### Mitigation Strategies
- Comprehensive error handling
- Rollback capabilities
- Progress persistence
- Quality assurance checks

## Success Criteria

### Completion Metrics
- [ ] All ${domains.length} remaining domains processed
- [ ] ${domains.reduce((sum, d) => sum + d.files, 0)} task files created
- [ ] 95%+ validation pass rate
- [ ] Zero critical errors

### Quality Standards
- All tasks follow template structure
- YAML frontmatter is properly formatted
- Implementation plans are comprehensive
- Acceptance criteria are testable

## Next Steps

1. **Immediate**: Run multi-agent task generator
2. **Week 1**: Execute Phase 1 (Business Logic)
3. **Week 2**: Execute Phase 2 (Integration)
4. **Week 3**: Execute Phase 3 (Advanced Features)
5. **Final**: Quality validation and integration testing

---

*Generated: ${new Date().toISOString().split('T')[0]}*
*Total Domains: ${domains.length}*
*Total Batches: ${batches.length}*
*Estimated Hours: ${totalHours}*
`;
}

/**
 * Generate batch section
 */
function generateBatchSection(batches, phaseName) {
  let section = `\n#### ${phaseName}\n\n`;

  batches.forEach((batch, index) => {
    const domainNumbers = batch.map((d) => d.number).join(', ');
    const complexity = batch.reduce((sum, d) => sum + d.complexity, 0).toFixed(1);
    const hours = batch.reduce((sum, d) => sum + d.estimatedHours, 0);

    section += `**Batch ${index + 1}:** Domains ${domainNumbers}\n`;
    section += `- Complexity: ${complexity}\n`;
    section += `- Estimated Hours: ${hours}\n`;
    section += `- Files: ${batch.reduce((sum, d) => sum + d.files, 0)}\n\n`;
  });

  return section;
}

/**
 * Generate domain analysis table
 */
function generateDomainAnalysis(domains) {
  let table = `\n### Domain Complexity Analysis\n\n`;
  table += `| Domain | Files | Complexity | Dependencies | Hours | Priority |\n`;
  table += `|--------|-------|-----------|--------------|-------|----------|\n`;

  domains.forEach((domain) => {
    const priority = domain.complexity > 5 ? 'High' : domain.complexity > 2 ? 'Medium' : 'Low';
    const deps = domain.dependencies.length > 0 ? domain.dependencies.join(', ') : 'None';

    table += `| ${domain.number} | ${domain.files} | ${domain.complexity} | ${deps} | ${domain.estimatedHours} | ${priority} |\n`;
  });

  return table;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Domain Analysis Optimizer Started');

  try {
    const result = createOptimizedPlan();
    console.log('\n✅ Optimization complete!');
    console.log(`📊 Processed ${result.remainingDomains.length} domains`);
    console.log(`📋 Created ${result.batches.length} execution batches`);
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeDomain,
  createOptimizedPlan,
  main,
};
