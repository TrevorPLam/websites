#!/usr/bin/env node

/**
 * Advanced Import/Export Analysis Script
 *
 * This script performs deep analysis of import/export patterns,
 * dependency graphs, and optimization opportunities.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface AnalysisResult {
  file: string;
  metrics: FileMetrics;
  issues: AnalysisIssue[];
  recommendations: Recommendation[];
}

interface FileMetrics {
  totalImports: number;
  totalExports: number;
  relativeImports: number;
  absoluteImports: number;
  typeImports: number;
  circularDependencies: number;
  unusedExports: number;
  complexity: 'low' | 'medium' | 'high';
}

interface AnalysisIssue {
  type: 'performance' | 'maintainability' | 'architecture' | 'security' | 'standardization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  impact: string;
  line?: number;
}

interface Recommendation {
  category: 'optimization' | 'refactoring' | 'standardization' | 'architecture' | 'security';
  priority: 'low' | 'medium' | 'high';
  action: string;
  effort: 'minutes' | 'hours' | 'days';
  impact: string;
}

class ImportExportAnalyzer {
  private readonly rootDir: string;
  private readonly patterns = {
    typescript: '**/*.{ts,tsx}',
    packages: 'packages/*/src/**/*.{ts,tsx}',
    clients: 'clients/*/src/**/*.{ts,tsx}'
  };

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  async analyzeAll(): Promise<AnalysisResult[]> {
    console.log('🔬 Starting advanced import/export analysis...');

    const results: AnalysisResult[] = [];

    // Analyze TypeScript files
    const tsFiles = await glob(this.patterns.typescript, { cwd: this.rootDir });

    for (const file of tsFiles) {
      const result = await this.analyzeFile(join(this.rootDir, file));
      results.push(result);
    }

    // Generate comprehensive report
    this.generateAnalysisReport(results);

    // Generate optimization recommendations
    this.generateOptimizationPlan(results);

    return results;
  }

  private async analyzeFile(filePath: string): Promise<AnalysisResult> {
    const issues: AnalysisIssue[] = [];
    const recommendations: Recommendation[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      const metrics = this.calculateMetrics(filePath, content, lines);

      // Analyze patterns and issues
      this.analyzeImportPatterns(filePath, lines, metrics, issues, recommendations);
      this.analyzeExportPatterns(filePath, content, metrics, issues, recommendations);
      this.analyzeArchitecturalIssues(filePath, content, metrics, issues, recommendations);

      return {
        file: filePath,
        metrics,
        issues,
        recommendations
      };

    } catch (error) {
      return {
        file: filePath,
        metrics: this.getEmptyMetrics(),
        issues: [{
          type: 'performance',
          severity: 'critical',
          message: `Failed to analyze file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          impact: 'Analysis blocked'
        }],
        recommendations: []
      };
    }
  }

  private calculateMetrics(filePath: string, content: string, lines: string[]): FileMetrics {
    const metrics: FileMetrics = {
      totalImports: 0,
      totalExports: 0,
      relativeImports: 0,
      absoluteImports: 0,
      typeImports: 0,
      circularDependencies: 0,
      unusedExports: 0,
      complexity: 'low'
    };

    lines.forEach(line => {
      const trimmed = line.trim();

      // Count imports
      if (trimmed.startsWith('import')) {
        metrics.totalImports++;

        if (trimmed.startsWith('import type')) {
          metrics.typeImports++;
        }

        if (trimmed.includes('from "../') || trimmed.includes('from "./')) {
          metrics.relativeImports++;
        } else if (trimmed.includes('@repo/')) {
          metrics.absoluteImports++;
        }
      }

      // Count exports
      if (trimmed.includes('export')) {
        metrics.totalExports++;
      }
    });

    // Calculate complexity
    const totalDeclarations = metrics.totalImports + metrics.totalExports;
    if (totalDeclarations > 50) {
      metrics.complexity = 'high';
    } else if (totalDeclarations > 20) {
      metrics.complexity = 'medium';
    }

    return metrics;
  }

  private analyzeImportPatterns(
    filePath: string,
    lines: string[],
    metrics: FileMetrics,
    issues: AnalysisIssue[],
    recommendations: Recommendation[]
  ): void {
    // Check for deep relative imports
    lines.forEach((line, index) => {
      const depthMatch = line.match(/from\s+["'](\.\.\/)+/);
      if (depthMatch && depthMatch[1].length > 6) { // More than 3 levels deep
        issues.push({
          type: 'maintainability',
          severity: 'medium',
          message: 'Deep relative import detected',
          impact: 'Hard to maintain and refactor',
          line: index + 1
        });

        recommendations.push({
          category: 'standardization',
          priority: 'medium',
          action: 'Convert to absolute @repo/* import',
          effort: 'minutes',
          impact: 'Improved maintainability and IDE support'
        });
      }
    });

    // Check for mixed import styles
    if (metrics.relativeImports > 0 && metrics.absoluteImports > 0) {
      issues.push({
        type: 'standardization',
        severity: 'low',
        message: 'Mixed import styles (relative and absolute)',
        impact: 'Inconsistent code style'
      });

      recommendations.push({
        category: 'standardization',
        priority: 'medium',
        action: 'Standardize on absolute @repo/* imports',
        effort: 'hours',
        impact: 'Consistent import patterns across codebase'
      });
    }

    // Check for missing type imports
    const nonTypeImports = metrics.totalImports - metrics.typeImports;
    if (nonTypeImports > 10 && metrics.typeImports === 0) {
      recommendations.push({
        category: 'optimization',
        priority: 'low',
        action: 'Consider using import type for type-only imports',
        effort: 'minutes',
        impact: 'Better tree-shaking and bundle optimization'
      });
    }
  }

  private analyzeExportPatterns(
    filePath: string,
    content: string,
    metrics: FileMetrics,
    issues: AnalysisIssue[],
    recommendations: Recommendation[]
  ): void {
    // Check for barrel export complexity
    if (filePath.includes('/index.ts') && metrics.totalExports > 30) {
      issues.push({
        type: 'maintainability',
        severity: 'medium',
        message: 'Large barrel export file',
        impact: 'Difficult to understand and maintain'
      });

      recommendations.push({
        category: 'refactoring',
        priority: 'medium',
        action: 'Split barrel exports into logical groups',
        effort: 'hours',
        impact: 'Better code organization and maintainability'
      });
    }

    // Check for potential unused exports
    const exportMatches = content.match(/export\s+(const|function|class|interface|type)\s+(\w+)/g);
    if (exportMatches && exportMatches.length > 20) {
      recommendations.push({
        category: 'optimization',
        priority: 'low',
        action: 'Run knip to detect and remove unused exports',
        effort: 'minutes',
        impact: 'Reduced bundle size and cleaner code'
      });
    }
  }

  private analyzeArchitecturalIssues(
    filePath: string,
    content: string,
    metrics: FileMetrics,
    issues: AnalysisIssue[],
    recommendations: Recommendation[]
  ): void {
    // Check for FSD violations (cross-slice imports)
    if (filePath.includes('/packages/features/') && content.includes('@repo/ui')) {
      // This might be acceptable, but worth noting
      recommendations.push({
        category: 'architecture',
        priority: 'low',
        action: 'Review FSD layer separation for UI imports in features',
        effort: 'minutes',
        impact: 'Ensure proper architectural boundaries'
      });
    }

    // Check for client/server separation
    if (content.includes('server-only') && filePath.includes('client')) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Server-only code in client module',
        impact: 'Potential security vulnerability'
      });

      recommendations.push({
        category: 'security',
        priority: 'high',
        action: 'Move server-only code to appropriate server module',
        effort: 'hours',
        impact: 'Prevent server code leakage to client'
      });
    }
  }

  private getEmptyMetrics(): FileMetrics {
    return {
      totalImports: 0,
      totalExports: 0,
      relativeImports: 0,
      absoluteImports: 0,
      typeImports: 0,
      circularDependencies: 0,
      unusedExports: 0,
      complexity: 'low'
    };
  }

  private generateAnalysisReport(results: AnalysisResult[]): void {
    const totalFiles = results.length;
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const totalRecommendations = results.reduce((sum, r) => sum + r.recommendations.length, 0);

    const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0);
    const highIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'high').length, 0);

    const highPriorityRecs = results.reduce((sum, r) => sum + r.recommendations.filter(r => r.priority === 'high').length, 0);

    console.log('\n📊 Advanced Import/Export Analysis Report');
    console.log('==========================================');
    console.log(`Files analyzed: ${totalFiles}`);
    console.log(`Total issues found: ${totalIssues}`);
    console.log(`Critical issues: ${criticalIssues}`);
    console.log(`High severity issues: ${highIssues}`);
    console.log(`Total recommendations: ${totalRecommendations}`);
    console.log(`High priority recommendations: ${highPriorityRecs}`);

    // Issue breakdown by type
    const issuesByType = {
      performance: 0,
      maintainability: 0,
      architecture: 0,
      security: 0,
      standardization: 0
    };

    results.forEach(r => {
      r.issues.forEach(i => {
        issuesByType[i.type]++;
      });
    });

    console.log('\n📈 Issues by Type:');
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Show critical and high severity issues
    const criticalResults = results.filter(r => r.issues.some(i => i.severity === 'critical' || i.severity === 'high'));

    if (criticalResults.length > 0) {
      console.log('\n🚨 Critical & High Severity Issues:');
      criticalResults.forEach(r => {
        const criticalIssues = r.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
        if (criticalIssues.length > 0) {
          console.log(`\n📁 ${r.file}`);
          criticalIssues.forEach(i => {
            console.log(`   ${i.severity === 'critical' ? '🔴' : '🟠'} ${i.message}${i.line ? ` (line ${i.line})` : ''}`);
            console.log(`      Impact: ${i.impact}`);
          });
        }
      });
    }
  }

  private generateOptimizationPlan(results: AnalysisResult[]): void {
    console.log('\n🎯 Optimization Recommendations');
    console.log('===============================');

    // Group recommendations by priority
    const highPriorityRecs: Recommendation[] = [];
    const mediumPriorityRecs: Recommendation[] = [];
    const lowPriorityRecs: Recommendation[] = [];

    results.forEach(r => {
      r.recommendations.forEach(rec => {
        if (rec.priority === 'high') highPriorityRecs.push(rec);
        else if (rec.priority === 'medium') mediumPriorityRecs.push(rec);
        else lowPriorityRecs.push(rec);
      });
    });

    // Show high priority recommendations first
    if (highPriorityRecs.length > 0) {
      console.log('\n🔥 High Priority (Immediate Action Required):');
      this.displayRecommendations(highPriorityRecs);
    }

    if (mediumPriorityRecs.length > 0) {
      console.log('\n⚡ Medium Priority (Next Sprint):');
      this.displayRecommendations(mediumPriorityRecs);
    }

    if (lowPriorityRecs.length > 0) {
      console.log('\n💡 Low Priority (Future Enhancement):');
      this.displayRecommendations(lowPriorityRecs);
    }

    // Generate summary
    console.log('\n📋 Implementation Summary:');
    console.log(`High priority items: ${highPriorityRecs.length}`);
    console.log(`Medium priority items: ${mediumPriorityRecs.length}`);
    console.log(`Low priority items: ${lowPriorityRecs.length}`);

    const totalEffort = this.calculateTotalEffort([...highPriorityRecs, ...mediumPriorityRecs, ...lowPriorityRecs]);
    console.log(`Estimated total effort: ${totalEffort}`);
  }

  private displayRecommendations(recommendations: Recommendation[]): void {
    const grouped = this.groupRecommendations(recommendations);

    Object.entries(grouped).forEach(([category, recs]) => {
      console.log(`\n  ${category}:`);
      recs.forEach((rec, index) => {
        console.log(`    ${index + 1}. ${rec.action}`);
        console.log(`       Effort: ${rec.effort} | Impact: ${rec.impact}`);
      });
    });
  }

  private groupRecommendations(recommendations: Recommendation[]): Record<string, Recommendation[]> {
    return recommendations.reduce((groups, rec) => {
      if (!groups[rec.category]) {
        groups[rec.category] = [];
      }
      groups[rec.category].push(rec);
      return groups;
    }, {} as Record<string, Recommendation[]>);
  }

  private calculateTotalEffort(recommendations: Recommendation[]): string {
    const effortMap = { minutes: 1, hours: 60, days: 480 };
    let totalMinutes = 0;

    recommendations.forEach(rec => {
      const baseEffort = parseInt(rec.effort) || 1;
      totalMinutes += (baseEffort * (effortMap[rec.effort as keyof typeof effortMap] || 60));
    });

    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 480) {
      return `${Math.round(totalMinutes / 60)} hours`;
    } else {
      return `${Math.round(totalMinutes / 480)} days`;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const analyzer = new ImportExportAnalyzer();

  switch (command) {
    case 'analyze':
      await analyzer.analyzeAll();
      break;
    case 'help':
      console.log(`
Advanced Import/Export Analyzer

Usage:
  node scripts/analyze-imports.js <command>

Commands:
  analyze  - Perform comprehensive analysis of all TypeScript files
  help     - Show this help message

Examples:
  pnpm analyze:imports
  node scripts/analyze-imports.js analyze
      `);
      break;
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });
}

export { ImportExportAnalyzer };
