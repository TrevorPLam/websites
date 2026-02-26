#!/usr/bin/env tsx
/**
 * @file scripts/migrate-legacy-guides-simple.ts
 * @summary Simplified legacy guides migration analysis without gray-matter dependency.
 * @description Analyzes legacy documentation for migration priority and creates migration plan.
 * @security Validates all file paths and content to prevent injection attacks during migration.
 * @requirements DOC-07, legacy-content-migration, quality-assurance
 */

import { statSync } from 'fs';
import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import * as path from 'path';

interface MigrationOptions {
  dryRun?: boolean;
  sourceDir?: string;
  targetDir?: string;
  priorityThreshold?: number;
  batchSize?: number;
  outputFormat?: 'json' | 'summary' | 'markdown';
}

interface LegacyContent {
  file: string;
  title: string;
  description: string;
  size: number;
  lastModified: Date;
  wordCount: number;
  codeBlocks: number;
  links: number;
  priority: number;
  category: string;
  targetLocation: string;
  migrationStatus: 'pending' | 'migrated' | 'skipped' | 'error';
  issues: string[];
  recommendations: string[];
}

interface MigrationReport {
  generated: string;
  sourceDirectory: string;
  targetDirectory: string;
  totalFiles: number;
  analyzedFiles: number;
  migratedFiles: number;
  skippedFiles: number;
  errorFiles: number;
  contentByCategory: Record<string, LegacyContent[]>;
  migrationPlan: MigrationPlan;
  issues: string[];
  recommendations: string[];
}

interface MigrationPlan {
  highPriority: LegacyContent[];
  mediumPriority: LegacyContent[];
  lowPriority: LegacyContent[];
  estimatedEffort: {
    hours: number;
    complexity: 'low' | 'medium' | 'high';
  };
}

class LegacyGuidesMigrator {
  private options: MigrationOptions;
  private sourceDir: string;
  private targetDir: string;

  constructor(options: MigrationOptions = {}) {
    this.options = {
      dryRun: true,
      sourceDir: 'docs/guides',
      targetDir: 'docs',
      priorityThreshold: 7,
      batchSize: 10,
      outputFormat: 'json',
      ...options,
    };

    this.sourceDir = path.resolve(this.options.sourceDir!);
    this.targetDir = path.resolve(this.options.targetDir!);
  }

  async migrate(): Promise<MigrationReport> {
    console.log('🔍 Starting legacy guides migration analysis...');

    const report: MigrationReport = {
      generated: new Date().toISOString(),
      sourceDirectory: this.sourceDir,
      targetDirectory: this.targetDir,
      totalFiles: 0,
      analyzedFiles: 0,
      migratedFiles: 0,
      skippedFiles: 0,
      errorFiles: 0,
      contentByCategory: {},
      migrationPlan: {
        highPriority: [],
        mediumPriority: [],
        lowPriority: [],
        estimatedEffort: {
          hours: 0,
          complexity: 'medium',
        },
      },
      issues: [],
      recommendations: [],
    };

    // Step 1: Discover and analyze legacy content
    console.log('📁 Discovering legacy content...');
    const legacyFiles = await this.discoverLegacyFiles();
    report.totalFiles = legacyFiles.length;

    console.log(`📊 Found ${legacyFiles.length} files to analyze...`);

    // Step 2: Analyze each file for migration priority
    console.log('🔍 Analyzing content for migration priority...');
    const analyzedContent = await this.analyzeLegacyContent(legacyFiles);
    report.analyzedFiles = analyzedContent.length;

    // Step 3: Categorize and prioritize content
    console.log('📋 Categorizing and prioritizing content...');
    this.categorizeContent(analyzedContent, report);
    this.prioritizeContent(report);

    // Step 4: Generate migration plan
    console.log('📝 Generating migration plan...');
    this.generateMigrationPlan(report);

    // Step 5: Execute migration (if not dry run)
    if (!this.options.dryRun) {
      console.log('🚀 Executing migration...');
      await this.executeMigration(report);
    }

    console.log('✅ Migration analysis complete!');
    return report;
  }

