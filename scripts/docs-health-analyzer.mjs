#!/usr/bin/env node

/**
 * Documentation Health Analyzer
 * 
 * This script analyzes documentation quality, completeness, and health
 * across the monorepo, providing insights and recommendations.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

class DocumentationHealthAnalyzer {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.docsDir = join(rootDir, 'docs');
  }

  async analyzeAll(docsPath) {
    console.log('📚 Starting documentation health analysis...');
    
    const targetPath = docsPath || this.docsDir;
    const results = [];
    
    // Find all markdown files
    const mdFiles = await glob('**/*.md', { cwd: targetPath });
    
    for (const file of mdFiles) {
      const filePath = join(targetPath, file);
      const category = this.categorizeFile(filePath);
      const health = await this.analyzeFile(filePath, category);
      results.push(health);
    }
    
    // Generate comprehensive report
    this.generateHealthReport(results);
    
    // Generate improvement plan
    this.generateImprovementPlan(results);
    
    // Save detailed report if requested
    if (process.argv.includes('--save-report')) {
      this.saveDetailedReport(results);
    }
    
    return results;
  }

  categorizeFile(filePath) {
    const pathParts = filePath.split(/[/\\]/);
    
    if (pathParts.includes('guides')) return 'guides';
    if (pathParts.includes('security')) return 'security';
    if (pathParts.includes('testing')) return 'testing';
    if (pathParts.includes('standards')) return 'standards';
    if (pathParts.includes('operations')) return 'operations';
    if (pathParts.includes('observability')) return 'observability';
    if (pathParts.includes('quality')) return 'quality';
    
    return 'general';
  }

  async analyzeFile(filePath, category) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const metrics = this.calculateMetrics(content, lines);
    const issues = this.analyzeIssues(content, lines, category);
    const recommendations = this.generateRecommendations(metrics, issues, category);
    
    return {
      file: filePath,
      category,
      metrics,
      issues,
      recommendations
    };
  }

  calculateMetrics(content, lines) {
    const metrics = {
      wordCount: 0,
      codeBlockCount: 0,
      linkCount: 0,
      imageCount: 0,
      completeness: 0,
      freshness: 0,
      quality: 0
    };
    
    // Count words
    metrics.wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Count code blocks
    metrics.codeBlockCount = (content.match(/```[\s\S]*?```/g) || []).length;
    
    // Count links
    metrics.linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    
    // Count images
    metrics.imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    // Calculate completeness
    metrics.completeness = this.calculateCompleteness(content, lines);
    
    // Calculate freshness (simplified - based on last modified date)
    metrics.freshness = this.calculateFreshness(content);
    
    // Calculate quality score
    metrics.quality = this.calculateQuality(content, lines, metrics);
    
    return metrics;
  }

  calculateCompleteness(content, lines) {
    let score = 0;
    const maxScore = 100;
    
    // Check for title
    if (content.match(/^#\s+/m)) score += 20;
    
    // Check for sections
    const sections = content.match(/^##\s+/gm) || [];
    score += Math.min(30, sections.length * 10);
    
    // Check for code examples
    if (content.includes('```')) score += 15;
    
    // Check for links
    if (content.includes('[') && content.includes('](')) score += 10;
    
    // Check for description/introduction
    const firstLines = lines.slice(0, 5).join(' ');
    if (firstLines.length > 100) score += 15;
    
    // Check for conclusion/summary
    const lastLines = lines.slice(-5).join(' ');
    if (lastLines.toLowerCase().includes('conclusion') || 
        lastLines.toLowerCase().includes('summary') ||
        lastLines.toLowerCase().includes('next')) score += 10;
    
    return Math.min(maxScore, score);
  }

  calculateFreshness(content) {
    // Look for date indicators
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/,
      /updated:\s+\d{4}/i,
      /last modified:\s+\d{4}/i
    ];
    
    let hasDate = false;
    for (const pattern of datePatterns) {
      if (content.match(pattern)) {
        hasDate = true;
        break;
      }
    }
    
    // Simplified freshness calculation
    return hasDate ? 80 : 40;
  }

  calculateQuality(content, lines, metrics) {
    let score = 50; // Base score
    
    // Grammar and spelling (simplified check)
    const commonErrors = content.match(/\b(their|there|its|it\'s|your|you\'re)\b/gi) || [];
    score -= Math.min(20, commonErrors.length * 2);
    
    // Structure quality
    if (metrics.wordCount < 50) score -= 20; // Too short
    if (metrics.wordCount > 5000) score -= 10; // Too long
    
    // Code quality
    if (metrics.codeBlockCount > 0 && metrics.wordCount / metrics.codeBlockCount < 50) {
      score += 10; // Good balance of code and explanation
    }
    
    // Link quality
    if (metrics.linkCount > 0 && metrics.wordCount / metrics.linkCount > 100) {
      score += 5; // Good link density
    }
    
    return Math.max(0, Math.min(100, score));
  }

  analyzeIssues(content, lines, category) {
    const issues = [];
    
    // Check for missing title
    if (!content.match(/^#\s+/m)) {
      issues.push({
        type: 'structure',
        severity: 'high',
        description: 'Missing main title (H1)',
        location: 'Top of file'
      });
    }
    
    // Check for very short content
    if (content.length < 200) {
      issues.push({
        type: 'content',
        severity: 'medium',
        description: 'Content is very short (< 200 characters)',
        location: 'Entire file'
      });
    }
    
    // Check for broken links (basic check)
    const links = content.match(/\[.*?\]\((.*?)\)/g) || [];
    links.forEach(link => {
      const url = link.match(/\((.*?)\)/)?.[1];
      if (url && url.startsWith('http') && !url.startsWith('https')) {
        issues.push({
          type: 'links',
          severity: 'medium',
          description: 'Insecure HTTP link detected',
          location: link
        });
      }
    });
    
    // Check for accessibility issues
    const images = content.match(/!\[.*?\]\(.*?\)/g) || [];
    images.forEach(img => {
      const alt = img.match(/!\[(.*?)\]/)?.[1];
      if (!alt || alt.trim() === '') {
        issues.push({
          type: 'accessibility',
          severity: 'medium',
          description: 'Image missing alt text',
          location: img
        });
      }
    });
    
    // Check for formatting issues
    const linesWithTrailingSpaces = lines.filter(line => line.endsWith(' ')).length;
    if (linesWithTrailingSpaces > 5) {
      issues.push({
        type: 'formatting',
        severity: 'low',
        description: `${linesWithTrailingSpaces} lines have trailing spaces`,
        location: 'Multiple lines'
      });
    }
    
    // Category-specific checks
    if (category === 'guides') {
      if (!content.includes('##') || content.split('##').length < 2) {
        issues.push({
          type: 'structure',
          severity: 'medium',
          description: 'Guide should have multiple sections',
          location: 'Structure'
        });
      }
    }
    
    if (category === 'security') {
      if (!content.toLowerCase().includes('security') && !content.toLowerCase().includes('vulnerability')) {
        issues.push({
          type: 'content',
          severity: 'low',
          description: 'Security document should mention security or vulnerability',
          location: 'Content'
        });
      }
    }
    
    return issues;
  }

  generateRecommendations(metrics, issues, category) {
    const recommendations = [];
    
    // Content recommendations
    if (metrics.wordCount < 100) {
      recommendations.push({
        category: 'content',
        priority: 'high',
        action: 'Expand content with more detailed explanations',
        impact: 'Better documentation value',
        effort: 'hours'
      });
    }
    
    if (metrics.codeBlockCount === 0 && category === 'guides') {
      recommendations.push({
        category: 'content',
        priority: 'medium',
        action: 'Add code examples to illustrate concepts',
        impact: 'Better developer experience',
        effort: 'minutes'
      });
    }
    
    // Structure recommendations
    const criticalIssues = issues.filter(i => i.severity === 'critical' || i.severity === 'high');
    if (criticalIssues.length > 0) {
      recommendations.push({
        category: 'structure',
        priority: 'high',
        action: 'Fix critical structural issues',
        impact: 'Improved readability and navigation',
        effort: 'minutes'
      });
    }
    
    // Maintenance recommendations
    if (metrics.freshness < 60) {
      recommendations.push({
        category: 'maintenance',
        priority: 'medium',
        action: 'Update document with last modified date',
        impact: 'Better content freshness tracking',
        effort: 'minutes'
      });
    }
    
    // Accessibility recommendations
    const accessibilityIssues = issues.filter(i => i.type === 'accessibility');
    if (accessibilityIssues.length > 0) {
      recommendations.push({
        category: 'accessibility',
        priority: 'medium',
        action: 'Fix accessibility issues (alt text, etc.)',
        impact: 'Better accessibility compliance',
        effort: 'minutes'
      });
    }
    
    return recommendations;
  }

  generateHealthReport(results) {
    console.log('\n📊 Documentation Health Report');
    console.log('===============================');
    
    const totalFiles = results.length;
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const totalRecommendations = results.reduce((sum, r) => sum + r.recommendations.length, 0);
    const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0);
    const highIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'high').length, 0);
    
    // Calculate average metrics
    const avgCompleteness = results.reduce((sum, r) => sum + r.metrics.completeness, 0) / totalFiles;
    const avgFreshness = results.reduce((sum, r) => sum + r.metrics.freshness, 0) / totalFiles;
    const avgQuality = results.reduce((sum, r) => sum + r.metrics.quality, 0) / totalFiles;
    
    console.log(`Documents analyzed: ${totalFiles}`);
    console.log(`Total issues found: ${totalIssues}`);
    console.log(`Critical issues: ${criticalIssues}`);
    console.log(`High severity issues: ${highIssues}`);
    console.log(`Total recommendations: ${totalRecommendations}`);
    console.log(`Average completeness: ${Math.round(avgCompleteness)}%`);
    console.log(`Average freshness: ${Math.round(avgFreshness)}%`);
    console.log(`Average quality: ${Math.round(avgQuality)}%`);
    
    // Issues by type
    const issuesByType = {
      content: 0,
      structure: 0,
      links: 0,
      formatting: 0,
      accessibility: 0
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
    
    // Category breakdown
    const categoryStats = this.calculateCategoryStats(results);
    console.log('\n📂 Health by Category:');
    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`  ${category}: ${stats.count} files, avg quality ${Math.round(stats.avgQuality)}%`);
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
            console.log(`   ${i.severity === 'critical' ? '🔴' : '🟠'} ${i.description}`);
            if (i.location) console.log(`      Location: ${i.location}`);
          });
        }
      });
    }
  }

  calculateCategoryStats(results) {
    const stats = {};
    
    results.forEach(r => {
      if (!stats[r.category]) {
        stats[r.category] = { count: 0, totalQuality: 0 };
      }
      stats[r.category].count++;
      stats[r.category].totalQuality += r.metrics.quality;
    });
    
    // Convert to average
    const result = {};
    Object.entries(stats).forEach(([category, data]) => {
      result[category] = {
        count: data.count,
        avgQuality: data.totalQuality / data.count
      };
    });
    
    return result;
  }

  generateImprovementPlan(results) {
    console.log('\n🎯 Documentation Improvement Plan');
    console.log('===============================');
    
    // Group recommendations by priority
    const allRecommendations = results.flatMap(r => r.recommendations);
    const highPriority = allRecommendations.filter(r => r.priority === 'high');
    const mediumPriority = allRecommendations.filter(r => r.priority === 'medium');
    const lowPriority = allRecommendations.filter(r => r.priority === 'low');
    
    // Group by category
    const recommendationsByCategory = this.groupRecommendations(allRecommendations);
    
    if (highPriority.length > 0) {
      console.log('\n🔥 High Priority (This Week):');
      this.displayRecommendations(highPriority);
    }
    
    if (mediumPriority.length > 0) {
      console.log('\n⚡ Medium Priority (Next Sprint):');
      this.displayRecommendations(mediumPriority);
    }
    
    if (lowPriority.length > 0) {
      console.log('\n💡 Low Priority (Future):');
      this.displayRecommendations(lowPriority);
    }
    
    // Category-based recommendations
    console.log('\n📋 Recommendations by Category:');
    Object.entries(recommendationsByCategory).forEach(([category, recs]) => {
      console.log(`\n  ${category}:`);
      recs.forEach((rec, index) => {
        console.log(`    ${index + 1}. ${rec.action}`);
        console.log(`       Priority: ${rec.priority} | Impact: ${rec.impact} | Effort: ${rec.effort}`);
      });
    });
    
    // Summary
    console.log('\n📊 Improvement Summary:');
    console.log(`High priority items: ${highPriority.length}`);
    console.log(`Medium priority items: ${mediumPriority.length}`);
    console.log(`Low priority items: ${lowPriority.length}`);
    
    const totalEffort = this.calculateTotalEffort(allRecommendations);
    console.log(`Estimated total effort: ${totalEffort}`);
  }

  groupRecommendations(recommendations) {
    return recommendations.reduce((groups, rec) => {
      if (!groups[rec.category]) {
        groups[rec.category] = [];
      }
      groups[rec.category].push(rec);
      return groups;
    }, {});
  }

  displayRecommendations(recommendations) {
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec.action}`);
      console.log(`     Impact: ${rec.impact} | Effort: ${rec.effort}`);
    });
  }

  calculateTotalEffort(recommendations) {
    const effortMap = { minutes: 1, hours: 60, days: 480 };
    let totalMinutes = 0;
    
    recommendations.forEach(rec => {
      const baseEffort = parseInt(rec.effort) || 1;
      totalMinutes += (baseEffort * (effortMap[rec.effort] || 60));
    });
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 480) {
      return `${Math.round(totalMinutes / 60)} hours`;
    } else {
      return `${Math.round(totalMinutes / 480)} days`;
    }
  }

  saveDetailedReport(results) {
    const reportPath = join(this.rootDir, 'docs-health-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: results.length,
        totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
        totalRecommendations: results.reduce((sum, r) => sum + r.recommendations.length, 0),
        avgQuality: Math.round(results.reduce((sum, r) => sum + r.metrics.quality, 0) / results.length)
      },
      results
    };
    
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const docsPath = args[1];
  
  const analyzer = new DocumentationHealthAnalyzer();
  
  switch (command) {
    case 'analyze':
      await analyzer.analyzeAll(docsPath);
      break;
    case 'help':
      console.log(`
Documentation Health Analyzer

Usage:
  node scripts/docs-health-analyzer.mjs <command> [path] [options]

Commands:
  analyze  - Analyze documentation health
  help     - Show this help message

Options:
  --save-report  - Save detailed JSON report

Examples:
  pnpm docs:health
  node scripts/docs-health-analyzer.mjs analyze docs
  node scripts/docs-health-analyzer.mjs analyze docs --save-report
      `);
      break;
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Documentation health analysis failed:', error);
    process.exit(1);
  });
}

export { DocumentationHealthAnalyzer };
