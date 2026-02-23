#!/usr/bin/env node

/**
 * Batch Executor for Multi-Agent Task Creation
 * Executes optimized batches with parallel processing and quality validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  domainsDir: path.join(__dirname, '../docs/plan'),
  tasksDir: path.join(__dirname, '../tasks'),
  templatePath: path.join(__dirname, '../tasks/template.md'),
  maxConcurrent: 4,
  batchSize: 3,
  researchDelay: 1000, // ms between research calls
};

/**
 * Web search simulation (replace with actual search implementation)
 */
async function webSearch(query) {
  // Simulate web search with delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock research data
  return {
    query,
    results: [
      {
        title: `${query} - Official Documentation 2026`,
        url: `https://example.com/docs/${query.replace(/\s+/g, '-')}`,
        snippet: `Latest 2026 standards and best practices for ${query}`,
        authority: 'official',
      },
      {
        title: `${query} Implementation Guide`,
        url: `https://example.com/guides/${query.replace(/\s+/g, '-')}`,
        snippet: `Comprehensive implementation guide with code examples`,
        authority: 'community',
      },
      {
        title: `${query} Patterns and Architecture`,
        url: `https://example.com/patterns/${query.replace(/\s+/g, '-')}`,
        snippet: `Advanced patterns and architectural considerations`,
        authority: 'expert',
      },
    ],
  };
}

/**
 * Research domain with multiple queries
 */
async function researchDomain(domainNumber, domainFiles) {
  console.log(`🔍 Researching Domain ${domainNumber}...`);

  const researchData = {
    domainNumber,
    timestamp: new Date().toISOString(),
    queries: [],
    results: {},
    summary: {},
  };

  // Generate research queries based on domain files
  const queries = [
    `domain ${domainNumber} implementation 2026`,
    `domain ${domainNumber} best practices`,
    `domain ${domainNumber} architecture patterns`,
    `domain ${domainNumber} security considerations`,
    `domain ${domainNumber} performance optimization`,
  ];

  // Execute research queries in parallel
  const researchPromises = queries.map(async (query, index) => {
    await new Promise((resolve) => setTimeout(resolve, index * CONFIG.researchDelay));
    const results = await webSearch(query);

    researchData.queries.push(query);
    researchData.results[query] = results;

    return results;
  });

  await Promise.all(researchPromises);

  // Generate summary
  researchData.summary = {
    totalQueries: queries.length,
    totalResults: Object.values(researchData.results).reduce(
      (sum, results) => sum + results.length,
      0
    ),
    keyTopics: Object.keys(researchData.results).map((query) => query.replace(/domain \d+ /i, '')),
    researchTime: new Date().toISOString(),
  };

  console.log(
    `✅ Research complete for Domain ${domainNumber}: ${researchData.summary.totalResults} results`
  );
  return researchData;
}

/**
 * Generate task content from template and research
 */
function generateTaskContent(domainFile, research, template) {
  const { title, description, topics } = domainFile;
  const domainNumber = research.domainNumber;
  const sectionNumber = domainFile.file.split('-')[1];

  // Extract key research insights
  const researchInsights = Object.values(research.results)
    .flat()
    .slice(0, 3)
    .map((result) => result.snippet)
    .join('. ');

  const taskContent = template
    .replace(/{{DOMAIN_NUMBER}}/g, domainNumber)
    .replace(/{{SECTION_NUMBER}}/g, sectionNumber)
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, description)
    .replace(/{{TOPICS}}/g, topics.join(', '))
    .replace(/{{RESEARCH_INSIGHTS}}/g, researchInsights)
    .replace(/{{RESEARCH_DATA}}/g, JSON.stringify(research.summary, null, 2))
    .replace(/{{CURRENT_DATE}}/g, new Date().toISOString().split('T')[0])
    .replace(/{{DOMAIN_FILES}}/g, JSON.stringify(research.domainFiles, null, 2));

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
    .map((file) => {
      const filePath = path.join(domainDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      return {
        file,
        title:
          lines
            .find((line) => line.startsWith('# '))
            ?.substring(2)
            .trim() || '',
        description:
          lines
            .find((line) => line.startsWith('## Overview'))
            ?.substring(12)
            .trim() || '',
        topics: extractTopics(content),
        content,
      };
    });

  if (domainFiles.length === 0) {
    console.warn(`⚠️ No files found in Domain ${domainNumber}`);
    return { domainNumber, success: false, error: 'No files found' };
  }

  // Research domain
  const research = await researchDomain(domainNumber, domainFiles);
  research.domainFiles = domainFiles.map((f) => f.file);

  // Read template
  const template = fs.readFileSync(CONFIG.templatePath, 'utf8');

  // Create tasks directory
  const taskDir = path.join(CONFIG.tasksDir, `domain-${domainNumber}`);
  if (!fs.existsSync(taskDir)) {
    fs.mkdirSync(taskDir, { recursive: true });
  }

  // Generate tasks
  const tasks = [];
  const validationResults = [];

  for (const domainFile of domainFiles) {
    const sectionNumber = domainFile.file.split('-')[1];
    const taskFileName = `DOMAIN-${domainNumber}-${sectionNumber}-${domainFile.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}.md`;
    const taskPath = path.join(taskDir, taskFileName);

    // Generate task content
    const taskContent = generateTaskContent(domainFile, research, template);

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
    research,
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
  console.log('🚀 Batch Executor Started');
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

  // Process batches
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

  const reportPath = path.join(__dirname, '../execution-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Execution report saved to: ${reportPath}`);
  console.log(`\n🎯 Ready for implementation!`);
}

/**
 * Extract topics from content
 */
function extractTopics(content) {
  const topics = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.startsWith('#### Key Topics:')) {
      const topicsLine = line.substring(18).trim();
      const topicList = topicsLine.split(',').map((t) => t.trim());
      topics.push(...topicList);
    }
  }

  return topics;
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
