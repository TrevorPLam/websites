/**
 * @file scripts/generate-todo-enhanced.js
 * @summary Enhanced TODO.md generator with comprehensive analysis.
 * @description Generates detailed TODO.md with task analysis and progress tracking.
 * @security none
 * @adr none
 * @requirements TASKS-MANAGEMENT
 */

#!/usr/bin/env node

/**
 * Enhanced TODO.md Generator
 *
 * Automatically generates MDTM-compliant TODO.md with enterprise patterns
 * by extracting information from TASKS.md and repository analysis
 *
 * Usage: node scripts/generate-todo-enhanced.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputFile: path.join(__dirname, '../TASKS.md'),
  outputFile: path.join(__dirname, '../TODO.md'),
  templateFile: path.join(__dirname, '../TODO-ENHANCED.md'),
  packagesDir: path.join(__dirname, '../packages'),
  appsDir: path.join(__dirname, '../apps'),
  domainsDir: path.join(__dirname, '../tasks/domain-'),
};

// Task templates
const TASK_TEMPLATE = `---
type: task
id: {id}
title: {title}
status: {status}
priority: {priority}
domain: {domain}
effort: {effort}
complexity: {complexity}
risk: {risk}
assignee: {assignee}
reviewer: {reviewer}
dependencies: [{dependencies}]
blocked_by: [{blocked_by}]
tags: [{tags}]
created: {created}
updated: {updated}
due: {due}
start_date: {start_date}
completion_date: {completion_date}
definition_of_done:
{definition_of_done}
acceptance_criteria:
{acceptance_criteria}
---

# Task Description

## Acceptance Criteria
{acceptance_criteria_checklist}

## Implementation Notes
{implementation_notes}

## Subtasks
{subtasks}
`;

// Domain mappings
const DOMAIN_MAPPINGS = {
  'design-system': 'Design System',
  'performance': 'Performance Engineering',
  'security': 'Security & Infrastructure',
  'infrastructure': 'Security & Infrastructure',
  'internationalization': 'Internationalization & Accessibility',
  'accessibility': 'Internationalization & Accessibility',
  'operations': 'Production Operations',
  'feature-flags': 'Feature Flags & Analytics',
  'analytics': 'Feature Flags & Analytics',
  'api': 'API & Integration Management',
  'integration': 'API & Integration Management',
  'cms': 'Content Management & CMS',
  'content': 'Content Management & CMS',
  'seo': 'SEO & Search Optimization',
  'email': 'Email & Communication Systems',
  'communication': 'Email & Communication Systems',
  'advanced-security': 'Advanced Security',
  'developer-experience': 'Developer Experience',
  'advanced-features': 'Advanced Features',
  'documentation': 'Documentation & Training',
};

// Priority mappings
const PRIORITY_MAPPINGS = {
  'P0': 'Critical',
  'P1': 'High Priority',
  'P2': 'Medium Priority',
  'P3': 'Low Priority',
};

// Status mappings
const STATUS_MAPPINGS = {
  '🟡 To Do': '🟡 To Do',
  '🔵 In Progress': '🔵 In Progress',
  '🟣 Review': '🟣 Review',
  '🟢 Done': '🟢 Done',
  '🚧 Blocked': '🚧 Blocked',
  '🧊 Archived': '🧊 Archived',
};

class TodoEnhancedGenerator {
  constructor() {
    this.tasks = [];
    this.domains = new Map();
    this.packages = new Map();
    this.apps = new Map();
  }

  async run() {
    console.log('🚀 Starting Enhanced TODO.md Generation...');

    try {
      // 1. Parse existing TASKS.md
      await this.parseTasksMd();

      // 2. Scan repository structure
      await this.scanRepository();

      // 3. Extract domain tasks
      await this.extractDomainTasks();

      // 4. Generate enhanced TODO.md
      await this.generateEnhancedTodo();

      console.log('✅ Enhanced TODO.md generated successfully!');
    } catch (error) {
      console.error('❌ Error generating enhanced TODO.md:', error);
      process.exit(1);
    }
  }

  async parseTasksMd() {
    console.log('📖 Parsing TASKS.md...');

    const content = fs.readFileSync(CONFIG.inputFile, 'utf8');
    const lines = content.split('\n');

    let currentTask = null;
    let inTask = false;
    let taskNumber = 1;

    for (const line of lines) {
      // Detect task start
      if (line.match(/^\*\*\[x\]\s+Task\s+\d+:/)) {
        if (currentTask) {
          this.tasks.push(currentTask);
        }

        currentTask = {
          id: `TASK-${taskNumber.toString().padStart(3, '0')}`,
          title: this.extractTaskTitle(line),
          status: line.includes('[x]') ? '🟢 Done' : '🟡 To Do',
          priority: this.extractPriority(line),
          domain: this.extractDomain(line),
          effort: this.extractEffort(line),
          complexity: 'medium',
          risk: 'medium',
          assignee: '@team',
          reviewer: '@tech-lead',
          dependencies: [],
          blocked_by: [],
          tags: [],
          created: new Date().toISOString().split('T')[0],
          updated: new Date().toISOString().split('T')[0],
          due: this.calculateDueDate(line),
          start_date: new Date().toISOString().split('T')[0],
          completion_date: line.includes('[x]') ? new Date().toISOString().split('T')[0] : '',
          definition_of_done: [],
          acceptance_criteria: [],
          implementation_notes: '',
          subtasks: [],
          targeted_files: [],
          strategic_objective: '',
        };

        inTask = true;
        taskNumber++;
        continue;
      }

      // Extract task details
      if (inTask && currentTask) {
        if (line.startsWith('Strategic Objective:')) {
          currentTask.strategic_objective = line.replace('Strategic Objective:', '').trim();
        } else if (line.startsWith('Targeted Files:')) {
          currentTask.targeted_files_section = true;
        } else if (line.startsWith('• [x]') || line.startsWith('• [ ]')) {
          if (currentTask.targeted_files_section) {
            const file = line.replace(/• \[[x ]\]\s*/, '').trim();
            currentTask.targeted_files.push(file);
          }
        } else if (line.startsWith('Dependencies:')) {
          currentTask.dependencies_section = true;
        } else if (line.startsWith('Advanced Code Patterns:')) {
          currentTask.advanced_patterns_section = true;
        } else if (line.startsWith('Sub-tasks:')) {
          currentTask.subtasks_section = true;
        } else if (currentTask.subtasks_section && line.startsWith('• [x]') || line.startsWith('• [ ]')) {
          const subtask = line.replace(/• \[[x ]\]\s*/, '').trim();
          currentTask.subtasks.push(subtask);
        }
      }
    }

    if (currentTask) {
      this.tasks.push(currentTask);
    }

    console.log(`✅ Parsed ${this.tasks.length} tasks from TASKS.md`);
  }

  async scanRepository() {
    console.log('🔍 Scanning repository structure...');

    // Scan packages
    if (fs.existsSync(CONFIG.packagesDir)) {
      const packages = fs.readdirSync(CONFIG.packagesDir);
      for (const pkg of packages) {
        const pkgPath = path.join(CONFIG.packagesDir, pkg);
        if (fs.statSync(pkgPath).isDirectory()) {
          this.packages.set(pkg, {
            name: pkg,
            path: pkgPath,
            type: 'package',
          });
        }
      }
    }

    // Scan apps
    if (fs.existsSync(CONFIG.appsDir)) {
      const apps = fs.readdirSync(CONFIG.appsDir);
      for (const app of apps) {
        const appPath = path.join(CONFIG.appsDir, app);
        if (fs.statSync(appPath).isDirectory()) {
          this.apps.set(app, {
            name: app,
            path: appPath,
            type: 'app',
          });
        }
      }
    }

    console.log(`✅ Found ${this.packages.size} packages and ${this.apps.size} apps`);
  }

  async extractDomainTasks() {
    console.log('📂 Extracting domain-specific tasks...');

    if (fs.existsSync(CONFIG.domainsDir)) {
      const domains = fs.readdirSync(CONFIG.domainsDir);

      for (const domain of domains) {
        const domainPath = path.join(CONFIG.domainsDir, domain);
        if (fs.statSync(domainPath).isDirectory()) {
          const files = fs.readdirSync(domainPath);
          const domainTasks = files.filter(f => f.endsWith('.md'));

          this.domains.set(domain, {
            name: domain,
            path: domainPath,
            tasks: domainTasks,
          });

          // Parse domain task files
          for (const taskFile of domainTasks) {
            await this.parseDomainTask(domain, taskFile);
          }
        }
      }
    }

    console.log(`✅ Extracted tasks from ${this.domains.size} domains`);
  }

  async parseDomainTask(domain, filename) {
    const filePath = path.join(CONFIG.domainsDir, domain, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract task ID from filename
    const taskId = filename.replace('.md', '').toUpperCase();

    // Extract task details from content
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : taskId;

    const priorityMatch = content.match(/\*\*Priority\*\*:\s*(.+)$/m);
    const priority = priorityMatch ? priorityMatch[1] : 'P2';

    const impactMatch = content.match(/\*\*Impact\*\*:\s*(.+)$/m);
    const impact = impactMatch ? impactMatch[1] : 'Medium';

    // Extract objectives
    const objectivesMatch = content.match(/##\s+Objectives\s*\n([\s\S]*?)(?=##|$)/m);
    const objectives = objectivesMatch ? objectivesMatch[1].trim() : '';

    // Extract targeted files
    const filesMatch = content.match(/##\s+Targeted Files\s*\n([\s\S]*?)(?=##|$)/m);
    const files = filesMatch ? filesMatch[1].trim() : '';

    const task = {
      id: taskId,
      title: title,
      status: '🟡 To Do',
      priority: priority,
      domain: this.mapDomain(domain),
      effort: this.estimateEffort(priority, impact),
      complexity: this.estimateComplexity(priority, impact),
      risk: this.assessRisk(domain, priority),
      assignee: this.assignTeam(domain),
      reviewer: '@tech-lead',
      dependencies: [],
      blocked_by: [],
      tags: this.generateTags(domain, title),
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      due: this.calculateDueDateFromPriority(priority),
      start_date: new Date().toISOString().split('T')[0],
      completion_date: '',
      definition_of_done: this.generateDefinitionOfDone(domain),
      acceptance_criteria: this.generateAcceptanceCriteria(objectives),
      implementation_notes: '',
      subtasks: this.generateSubtasks(files),
      targeted_files: this.extractTargetedFiles(files),
      strategic_objective: objectives,
    };

    this.tasks.push(task);
  }

  async generateEnhancedTodo() {
    console.log('📝 Generating enhanced TODO.md...');

    // Read template
    const template = fs.readFileSync(CONFIG.templateFile, 'utf8');

    // Generate tasks by priority
    const criticalTasks = this.tasks.filter(t => t.priority === 'P0');
    const highTasks = this.tasks.filter(t => t.priority === 'P1');
    const mediumTasks = this.tasks.filter(t => t.priority === 'P2');
    const lowTasks = this.tasks.filter(t => t.priority === 'P3');

    // Group tasks by domain
    const tasksByDomain = this.groupTasksByDomain();

    // Generate markdown content
    let content = template;

    // Replace task sections
    content = this.replaceTaskSection(content, 'Critical Issues (P0)', criticalTasks);
    content = this.replaceTaskSection(content, 'High Priority (P1)', highTasks);
    content = this.replaceTaskSection(content, 'Medium Priority (P2)', mediumTasks);
    content = this.replaceTaskSection(content, 'Low Priority (P3)', lowTasks);

    // Update progress tracking
    content = this.updateProgressTracking(content);

    // Write output
    fs.writeFileSync(CONFIG.outputFile, content);

    console.log('✅ Enhanced TODO.md written successfully!');
  }

  replaceTaskSection(content, sectionTitle, tasks) {
    const sectionStart = content.indexOf(`## ${sectionTitle}`);
    if (sectionStart === -1) return content;

    const sectionEnd = content.indexOf('\n---', sectionStart);
    if (sectionEnd === -1) return content;

    const beforeSection = content.substring(0, sectionStart);
    const afterSection = content.substring(sectionEnd);

    const tasksMarkdown = tasks.map(task => this.generateTaskMarkdown(task)).join('\n\n');

    return beforeSection + `## ${sectionTitle}\n\n${tasksMarkdown}\n` + afterSection;
  }

  generateTaskMarkdown(task) {
    const metadata = [
      `type: task`,
      `id: ${task.id}`,
      `title: ${task.title}`,
      `status: ${task.status}`,
      `priority: ${task.priority}`,
      `domain: ${task.domain}`,
      `effort: ${task.effort}`,
      `complexity: ${task.complexity}`,
      `risk: ${task.risk}`,
      `assignee: ${task.assignee}`,
      `reviewer: ${task.reviewer}`,
      `dependencies: [${task.dependencies.join(', ')}]`,
      `blocked_by: [${task.blocked_by.join(', ')}]`,
      `tags: [${task.tags.join(', ')}]`,
      `created: ${task.created}`,
      `updated: ${task.updated}`,
      `due: ${task.due}`,
      `start_date: ${task.start_date}`,
      `completion_date: ${task.completion_date}`,
      `definition_of_done:`,
      ...task.definition_of_done.map(dod => `  - ${dod}`),
      `acceptance_criteria:`,
      ...task.acceptance_criteria.map(ac => `  - ${ac}`),
    ];

    const metadataYaml = metadata.join('\n');

    const content = [
      '---',
      metadataYaml,
      '---',
      '',
      '# Task Description',
      '',
      '## Acceptance Criteria',
      ...task.acceptance_criteria.map(ac => `- [ ] ${ac}`),
      '',
      '## Implementation Notes',
      task.implementation_notes || 'Implementation details to be added.',
      '',
      '## Subtasks',
      ...task.subtasks.map(st => `- [ ] ${st}`),
    ];

    return content.join('\n');
  }

  updateProgressTracking(content) {
    // Update status overview
    const criticalCount = this.tasks.filter(t => t.priority === 'P0').length;
    const highCount = this.tasks.filter(t => t.priority === 'P1').length;
    const mediumCount = this.tasks.filter(t => t.priority === 'P2').length;
    const lowCount = this.tasks.filter(t => t.priority === 'P3').length;
    const totalTasks = this.tasks.length;

    const completedCount = this.tasks.filter(t => t.status === '🟢 Done').length;
    const inProgressCount = this.tasks.filter(t => t.status === '🔵 In Progress').length;
    const blockedCount = this.tasks.filter(t => t.status === '🚧 Blocked').length;

    const completionRate = Math.round((completedCount / totalTasks) * 100);

    // Update the table
    const tablePattern = /\| Category \| Total Tasks \| Completed \| In Progress \| Blocked \| Completion Rate \|\n\|----------\|-------------\|-----------\|-------------\|---------\|----------------\|[\s\S]*?\| \*\*Total\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+%\*\* \|/;

    const newTable = `| Category | Total Tasks | Completed | In Progress | Blocked | Completion Rate |
|----------|-------------|-----------|-------------|---------|----------------|
| Critical (P0) | ${criticalCount} | ${completedCount} | ${inProgressCount} | ${blockedCount} | ${completionRate}% |
| High Priority (P1) | ${highCount} | 0 | 0 | ${highCount} | 0% |
| Medium Priority (P2) | ${mediumCount} | 0 | 0 | ${mediumCount} | 0% |
| Low Priority (P3) | ${lowCount} | 0 | 0 | ${lowCount} | 0% |
| **Total** | **${totalTasks}** | **${completedCount}** | **${inProgressCount}** | **${blockedCount}** | **${completionRate}%** |`;

    return content.replace(tablePattern, newTable);
  }

  // Helper methods
  extractTaskTitle(line) {
    const match = line.match(/^\*\*\[x\]\s+Task\s+\d+:\s+(.+)$/);
    return match ? match[1] : 'Unknown Task';
  }

  extractPriority(line) {
    if (line.includes('Critical') || line.includes('P0')) return 'P0';
    if (line.includes('High') || line.includes('P1')) return 'P1';
    if (line.includes('Medium') || line.includes('P2')) return 'P2';
    if (line.includes('Low') || line.includes('P3')) return 'P3';
    return 'P2';
  }

  extractDomain(line) {
    const title = this.extractTaskTitle(line).toLowerCase();

    if (title.includes('security') || title.includes('infrastructure')) return 'security';
    if (title.includes('design') || title.includes('ui')) return 'design-system';
    if (title.includes('performance')) return 'performance';
    if (title.includes('internationalization') || title.includes('i18n')) return 'internationalization';
    if (title.includes('accessibility') || title.includes('a11y')) return 'accessibility';
    if (title.includes('operations') || title.includes('ops')) return 'operations';
    if (title.includes('feature') || title.includes('flag')) return 'feature-flags';
    if (title.includes('analytics')) return 'analytics';
    if (title.includes('api') || title.includes('integration')) return 'api';
    if (title.includes('cms') || title.includes('content')) return 'cms';
    if (title.includes('seo')) return 'seo';
    if (title.includes('email')) return 'email';

    return 'general';
  }

  extractEffort(line) {
    // Simple estimation based on task complexity
    if (line.includes('Foundation') || line.includes('Database')) return '5d';
    if (line.includes('Infrastructure') || line.includes('Security')) return '3d';
    if (line.includes('UI') || line.includes('Design')) return '2d';
    return '1d';
  }

  calculateDueDate(line) {
    const priority = this.extractPriority(line);
    return this.calculateDueDateFromPriority(priority);
  }

  calculateDueDateFromPriority(priority) {
    const now = new Date();
    let daysToAdd = 7; // Default for P2

    switch (priority) {
      case 'P0': daysToAdd = 3; break;
      case 'P1': daysToAdd = 7; break;
      case 'P2': daysToAdd = 14; break;
      case 'P3': daysToAdd = 21; break;
    }

    const dueDate = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return dueDate.toISOString().split('T')[0];
  }

  mapDomain(domain) {
    return DOMAIN_MAPPINGS[domain] || domain;
  }

  estimateEffort(priority, impact) {
    const baseEffort = {
      'P0': '2d',
      'P1': '3d',
      'P2': '5d',
      'P3': '7d',
    };

    return baseEffort[priority] || '3d';
  }

  estimateComplexity(priority, impact) {
    if (priority === 'P0') return 'high';
    if (priority === 'P1') return 'medium';
    return 'low';
  }

  assessRisk(domain, priority) {
    const highRiskDomains = ['security', 'infrastructure', 'database'];
    if (highRiskDomains.includes(domain) && priority === 'P0') return 'critical';
    if (highRiskDomains.includes(domain)) return 'high';
    return 'medium';
  }

  assignTeam(domain) {
    const teamMappings = {
      'security': '@security-team',
      'design-system': '@ui-team',
      'performance': '@performance-team',
      'internationalization': '@i18n-team',
      'accessibility': '@a11y-team',
      'operations': '@ops-team',
      'feature-flags': '@feature-team',
      'analytics': '@analytics-team',
      'api': '@api-team',
      'cms': '@content-team',
      'seo': '@seo-team',
      'email': '@email-team',
    };

    return teamMappings[domain] || '@team';
  }

  generateTags(domain, title) {
    const tags = [domain];

    // Add specific tags based on title
    if (title.toLowerCase().includes('security')) tags.push('security');
    if (title.toLowerCase().includes('performance')) tags.push('performance');
    if (title.toLowerCase().includes('accessibility')) tags.push('a11y');
    if (title.toLowerCase().includes('internationalization')) tags.push('i18n');

    return tags;
  }

  generateDefinitionOfDone(domain) {
    const baseDOD = [
      'Implementation complete',
      'Tests passing',
      'Code review approved',
      'Documentation updated',
    ];

    const domainSpecific = {
      'security': ['Security audit passed', 'No vulnerabilities'],
      'performance': ['Performance benchmarks met', 'Core Web Vitals optimized'],
      'accessibility': ['WCAG 2.2 AA compliant', 'Screen reader tested'],
      'internationalization': ['RTL support verified', 'Localization tested'],
    };

    return [...baseDOD, ...(domainSpecific[domain] || [])];
  }

  generateAcceptanceCriteria(objectives) {
    if (!objectives) return ['Task completed successfully'];

    // Extract bullet points from objectives
    const criteria = objectives
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0);

    return criteria.length > 0 ? criteria : ['Task completed successfully'];
  }

  generateSubtasks(files) {
    if (!files) return [];

    return files
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  extractTargetedFiles(files) {
    if (!files) return [];

    return files
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  groupTasksByDomain() {
    const grouped = {};

    for (const task of this.tasks) {
      if (!grouped[task.domain]) {
        grouped[task.domain] = [];
      }
      grouped[task.domain].push(task);
    }

    return grouped;
  }
}

// Run the generator
if (require.main === module) {
  const generator = new TodoEnhancedGenerator();
  generator.run();
}

module.exports = TodoEnhancedGenerator;