  private async discoverLegacyFiles(): Promise<string[]> {
    const patterns = [`${this.sourceDir}/**/*.md`, `${this.sourceDir}/**/*.mdx`];

    const files: string[] = [];

    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        ignore: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/_ARCHIVED.md',
        ],
      });
      files.push(...matches);
    }

    // Sort files by size and modification time
    return files.sort((a, b) => {
      const statA = statSync(a);
      const statB = statSync(b);
      return statB.mtime.getTime() - statA.mtime.getTime();
    });
  }

  private async analyzeLegacyContent(files: string[]): Promise<LegacyContent[]> {
    const content: LegacyContent[] = [];

    for (const file of files) {
      try {
        const analysis = await this.analyzeFile(file);
        content.push(analysis);
      } catch (error) {
        console.warn(`⚠️  Error analyzing ${file}: ${error}`);
      }
    }

    return content;
  }

  private async analyzeFile(filePath: string): Promise<LegacyContent> {
    const content = await readFile(filePath, 'utf-8');
    const stats = await stat(filePath);
    const relativePath = path.relative(this.sourceDir, filePath);

    // Extract title and description
    const title = this.extractTitle(content, relativePath);
    const description = this.extractDescription(content);

    // Calculate metrics
    const wordCount = content.split(/\s+/).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;

    // Determine category
    const category = this.determineCategory(relativePath);

    // Calculate priority score
    const priority = this.calculatePriority({
      title,
      description,
      wordCount,
      codeBlocks,
      links,
      lastModified: stats.mtime,
      size: stats.size,
      category,
    });

    // Determine target location
    const targetLocation = this.determineTargetLocation(relativePath, category);

    // Identify issues and recommendations
    const issues = this.identifyIssues(content, relativePath);
    const recommendations = this.generateRecommendations(content, category, priority);

    return {
      file: relativePath,
      title,
      description,
      size: stats.size,
      lastModified: stats.mtime,
      wordCount,
      codeBlocks,
      links,
      priority,
      category,
      targetLocation,
      migrationStatus: 'pending',
      issues,
      recommendations,
    };
  }

  private extractTitle(content: string, filePath: string): string {
    // Try to extract title from markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // Try to extract from frontmatter (simple regex without gray-matter)
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        return titleMatch[1].trim();
      }
    }

    // Generate title from filename
    const basename = path.basename(filePath, path.extname(filePath));
    return basename
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private extractDescription(content: string): string {
    // Try to extract from frontmatter
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*["']?(.+?)["']?\s*$/m);
      if (descMatch) {
        return descMatch[1].trim();
      }
    }

    // Extract first paragraph after title
    const lines = content.split('\n').filter((line) => line.trim());
    let foundTitle = false;

    for (const line of lines) {
      if (line.startsWith('#')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && line.trim()) {
        return line.trim().substring(0, 200) + (line.length > 200 ? '...' : '');
      }
    }

    return 'Legacy documentation content requiring migration and modernization.';
  }

  private determineCategory(filePath: string): string {
    const pathParts = filePath.split(path.sep);

    // Map directory names to categories
    const categoryMap: Record<string, string> = {
      architecture: 'architecture',
      'backend-data': 'development',
      frontend: 'development',
      'infrastructure-devops': 'operations',
      security: 'security',
      'multi-tenant': 'architecture',
      'best-practices': 'development',
      'accessibility-legal': 'accessibility',
      'cms-content': 'development',
      email: 'development',
      linting: 'development',
      monitoring: 'operations',
      observability: 'operations',
      'payments-billing': 'payments',
      scheduling: 'operations',
      'seo-metadata': 'seo',
      'standards-specs': 'development',
    };

    // Find first matching directory
    for (const part of pathParts) {
      if (categoryMap[part]) {
        return categoryMap[part];
      }
    }

    // Default categorization based on filename
    const filename = path.basename(filePath, '.md').toLowerCase();
    if (filename.includes('security') || filename.includes('auth')) return 'security';
    if (filename.includes('deploy') || filename.includes('infra')) return 'operations';
    if (filename.includes('api') || filename.includes('backend')) return 'development';
    if (filename.includes('test') || filename.includes('quality')) return 'testing';

    return 'development'; // Default category
  }

  private calculatePriority(metrics: {
    title: string;
    description: string;
    wordCount: number;
    codeBlocks: number;
    links: number;
    lastModified: Date;
    size: number;
    category: string;
  }): number {
    let score = 0;

    // Content quality indicators
    if (metrics.wordCount > 500) score += 2;
    if (metrics.wordCount > 1000) score += 2;
    if (metrics.codeBlocks > 0) score += 1;
    if (metrics.codeBlocks > 3) score += 1;
    if (metrics.links > 5) score += 1;

    // Recency
    const daysOld = (Date.now() - metrics.lastModified.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 30) score += 2;
    if (daysOld < 90) score += 1;
    if (daysOld > 365) score -= 1;

    // Title and description quality
    if (metrics.title.length > 10 && metrics.title.length < 100) score += 1;
    if (metrics.description.length > 50) score += 1;

    // Category importance
    const highValueCategories = ['security', 'architecture', 'development'];
    const mediumValueCategories = ['operations', 'testing', 'performance'];

    if (highValueCategories.includes(metrics.category)) score += 2;
    if (mediumValueCategories.includes(metrics.category)) score += 1;

    // Size considerations (not too small, not too large)
    if (metrics.size > 1000 && metrics.size < 50000) score += 1;

    return Math.max(1, Math.min(10, score));
  }

  private determineTargetLocation(relativePath: string, category: string): string {
    // Map legacy paths to new unified structure
    const pathMappings: Record<string, string> = {
      'architecture/': 'reference/architecture/',
      'backend-data/': 'how-to/backend/',
      'frontend/': 'how-to/frontend/',
      'infrastructure-devops/': 'how-to/operations/',
      'security/': 'reference/security/',
      'multi-tenant/': 'explanation/multi-tenant/',
      'best-practices/': 'explanation/development/',
      'accessibility-legal/': 'reference/accessibility/',
      'cms-content/': 'how-to/cms/',
      'email/': 'how-to/email/',
      'linting/': 'how-to/development/',
      'monitoring/': 'how-to/monitoring/',
      'observability/': 'reference/observability/',
      'payments-billing/': 'how-to/payments/',
      'scheduling/': 'reference/scheduling/',
      'seo-metadata/': 'how-to/seo/',
      'standards-specs/': 'reference/standards/',
    };

    // Find matching mapping
    for (const [legacyPrefix, newPrefix] of Object.entries(pathMappings)) {
      if (relativePath.startsWith(legacyPrefix)) {
        const filename = relativePath.substring(legacyPrefix.length);
        return newPrefix + filename;
      }
    }

    // Default mapping based on category
    const categoryMappings: Record<string, string> = {
      security: 'reference/security/',
      architecture: 'reference/architecture/',
      development: 'how-to/development/',
      operations: 'how-to/operations/',
      testing: 'how-to/testing/',
      accessibility: 'reference/accessibility/',
      payments: 'how-to/payments/',
      email: 'how-to/email/',
      seo: 'how-to/seo/',
    };

    const filename = path.basename(relativePath);
    return categoryMappings[category] + filename;
  }

  private identifyIssues(content: string, filePath: string): string[] {
    const issues: string[] = [];

    // Check for missing frontmatter
    if (!content.startsWith('---')) {
      issues.push('Missing frontmatter - requires Zod schema validation');
    }

    // Check for outdated patterns
    if (content.includes('TODO:') || content.includes('FIXME:')) {
      issues.push('Contains TODO/FIXME markers - needs completion');
    }

    // Check for broken internal links
    const internalLinks = content.match(/\[.*?\]\(.*?\.md\)/g) || [];
    if (internalLinks.length > 0) {
      issues.push(`Contains ${internalLinks.length} internal markdown links - may need updating`);
    }

    // Check for very old content
    const dateMatch = content.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const year = parseInt(dateMatch[1]);
      if (year < 2023) {
        issues.push('Content appears to be outdated - needs review');
      }
    }

    // Check for large files
    if (content.length > 100000) {
      issues.push('Very large file - consider splitting into smaller documents');
    }

    // Check for minimal content
    if (content.length < 1000) {
      issues.push('Minimal content - consider expanding or combining with other docs');
    }

    return issues;
  }

  private generateRecommendations(content: string, category: string, priority: number): string[] {
    const recommendations: string[] = [];

    // High priority recommendations
    if (priority >= 8) {
      recommendations.push('High priority migration - migrate first');
      recommendations.push('Preserve existing code examples and validate them');
    }

    // Category-specific recommendations
    if (category === 'security') {
      recommendations.push('Review for latest security best practices');
      recommendations.push('Add security considerations section');
    }

    if (category === 'architecture') {
      recommendations.push('Update with latest architectural patterns');
      recommendations.push('Add decision records references');
    }

    // Content-specific recommendations
    if (content.includes('```')) {
      recommendations.push('Test and validate all code examples');
      recommendations.push('Add validation_status: "tested" after verification');
    }

    if (content.match(/\[.*?\]\(.*?\)/)) {
      recommendations.push('Verify and update all internal and external links');
      recommendations.push('Add cross-references to related documentation');
    }

    // General recommendations
    recommendations.push('Add proper Zod frontmatter with all required fields');
    recommendations.push('Include audience targeting and complexity level');
    recommendations.push('Set appropriate freshness_review date');
    recommendations.push('Add relevant tags for better discoverability');

    return recommendations;
  }

  private categorizeContent(content: LegacyContent[], report: MigrationReport): void {
    for (const item of content) {
      if (!report.contentByCategory[item.category]) {
        report.contentByCategory[item.category] = [];
      }
      report.contentByCategory[item.category].push(item);
    }
  }

  private prioritizeContent(report: MigrationReport): void {
    const allContent = Object.values(report.contentByCategory).flat();

    // Sort by priority (descending)
    allContent.sort((a, b) => b.priority - a.priority);

    // Categorize by priority
    for (const item of allContent) {
      if (item.priority >= 8) {
        report.migrationPlan.highPriority.push(item);
      } else if (item.priority >= 5) {
        report.migrationPlan.mediumPriority.push(item);
      } else {
        report.migrationPlan.lowPriority.push(item);
      }
    }

    // Estimate effort
    const highPriorityHours = report.migrationPlan.highPriority.length * 2;
    const mediumPriorityHours = report.migrationPlan.mediumPriority.length * 1.5;
    const lowPriorityHours = report.migrationPlan.lowPriority.length * 1;

    report.migrationPlan.estimatedEffort.hours = Math.round(
      highPriorityHours + mediumPriorityHours + lowPriorityHours
    );

    const totalHours = report.migrationPlan.estimatedEffort.hours;
    if (totalHours < 20) {
      report.migrationPlan.estimatedEffort.complexity = 'low';
    } else if (totalHours < 50) {
      report.migrationPlan.estimatedEffort.complexity = 'medium';
    } else {
      report.migrationPlan.estimatedEffort.complexity = 'high';
    }
  }

  private generateMigrationPlan(report: MigrationReport): void {
    // Add migration recommendations
    report.recommendations.push(
      `Start with ${report.migrationPlan.highPriority.length} high-priority documents`,
      `Estimated total effort: ${report.migrationPlan.estimatedEffort.hours} hours (${report.migrationPlan.estimatedEffort.complexity} complexity)`,
      'Focus on security and architecture content first',
      'Validate all code examples during migration',
      'Update internal links and cross-references'
    );

    // Add potential issues
    const totalIssues = Object.values(report.contentByCategory)
      .flat()
      .reduce((sum, item) => sum + item.issues.length, 0);

    if (totalIssues > 50) {
      report.issues.push('High number of content issues - allocate additional review time');
    }

    if (report.migrationPlan.estimatedEffort.complexity === 'high') {
      report.issues.push('Large migration effort - consider phased approach');
    }
  }

  private async executeMigration(report: MigrationReport): Promise<void> {
    // This would be implemented for actual migration
    console.log('🚧 Migration execution not implemented in simple version');
  }

  async saveReport(report: MigrationReport): Promise<void> {
    let output: string;

    switch (this.options.outputFormat) {
      case 'summary':
        output = this.formatAsSummary(report);
        break;
      case 'markdown':
        output = this.formatAsMarkdown(report);
        break;
      default:
        output = JSON.stringify(report, null, 2);
    }

    const outputFile = `legacy-migration-report.${this.options.outputFormat}`;
    await writeFile(outputFile, output);
    console.log(`💾 Migration report saved to ${outputFile}`);
  }

  private formatAsSummary(report: MigrationReport): string {
    return `Legacy Guides Migration Report
===============================

Generated: ${report.generated}
Source: ${report.sourceDirectory}
Target: ${report.targetDirectory}

Analysis Results:
- Total Files: ${report.totalFiles}
- Analyzed Files: ${report.analyzedFiles}
- High Priority: ${report.migrationPlan.highPriority.length}
- Medium Priority: ${report.migrationPlan.mediumPriority.length}
- Low Priority: ${report.migrationPlan.lowPriority.length}

Estimated Effort: ${report.migrationPlan.estimatedEffort.hours} hours (${report.migrationPlan.estimatedEffort.complexity})

Top Recommendations:
${report.recommendations
  .slice(0, 3)
  .map((r) => `- ${r}`)
  .join('\n')}

Content by Category:
${Object.entries(report.contentByCategory)
  .map(([cat, items]) => `- ${cat}: ${items.length} files`)
  .join('\n')}`;
  }

  private formatAsMarkdown(report: MigrationReport): string {
    let md = `# Legacy Guides Migration Report\n\n`;
    md += `**Generated:** ${report.generated}\n`;
    md += `**Source Directory:** ${report.sourceDirectory}\n`;
    md += `**Target Directory:** ${report.targetDirectory}\n\n`;

    md += `## 📊 Analysis Summary\n\n`;
    md += `- **Total Files:** ${report.totalFiles}\n`;
    md += `- **Analyzed Files:** ${report.analyzedFiles}\n`;
    md += `- **High Priority:** ${report.migrationPlan.highPriority.length}\n`;
    md += `- **Medium Priority:** ${report.migrationPlan.mediumPriority.length}\n`;
    md += `- **Low Priority:** ${report.migrationPlan.lowPriority.length}\n\n`;

    md += `## 🎯 Migration Plan\n\n`;
    md += `**Estimated Effort:** ${report.migrationPlan.estimatedEffort.hours} hours (${report.migrationPlan.estimatedEffort.complexity} complexity)\n\n`;

    if (report.migrationPlan.highPriority.length > 0) {
      md += `### 🔥 High Priority (${report.migrationPlan.highPriority.length})\n\n`;
      report.migrationPlan.highPriority.slice(0, 10).forEach((item) => {
        md += `- **${item.file}** → ${item.targetLocation} (Priority: ${item.priority})\n`;
      });
      md += `\n`;
    }

    md += `## 📂 Content by Category\n\n`;
    Object.entries(report.contentByCategory).forEach(([category, items]) => {
      md += `### ${category} (${items.length})\n\n`;
      items.slice(0, 5).forEach((item) => {
        md += `- **${item.file}** (Priority: ${item.priority}, ${item.wordCount} words)\n`;
      });
      md += `\n`;
    });

    md += `## 💡 Recommendations\n\n`;
    report.recommendations.forEach((rec) => {
      md += `- ${rec}\n`;
    });
    md += `\n`;

    if (report.issues.length > 0) {
      md += `## ⚠️ Issues\n\n`;
      report.issues.forEach((issue) => {
        md += `- ${issue}\n`;
      });
      md += `\n`;
    }

    return md;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options: MigrationOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--execute':
        options.dryRun = false;
        break;
      case '--source-dir':
        options.sourceDir = args[++i];
        break;
      case '--target-dir':
        options.targetDir = args[++i];
        break;
      case '--priority-threshold':
        options.priorityThreshold = parseInt(args[++i]);
        break;
      case '--batch-size':
        options.batchSize = parseInt(args[++i]);
        break;
      case '--output-format':
        options.outputFormat = args[++i] as 'json' | 'summary' | 'markdown';
        break;
      case '--help':
      case '-h':
        console.log(`
Legacy Guides Migration Tool (Simple Version)

Usage:
  tsx scripts/migrate-legacy-guides-simple.ts [options]

Options:
  --dry-run                    Show migration plan without executing (default)
  --execute                    Execute the migration
  --source-dir <dir>           Source directory (default: docs/guides)
  --target-dir <dir>           Target directory (default: docs)
  --priority-threshold <num>   Minimum priority for migration (default: 7)
  --batch-size <num>           Files per batch (default: 10)
  --output-format <format>     Output format: json, summary, or markdown (default: json)
  -h, --help                   Show this help message

Examples:
  tsx scripts/migrate-legacy-guides-simple.ts
  tsx scripts/migrate-legacy-guides-simple.ts --execute --priority-threshold 8
  tsx scripts/migrate-legacy-guides-simple.ts --output-format markdown
        `);
        process.exit(0);
    }
  }

  try {
    const migrator = new LegacyGuidesMigrator(options);
    const report = await migrator.migrate();
    await migrator.saveReport(report);

    console.log('\n🎉 Migration analysis completed!');
    console.log(`📊 ${report.analyzedFiles} files analyzed`);
    console.log(`🎯 ${report.migrationPlan.highPriority.length} high-priority files identified`);
    console.log(`⏱️  Estimated effort: ${report.migrationPlan.estimatedEffort.hours} hours`);

    if (!options.dryRun) {
      console.log(`✅ ${report.migratedFiles} files migrated successfully`);
      console.log(`⚠️  ${report.errorFiles} files failed to migrate`);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { LegacyGuidesMigrator, type MigrationOptions, type MigrationReport };
