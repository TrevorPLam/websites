/**
 * @file scripts/analyze-task-progress.js
 * @summary Analyzes and reports on task progress across domains.
 * @description Provides detailed analysis of completed vs pending tasks with metrics.
 * @security none
 * @adr none
 * @requirements TASKS-MANAGEMENT
 */

#!/usr/bin/env node

/**
 * Task Progress Analyzer
 *
 * Analyzes TODO.md and generates insights for AI task management
 *
 * Usage: node scripts/analyze-task-progress.js --type=status|dependencies|blockers|progress
 */

const fs = require('fs');
const path = require('path');

class TaskProgressAnalyzer {
  constructor() {
    this.tasks = [];
    this.analysis = {
      total_tasks: 0,
      completed: 0,
      in_progress: 0,
      blocked: 0,
      completion_rate: 0,
      critical_issues: [],
      new_tasks_this_week: 0,
      completed_this_week: 0,
      blockers_resolved: 0,
      recommendations: [],
      total_dependencies: 0,
      circular_dependencies: 0,
      blocked_by_dependencies: 0,
      critical_dependencies: [],
      resolution_suggestions: [],
      total_blockers: 0,
      critical_blockers: 0,
      avg_blocker_duration: 0,
      resolution_actions: [],
    };
  }

  async run() {
    const args = process.argv.slice(2);
    const type = this.getArgValue(args, '--type', 'status');

    console.log(`🔍 Analyzing task progress - Type: ${type}`);

    try {
      await this.parseTodoMd();

      switch (type) {
        case 'status':
          await this.analyzeStatus();
          break;
        case 'dependencies':
          await this.analyzeDependencies();
          break;
        case 'blockers':
          await this.analyzeBlockers();
          break;
        case 'progress':
          await this.analyzeProgress();
          break;
        default:
          console.error(`Unknown analysis type: ${type}`);
          process.exit(1);
      }

      await this.saveAnalysis();
      console.log('✅ Task analysis completed!');

    } catch (error) {
      console.error('❌ Error analyzing tasks:', error);
      process.exit(1);
    }
  }

  async parseTodoMd() {
    const todoPath = path.join(__dirname, '../TODO.md');
    const content = fs.readFileSync(todoPath, 'utf8');

    // Parse tasks from TODO.md using MDTM format
    const taskBlocks = content.split(/---\n/g);

    for (const block of taskBlocks) {
      if (block.includes('type: task')) {
        const task = this.parseMDTMTaskBlock(block);
        if (task) {
          this.tasks.push(task);
        }
      }
    }

    this.analysis.total_tasks = this.tasks.length;
    console.log(`📊 Parsed ${this.tasks.length} tasks from TODO.md`);
  }

  parseMDTMTaskBlock(block) {
    const lines = block.split('\n');
    const task = {};

    for (const line of lines) {
      if (line.startsWith('id:')) {
        task.id = line.replace('id:', '').trim();
      } else if (line.startsWith('title:')) {
        task.title = line.replace('title:', '').trim();
      } else if (line.startsWith('status:')) {
        task.status = line.replace('status:', '').trim();
      } else if (line.startsWith('priority:')) {
        task.priority = line.replace('priority:', '').trim();
      } else if (line.startsWith('domain:')) {
        task.domain = line.replace('domain:', '').trim();
      } else if (line.startsWith('effort:')) {
        task.effort = line.replace('effort:', '').trim();
      } else if (line.startsWith('complexity:')) {
        task.complexity = line.replace('complexity:', '').trim();
      } else if (line.startsWith('risk:')) {
        task.risk = line.replace('risk:', '').trim();
      } else if (line.startsWith('assignee:')) {
        task.assignee = line.replace('assignee:', '').trim();
      } else if (line.startsWith('reviewer:')) {
        task.reviewer = line.replace('reviewer:', '').trim();
      } else if (line.startsWith('dependencies:')) {
        const deps = line.replace('dependencies:', '').trim();
        task.dependencies = deps === '[]' ? [] : deps.slice(1, -1).split(', ').map(d => d.trim());
      } else if (line.startsWith('blocked_by:')) {
        const blocked = line.replace('blocked_by:', '').trim();
        task.blocked_by = blocked === '[]' ? [] : blocked.slice(1, -1).split(', ').map(b => b.trim());
      } else if (line.startsWith('tags:')) {
        const tags = line.replace('tags:', '').trim();
        task.tags = tags === '[]' ? [] : tags.slice(1, -1).split(', ').map(t => t.trim());
      } else if (line.startsWith('due:')) {
        task.due = line.replace('due:', '').trim();
      } else if (line.startsWith('completion_date:')) {
        task.completion_date = line.replace('completion_date:', '').trim();
      }
    }

    return task.id ? task : null;
  }

