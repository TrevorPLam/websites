#!/usr/bin/env npx tsx

/**
 * @file scripts/code-health.ts
 * @summary Implements code health monitoring and quality assessment system.
 * @description Provides 3-level safeguard system for maintaining code quality and development standards.
 * @security none
 * @adr none
 * @requirements QUALITY-001, QUALITY-002
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const ROOT = path.resolve(process.cwd());

interface HealthMetrics {
  score: number;
  issues: HealthIssue[];
  recommendations: string[];
}

interface HealthIssue {
  severity: 'critical' | 'warning' | 'info';
  file: string;
  line?: number;
  message: string;
  rule: string;
}

class CodeHealthAnalyzer {
  private metrics: HealthMetrics = {
    score: 10.0,
    issues: [],
    recommendations: []
  };

  /**
   * Continuous Code Health Review - invoked as each code snippet generated
   */
  async codeHealthReview(filePath: string, content?: string): Promise<HealthMetrics> {
    this.resetMetrics();

    if (!fs.existsSync(filePath)) {
      this.addIssue('critical', filePath, undefined, 'File does not exist', 'file-existence');
      return this.metrics;
    }

    const fileContent = content || fs.readFileSync(filePath, 'utf-8');

    // Analyze TypeScript patterns
    await this.analyzeTypeScript(filePath, fileContent);

    // Analyze FSD compliance
    await this.analyzeFSDCompliance(filePath, fileContent);

    // Analyze security patterns
    await this.analyzeSecurity(filePath, fileContent);

    // Analyze performance patterns
    await this.analyzePerformance(filePath, fileContent);

    // Calculate final score
    this.calculateScore();

    return this.metrics;
  }

  /**
   * Pre-commit Code Health Safeguard - on staged files before every commit
   */
  async preCommitCodeHealthSafeguard(): Promise<HealthMetrics> {
    this.resetMetrics();

    // Get staged files
    const stagedFiles = this.getStagedFiles();

    for (const file of stagedFiles) {
      if (this.shouldAnalyzeFile(file)) {
        await this.codeHealthReview(file);
      }
    }

    return this.metrics;
  }

  /**
   * Analyze Change Set - full branch vs. base ref check before opening PR
   */
  async analyzeChangeSet(baseRef: string = 'main'): Promise<HealthMetrics> {
    this.resetMetrics();

    // Get changed files in branch
    const changedFiles = this.getChangedFiles(baseRef);

    for (const file of changedFiles) {
      if (this.shouldAnalyzeFile(file)) {
        await this.codeHealthReview(file);
      }
    }

    return this.metrics;
  }

  private resetMetrics(): void {
    this.metrics = {
      score: 10.0,
      issues: [],
      recommendations: []
    };
  }

  private addIssue(severity: HealthIssue['severity'], file: string, line: number | undefined, message: string, rule: string): void {
    this.metrics.issues.push({ severity, file, line, message, rule });

    // Deduct points based on severity
    switch (severity) {
      case 'critical':
        this.metrics.score -= 1.0;
        break;
      case 'warning':
        this.metrics.score -= 0.5;
        break;
      case 'info':
        this.metrics.score -= 0.1;
        break;
    }
  }

  private async analyzeTypeScript(filePath: string, content: string): Promise<void> {
    // Check for 'any' types
    const anyMatches = content.match(/:\s*any\b/g);
    if (anyMatches) {
      this.addIssue('critical', filePath, undefined, `Found ${anyMatches.length} instances of 'any' type`, 'no-any-types');
    }

    // Check for type assertions
    const assertionMatches = content.match(/as\s+\w+/g);
    if (assertionMatches && assertionMatches.length > 3) {
      this.addIssue('warning', filePath, undefined, `Excessive type assertions (${assertionMatches.length})`, 'minimize-assertions');
    }

    // Check for console.log in production code
    if (!filePath.includes('test') && !filePath.includes('spec')) {
      const consoleMatches = content.match(/console\.(log|debug|info)/g);
      if (consoleMatches) {
        this.addIssue('warning', filePath, undefined, `Found ${consoleMatches.length} console statements`, 'no-console-in-prod');
      }
    }
  }

  private async analyzeFSDCompliance(filePath: string, content: string): Promise<void> {
    // Check FSD layer violations
    const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
    const currentLayer = layers.find(layer => filePath.includes(`/${layer}/`));

    if (currentLayer) {
      // Check for backward imports (higher level importing lower level)
      const higherLayers = layers.slice(0, layers.indexOf(currentLayer));
      const lowerLayers = layers.slice(layers.indexOf(currentLayer) + 1);

      for (const higherLayer of higherLayers) {
        if (content.includes(`from '${higherLayer}`)) {
          this.addIssue('critical', filePath, undefined, `FSD violation: importing from higher layer '${higherLayer}'`, 'fsd-layer-isolation');
        }
      }
    }

    // Check for proper @x notation usage
    const xNotationMatches = content.match(/from ['"]@x\//g);
    if (xNotationMatches && xNotationMatches.length > 2) {
      this.addIssue('warning', filePath, undefined, `Excessive @x notation usage (${xNotationMatches.length})`, 'limit-x-notation');
    }
  }

  private async analyzeSecurity(filePath: string, content: string): Promise<void> {
    // Check for hardcoded secrets
    const secretPatterns = [
      /password\s*=\s*['"][^'"]+['"]/,
      /api_key\s*=\s*['"][^'"]+['"]/,
      /secret\s*=\s*['"][^'"]+['"]/
    ];

    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        this.addIssue('critical', filePath, undefined, 'Potential hardcoded secret detected', 'no-hardcoded-secrets');
      }
    }

    // Check for tenant_id in database queries
    if (content.includes('SELECT') || content.includes('INSERT') || content.includes('UPDATE')) {
      if (!content.includes('tenant_id')) {
        this.addIssue('critical', filePath, undefined, 'Database query missing tenant_id clause', 'tenant-isolation');
      }
    }

    // Check for input validation
    if (content.includes('req.body') || content.includes('request.body')) {
      if (!content.includes('zod') && !content.includes('validation')) {
        this.addIssue('warning', filePath, undefined, 'Request body without validation', 'input-validation');
      }
    }
  }

  private async analyzePerformance(filePath: string, content: string): Promise<void> {
    // Check for bundle size issues
    const dynamicImports = content.match(/import\(/g);
    if (dynamicImports && dynamicImports.length > 5) {
      this.addIssue('info', filePath, undefined, 'Consider code splitting for better performance', 'code-splitting');
    }

    // Check for image optimization
    if (content.includes('<img') && !content.includes('next/image')) {
      this.addIssue('warning', filePath, undefined, 'Use next/image for optimized images', 'image-optimization');
    }

    // Check for loading states
    if (content.includes('async') && !content.includes('Suspense') && !content.includes('loading')) {
      this.addIssue('info', filePath, undefined, 'Consider adding loading states for async operations', 'loading-states');
    }
  }

  private calculateScore(): void {
    // Ensure score doesn't go below 0
    this.metrics.score = Math.max(0, this.metrics.score);

    // Add recommendations based on issues
    const criticalIssues = this.metrics.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.metrics.issues.filter(i => i.severity === 'warning');

    if (criticalIssues.length > 0) {
      this.metrics.recommendations.push('Address critical issues immediately - they block PR merge');
    }

    if (warningIssues.length > 3) {
      this.metrics.recommendations.push('Consider addressing warnings to improve code quality');
    }

    if (this.metrics.score < 9.5) {
      this.metrics.recommendations.push('Code Health score below 9.5 - review and fix issues');
    }
  }

  private getStagedFiles(): string[] {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  private getChangedFiles(baseRef: string): string[] {
    try {
      const output = execSync(`git diff ${baseRef}...HEAD --name-only`, { encoding: 'utf-8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  private shouldAnalyzeFile(filePath: string): boolean {
    const analyzableExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    const extension = path.extname(filePath);

    return analyzableExtensions.includes(extension) &&
           !filePath.includes('node_modules') &&
           !filePath.includes('.next') &&
           !filePath.includes('dist');
  }

  /**
   * Format output for agent consumption
   */
  formatOutput(): string {
    const { score, issues, recommendations } = this.metrics;

    let output = `Code Health Score: ${score.toFixed(1)}/10.0\n\n`;

    if (issues.length > 0) {
      output += 'Issues:\n';
      issues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
        output += `  ${icon} ${issue.file}${issue.line ? `:${issue.line}` : ''} - ${issue.message} (${issue.rule})\n`;
      });
      output += '\n';
    }

    if (recommendations.length > 0) {
      output += 'Recommendations:\n';
      recommendations.forEach(rec => {
        output += `  • ${rec}\n`;
      });
    }

    return output;
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new CodeHealthAnalyzer();
  const command = process.argv[2];
  const target = process.argv[3];

  switch (command) {
    case 'review':
      if (!target) {
        console.error('Usage: code-health review <file-path>');
        process.exit(1);
      }
      analyzer.codeHealthReview(target).then(metrics => {
        console.log(analyzer.formatOutput());
        process.exit(metrics.score >= 9.5 ? 0 : 1);
      });
      break;

    case 'pre-commit':
      analyzer.preCommitCodeHealthSafeguard().then(metrics => {
        console.log(analyzer.formatOutput());
        process.exit(metrics.score >= 9.5 ? 0 : 1);
      });
      break;

    case 'analyze':
      const baseRef = target || 'main';
      analyzer.analyzeChangeSet(baseRef).then(metrics => {
        console.log(analyzer.formatOutput());
        process.exit(metrics.score >= 9.5 ? 0 : 1);
      });
      break;

    default:
      console.log('Usage:');
      console.log('  code-health review <file>     - Analyze single file');
      console.log('  code-health pre-commit        - Analyze staged files');
      console.log('  code-health analyze [branch]  - Analyze branch changes');
      break;
  }
}

export { CodeHealthAnalyzer, HealthMetrics, HealthIssue };
