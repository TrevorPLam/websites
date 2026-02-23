#!/usr/bin/env node

/**
 * Multi-Agent Task Generator for Domain Task Creation
 * Optimized for batch processing and parallel execution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  domainsDir: path.join(__dirname, '../docs/plan'),
  tasksDir: path.join(__dirname, '../tasks'),
  templatePath: path.join(__dirname, '../tasks/template.md'),
  batchSize: 3, // Process 3 domains at once
  parallelResearch: true, // Research multiple domains simultaneously
  maxConcurrentTasks: 4, // Create 4 tasks in parallel
};

// Domain categorization
const DOMAIN_CATEGORIES = {
  foundation: [1, 2, 3, 4, 5, 6, 7, 8], // Already completed
  businessLogic: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  integrations: [20, 21, 22, 23, 24, 25],
  advanced: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
};

// Agent specializations
const AGENT_SPECIALIZATIONS = {
  business: {
    domains: DOMAIN_CATEGORIES.businessLogic,
    focus: ['lead capture', 'payments', 'real-time', 'accessibility', 'security'],
    researchKeywords: ['lead', 'payment', 'realtime', 'dashboard', 'email', 'booking', 'webhook'],
  },
  integration: {
    domains: DOMAIN_CATEGORIES.integrations,
    focus: ['third-party', 'AI', 'assets', 'privacy'],
    researchKeywords: ['integration', 'AI', 'chat', 'upload', 'privacy', 'compliance'],
  },
  advanced: {
    domains: DOMAIN_CATEGORIES.advanced,
    focus: ['governance', 'mobile', 'performance', 'enterprise'],
    researchKeywords: ['governance', 'mobile', 'PWA', 'analytics', 'white-label', 'performance'],
  },
};

/**
 * Read and parse template file
 */
function readTemplate() {
  try {
    return fs.readFileSync(CONFIG.templatePath, 'utf8');
  } catch (error) {
    console.error('❌ Failed to read template:', error.message);
    process.exit(1);
  }
}

/**
 * Get domain files for a specific domain
 */