  async analyzeStatus() {
    console.log('📈 Analyzing task status...');

    // Count tasks by status
    this.analysis.completed = this.tasks.filter(t => t.status === '🟢 Done').length;
    this.analysis.in_progress = this.tasks.filter(t => t.status === '🔵 In Progress').length;
    this.analysis.blocked = this.tasks.filter(t => t.status === '🚧 Blocked').length;

    this.analysis.completion_rate = Math.round((this.analysis.completed / this.analysis.total_tasks) * 100);

    // Identify critical issues (P0 tasks not completed)
    this.analysis.critical_issues = this.tasks
      .filter(t => t.priority === 'P0' && t.status !== '🟢 Done')
      .map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority
      }));

    // Generate recommendations
    this.analysis.recommendations = this.generateStatusRecommendations();

    // Simulate weekly metrics (in real implementation, this would use git history)
    this.analysis.new_tasks_this_week = Math.floor(Math.random() * 5) + 1;
    this.analysis.completed_this_week = Math.floor(Math.random() * 3) + 1;
    this.analysis.blockers_resolved = Math.floor(Math.random() * 2);

    console.log(`✅ Status analysis complete - ${this.analysis.completion_rate}% completion rate`);
  }

  async analyzeDependencies() {
    console.log('🔗 Analyzing task dependencies...');

    // Count total dependencies
    this.analysis.total_dependencies = this.tasks.reduce((sum, task) => sum + task.dependencies.length, 0);

    // Find circular dependencies
    this.analysis.circular_dependencies = this.detectCircularDependencies();

    // Count blocked tasks
    this.analysis.blocked_by_dependencies = this.tasks.filter(t => t.dependencies.length > 0).length;

    // Identify critical dependencies
    this.analysis.critical_dependencies = this.identifyCriticalDependencies();

    // Generate resolution suggestions
    this.analysis.resolution_suggestions = this.generateDependencySuggestions();

    console.log(`✅ Dependencies analysis complete - ${this.analysis.total_dependencies} total dependencies`);
  }

  async analyzeBlockers() {
    console.log('🚧 Analyzing task blockers...');

    // Count blocked tasks
    const blockedTasks = this.tasks.filter(t => t.blocked_by.length > 0);
    this.analysis.total_blockers = blockedTasks.length;

    // Identify critical blockers
    this.analysis.critical_blockers = blockedTasks
      .filter(t => t.priority === 'P0')
      .map(t => ({
        task: t.id,
        blocked_by: t.blocked_by.join(', '),
        duration: this.calculateBlockerDuration(t)
      }));

    // Calculate average blocker duration
    const durations = blockedTasks.map(t => this.calculateBlockerDuration(t));
    this.analysis.avg_blocker_duration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    // Generate resolution actions
    this.analysis.resolution_actions = this.generateBlockerActions();

    console.log(`✅ Blockers analysis complete - ${this.analysis.total_blockers} blocked tasks`);
  }

  async analyzeProgress() {
    console.log('📊 Analyzing overall progress...');

    // Combine all analyses
    await this.analyzeStatus();
    await this.analyzeDependencies();
    await this.analyzeBlockers();

    // Add progress-specific metrics
    this.analysis.velocity = this.calculateVelocity();
    this.analysis.cycle_time = this.calculateCycleTime();
    this.analysis.burndown = this.calculateBurndown();

    console.log(`✅ Progress analysis complete`);
  }

  detectCircularDependencies() {
    const circular = [];
    const visited = new Set();
    const recursionStack = new Set();

    for (const task of this.tasks) {
      if (!visited.has(task.id)) {
        const cycle = this.detectCycle(task, visited, recursionStack, new Map());
        if (cycle.length > 0) {
          circular.push(cycle);
        }
      }
    }

    return circular.length;
  }

  detectCycle(task, visited, recursionStack, parentMap) {
    visited.add(task.id);
    recursionStack.add(task.id);

    for (const depId of task.dependencies) {
      const depTask = this.tasks.find(t => t.id === depId);
      if (!depTask) continue;

      parentMap.set(depId, task.id);

      if (recursionStack.has(depId)) {
        // Found cycle
        const cycle = [depId];
        let current = task.id;
        while (current !== depId && parentMap.has(current)) {
          cycle.unshift(current);
          current = parentMap.get(current);
        }
        return cycle;
      }

      if (!visited.has(depId)) {
        const cycle = this.detectCycle(depTask, visited, recursionStack, parentMap);
        if (cycle.length > 0) {
          return cycle;
        }
      }
    }

    recursionStack.delete(task.id);
    return [];
  }

  identifyCriticalDependencies() {
    const critical = [];

    for (const task of this.tasks) {
      if (task.priority === 'P0' && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
          const depTask = this.tasks.find(t => t.id === depId);
          if (depTask && depTask.priority === 'P0') {
            critical.push({
              task: task.id,
              depends_on: depId,
              impact: 'Critical path blocker'
            });
          }
        }
      }
    }

    return critical;
  }

  calculateBlockerDuration(task) {
    // Simulate blocker duration (in real implementation, this would use timestamps)
    const baseDuration = task.priority === 'P0' ? 1 : task.priority === 'P1' ? 3 : 7;
    return baseDuration + Math.floor(Math.random() * 3);
  }

  calculateVelocity() {
    // Simulate velocity calculation (tasks completed per week)
    const recentTasks = this.tasks.filter(t => t.status === '🟢 Done');
    return recentTasks.length > 0 ? Math.round(recentTasks.length / 4) : 0;
  }

  calculateCycleTime() {
    // Simulate cycle time (average time from creation to completion)
    const completedTasks = this.tasks.filter(t => t.status === '🟢 Done');
    if (completedTasks.length === 0) return 0;

    const totalDays = completedTasks.reduce((sum, task) => {
      const created = new Date(task.created || '2026-02-24');
      const completed = new Date(task.completion_date || '2026-02-24');
      return sum + Math.floor((completed - created) / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / completedTasks.length);
  }

  calculateBurndown() {
    // Simulate burndown calculation
    const totalEffort = this.tasks.reduce((sum, task) => {
      const effort = parseInt(task.effort?.replace('d', '') || '3');
      return sum + effort;
    }, 0);

    const completedEffort = this.tasks
      .filter(t => t.status === '🟢 Done')
      .reduce((sum, task) => {
        const effort = parseInt(task.effort?.replace('d', '') || '3');
        return sum + effort;
      }, 0);

    return {
      total: totalEffort,
      completed: completedEffort,
      remaining: totalEffort - completedEffort
    };
  }

  generateStatusRecommendations() {
    const recommendations = [];

    if (this.analysis.completion_rate < 30) {
      recommendations.push('Focus on completing critical P0 tasks to improve overall progress');
    }

    if (this.analysis.blocked > this.analysis.completed) {
      recommendations.push('Address blockers to unblock task progression');
    }

    if (this.analysis.critical_issues.length > 5) {
      recommendations.push('Prioritize critical issues to reduce risk');
    }

    const p0Tasks = this.tasks.filter(t => t.priority === 'P0');
    const p0Completed = p0Tasks.filter(t => t.status === '🟢 Done').length;
    if (p0Completed / p0Tasks.length < 0.5) {
      recommendations.push('Accelerate P0 task completion for production readiness');
    }

    return recommendations;
  }

  generateDependencySuggestions() {
    const suggestions = [];

    if (this.analysis.circular_dependencies > 0) {
      suggestions.push('Resolve circular dependencies to enable task progression');
    }

    if (this.analysis.blocked_by_dependencies > this.analysis.total_tasks * 0.3) {
      suggestions.push('Consider parallelizing independent tasks to reduce dependency bottlenecks');
    }

    if (this.analysis.critical_dependencies.length > 0) {
      suggestions.push('Prioritize critical dependency tasks to unblock critical path');
    }

    return suggestions;
  }

  generateBlockerActions() {
    const actions = [];

    if (this.analysis.critical_blockers.length > 0) {
      actions.push('Immediate attention required for critical P0 blockers');
    }

    if (this.analysis.avg_blocker_duration > 5) {
      actions.push('Implement blocker resolution process to reduce average duration');
    }

    const blockedTasks = this.tasks.filter(t => t.blocked_by.length > 0);
    if (blockedTasks.length > 0) {
      actions.push('Schedule blocker resolution meetings for blocked tasks');
    }

    return actions;
  }

  async saveAnalysis() {
    const outputPath = path.join(__dirname, 'task-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.analysis, null, 2));
    console.log(`💾 Analysis saved to ${outputPath}`);
  }

  extractPriorityFromContext(content, taskId) {
    // Look for priority indicators in the task description
    const taskSection = this.findTaskSection(content, taskId);
    if (taskSection.includes('P0') || taskSection.includes('Critical')) return 'P0';
    if (taskSection.includes('P1') || taskSection.includes('High')) return 'P1';
    if (taskSection.includes('P2') || taskSection.includes('Medium')) return 'P2';
    if (taskSection.includes('P3') || taskSection.includes('Low')) return 'P3';

    // Default based on task prefix
    if (taskId.startsWith('SEC-') || taskId.startsWith('PERF-') || taskId.startsWith('DES-')) return 'P0';
    if (taskId.startsWith('I18N-') || taskId.startsWith('A11Y-') || taskId.startsWith('OPS-')) return 'P1';
    return 'P2';
  }

  extractDomainFromContext(content, taskId) {
    // Look for domain indicators in the task description
    const taskSection = this.findTaskSection(content, taskId);

    if (taskSection.includes('Security') || taskId.startsWith('SEC-')) return 'security';
    if (taskSection.includes('Design') || taskId.startsWith('DES-')) return 'design-system';
    if (taskSection.includes('Performance') || taskId.startsWith('PERF-')) return 'performance';
    if (taskSection.includes('Internationalization') || taskId.startsWith('I18N-')) return 'internationalization';
    if (taskSection.includes('Accessibility') || taskId.startsWith('A11Y-')) return 'accessibility';
    if (taskSection.includes('Operations') || taskId.startsWith('OPS-')) return 'operations';
    if (taskSection.includes('Feature') || taskId.startsWith('FLAGS-')) return 'feature-flags';
    if (taskSection.includes('Analytics') || taskId.startsWith('ANALYTICS-')) return 'analytics';
    if (taskSection.includes('API') || taskId.startsWith('API-')) return 'api';
    if (taskSection.includes('CMS') || taskId.startsWith('CMS-')) return 'cms';
    if (taskSection.includes('SEO') || taskId.startsWith('SEO-')) return 'seo';
    if (taskSection.includes('Email') || taskId.startsWith('EMAIL-')) return 'email';

    return 'general';
  }

  findTaskSection(content, taskId) {
    const lines = content.split('\n');
    let taskSection = '';
    let foundTask = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(taskId)) {
        foundTask = true;
        taskSection += line + '\n';
      } else if (foundTask && line.startsWith('- [') && !line.includes(taskId)) {
        // Found next task, stop collecting
        break;
      } else if (foundTask) {
        taskSection += line + '\n';
      }
    }

    return taskSection;
  }

  estimateEffort(priority) {
    const baseEffort = {
      'P0': '2d',
      'P1': '3d',
      'P2': '5d',
      'P3': '7d',
    };

    return baseEffort[priority] || '3d';
  }

  estimateComplexity(priority) {
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

  getArgValue(args, key, defaultValue) {
    const index = args.indexOf(key);
    return index !== -1 && index + 1 < args.length ? args[index + 1] : defaultValue;
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new TaskProgressAnalyzer();
  analyzer.run();
}

module.exports = TaskProgressAnalyzer;