function getDomainFiles(domainNumber) {
  const domainDir = path.join(CONFIG.domainsDir, `domain-${domainNumber}`);
  if (!fs.existsSync(domainDir)) {
    console.warn(`⚠️ Domain ${domainNumber} directory not found`);
    return [];
  }

  return fs
    .readdirSync(domainDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .sort((a, b) => {
      const aNum = parseInt(a.split('-')[1]);
      const bNum = parseInt(b.split('-')[1]);
      return aNum - bNum;
    });
}

/**
 * Parse domain file to extract key information
 */
function parseDomainFile(filePath) {
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

  // Extract key topics from content
  const topics = [];
  lines.forEach((line) => {
    if (line.startsWith('#### Key Topics:')) {
      const topicsLine = line.substring(18).trim();
      const topicList = topicsLine.split(',').map((t) => t.trim());
      topics.push(...topicList);
    }
  });

  return { title, description, topics };
}

/**
 * Research domain using web search
 */
async function researchDomain(domainNumber, domainFiles, keywords) {
  console.log(`🔍 Researching Domain ${domainNumber}...`);

  const researchQueries = [
    `${keywords[0]} ${keywords[1]} 2026 best practices`,
    `${keywords[2]} implementation guide 2026`,
    `${keywords[3]} patterns 2026`,
    `${keywords[4]} architecture 2026`,
  ].filter(Boolean);

  // Simulate research (in real implementation, this would use actual web search)
  const researchResults = {
    domainNumber,
    files: domainFiles.map((file) =>
      parseDomainFile(path.join(CONFIG.domainsDir, `domain-${domainNumber}`, file))
    ),
    researchData: {
      latestStandards: `2026 ${keywords[0]} standards and best practices`,
      implementationPatterns: `Advanced ${keywords[1]} patterns for 2026`,
      commonChallenges: `${keywords[2]} challenges and solutions`,
      toolsAndFrameworks: `Modern ${keywords[3]} tools and frameworks`,
      compliance: `${keywords[4]} compliance requirements`,
    },
  };

  return researchResults;
}

/**
 * Generate task from domain file and research
 */
function generateTask(domainFile, research, template) {
  const { title, description, topics } = domainFile;
  const domainNumber = research.domainNumber;
  const sectionNumber = domainFile.file.split('-')[1];

  const taskContent = template
    .replace(/{{DOMAIN_NUMBER}}/g, domainNumber)
    .replace(/{{SECTION_NUMBER}}/g, sectionNumber)
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, description)
    .replace(/{{TOPICS}}/g, topics.join(', '))
    .replace(/{{RESEARCH_DATA}}/g, JSON.stringify(research.researchData, null, 2))
    .replace(/{{CURRENT_DATE}}/g, new Date().toISOString().split('T')[0]);

  const taskFileName = `DOMAIN-${domainNumber}-${sectionNumber}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
  const taskPath = path.join(CONFIG.tasksDir, `domain-${domainNumber}`, taskFileName);

  return { taskContent, taskPath, taskFileName };
}

/**
 * Process a batch of domains
 */
async function processBatch(domainNumbers, agentType) {
  console.log(`\n🚀 Processing batch for ${agentType} agent: Domains ${domainNumbers.join(', ')}`);

  // Research all domains in parallel
  const researchPromises = domainNumbers.map(async (domainNum) => {
    const domainFiles = getDomainFiles(domainNum);
    const keywords = AGENT_SPECIALIZATIONS[agentType].researchKeywords;
    return researchDomain(domainNum, domainFiles, keywords);
  });

  const researchResults = await Promise.all(researchPromises);

  // Read template
  const template = readTemplate();

  // Generate tasks for all domains
  const taskPromises = [];

  for (let i = 0; i < researchResults.length; i++) {
    const research = researchResults[i];
    const domainFiles = getDomainFiles(research.domainNumber);

    for (const domainFile of domainFiles) {
      taskPromises.push(
        new Promise((resolve) => {
          const task = generateTask(domainFile, research, template);

          // Ensure directory exists
          const taskDir = path.dirname(task.taskPath);
          if (!fs.existsSync(taskDir)) {
            fs.mkdirSync(taskDir, { recursive: true });
          }

          // Write task file
          fs.writeFileSync(task.taskPath, task.taskContent);

          console.log(`✅ Created: ${task.taskFileName}`);
          resolve(task);
        })
      );
    }
  }

  const tasks = await Promise.all(taskPromises);

  console.log(`\n✅ Completed ${agentType} batch: ${tasks.length} tasks created`);
  return tasks;
}

/**
 * Validate generated tasks
 */
function validateTasks(tasks) {
  console.log('\n🔍 Validating generated tasks...');

  let validCount = 0;
  let invalidCount = 0;

  for (const task of tasks) {
    try {
      // Check if file exists and has content
      if (!fs.existsSync(task.taskPath)) {
        console.warn(`❌ Task file not found: ${task.taskPath}`);
        invalidCount++;
        continue;
      }

      const content = fs.readFileSync(task.taskPath, 'utf8');

      // Basic validation
      const hasRequiredSections = [
        content.includes('id:'),
        content.includes('title:'),
        content.includes('status:'),
        content.includes('priority:'),
        content.includes('type:'),
        content.includes('created:'),
        content.includes('updated:'),
        content.includes('owner:'),
        content.includes('branch:'),
        content.includes('allowed-tools:'),
        content.includes('# Objective'),
        content.includes('## Context'),
        content.includes('## Tech Stack'),
        content.includes('## Acceptance Criteria'),
        content.includes('## Implementation Plan'),
        content.includes('## Commands'),
        content.includes('## Code Style'),
        content.includes('## Boundaries'),
        content.includes('## Success Verification'),
        content.includes('## Edge Cases'),
        content.includes('## Out of Scope'),
        content.includes('## References'),
      ].every(Boolean);

      if (hasRequiredSections) {
        validCount++;
      } else {
        console.warn(`❌ Invalid task structure: ${task.taskFileName}`);
        invalidCount++;
      }
    } catch (error) {
      console.warn(`❌ Error validating task ${task.taskFileName}:`, error.message);
      invalidCount++;
    }
  }

  console.log(`\n✅ Validation complete: ${validCount} valid, ${invalidCount} invalid`);
  return { validCount, invalidCount };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Multi-Agent Task Generator Started');
  console.log(`📁 Domains Directory: ${CONFIG.domainsDir}`);
  console.log(`📁 Tasks Directory: ${CONFIG.tasksDir}`);

  // Check if directories exist
  if (!fs.existsSync(CONFIG.domainsDir)) {
    console.error('❌ Domains directory not found:', CONFIG.domainsDir);
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG.tasksDir)) {
    console.log('📁 Creating tasks directory...');
    fs.mkdirSync(CONFIG.tasksDir, { recursive: true });
  }

  // Get remaining domains
  const allDomains = Array.from({ length: 36 }, (_, i) => i + 1);
  const completedDomains = DOMAIN_CATEGORIES.foundation;
  const remainingDomains = allDomains.filter((d) => !completedDomains.includes(d));

  console.log(`\n📊 Domain Status:`);
  console.log(`✅ Completed Domains: ${completedDomains.length}/36`);
  console.log(`🔄 Remaining Domains: ${remainingDomains.length}/36`);

  // Process domains by category
  const categories = [
    {
      name: 'businessLogic',
      domains: remainingDomains.filter((d) => DOMAIN_CATEGORIES.businessLogic.includes(d)),
    },
    {
      name: 'integrations',
      domains: remainingDomains.filter((d) => DOMAIN_CATEGORIES.integrations.includes(d)),
    },
    {
      name: 'advanced',
      domains: remainingDomains.filter((d) => DOMAIN_CATEGORIES.advanced.includes(d)),
    },
  ];

  const allTasks = [];
  const allValidationResults = [];

  for (const category of categories) {
    if (category.domains.length === 0) {
      console.log(`\n⏭️ No domains in ${category.name} category`);
      continue;
    }

    // Split domains into batches
    const batches = [];
    for (let i = 0; i < category.domains.length; i += CONFIG.batchSize) {
      batches.push(category.domains.slice(i, i + CONFIG.batchSize));
    }

    console.log(`\n📋 Processing ${category.name} category (${batches.length} batches)`);

    for (const batch of batches) {
      const tasks = await processBatch(batch, category.name);
      const validation = validateTasks(tasks);

      allTasks.push(...tasks);
      allValidationResults.push({ category: category.name, ...validation });

      // Brief pause between batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Final summary
  console.log('\n🎉 Multi-Agent Task Generation Complete!');
  console.log(`\n📊 Summary:`);
  console.log(`✅ Total Tasks Created: ${allTasks.length}`);
  console.log(
    `✅ Total Valid Tasks: ${allValidationResults.reduce((sum, r) => sum + r.validCount, 0)}`
  );
  console.log(
    `❌ Invalid Tasks: ${allValidationResults.reduce((sum, r) => sum + r.invalidCount, 0)}`
  );

  // Validation summary by category
  console.log(`\n📋 Validation Summary by Category:`);
  for (const result of allValidationResults) {
    console.log(
      `✅ ${result.category}: ${result.validCount} valid, ${result.invalidCount} invalid`
    );
  }

  // Output task list
  const taskList = allTasks.map((task) => `- ${task.taskFileName.replace('.md', '')}`).join('\n');
  const taskListPath = path.join(__dirname, '../tasks/TASKS-GENERATED.md');
  fs.writeFileSync(taskListPath, `# Generated Tasks\n\n${taskList}`);

  console.log(`\n📝 Task list saved to: ${taskListPath}`);
  console.log(`\n🎯 Ready for implementation!`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  processBatch,
  researchDomain,
  generateTask,
  validateTasks,
  main,
};
