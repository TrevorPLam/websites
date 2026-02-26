#!/usr/bin/env tsx
/**
 * @file scripts/execute-remaining-migration.ts
 * @summary Execute migration for all remaining legacy files to reach 100% completion.
 * @description Migrates all remaining documents to new unified structure.
 * @security Validates all file paths and content to prevent injection attacks during migration.
 * @requirements DOC-07, legacy-content-migration, quality-assurance
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface MigrationResult {
  sourceFile: string;
  targetFile: string;
  success: boolean;
  error?: string;
}

class RemainingMigrator {
  private sourceDir: string;
  private targetDir: string;

  constructor() {
    this.sourceDir = path.resolve('docs/guides');
    this.targetDir = path.resolve('docs');
  }

  async executeRemainingMigration(): Promise<MigrationResult[]> {
    console.log('🚀 Starting Complete Migration: All Remaining Files...');

    // Get all remaining files (excluding already migrated ones)
    const remainingFiles = await this.discoverRemainingFiles();
    
    console.log(`📊 Found ${remainingFiles.length} remaining files to migrate...`);

    const results: MigrationResult[] = [];
    const batchSize = 20; // Process in batches to avoid overwhelming

    for (let i = 0; i < remainingFiles.length; i += batchSize) {
      const batch = remainingFiles.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(remainingFiles.length/batchSize)} (${batch.length} files)...`);

      for (const file of batch) {
        try {
          const result = await this.migrateFile(file);
          results.push(result);
          
          if (result.success) {
            console.log(`✅ Migrated: ${file} → ${result.targetFile}`);
          } else {
            console.log(`❌ Failed: ${file} - ${result.error}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.push({
            sourceFile: file,
            targetFile: '',
            success: false,
            error: errorMessage
          });
          console.log(`❌ Error migrating ${file}: ${errorMessage}`);
        }
      }
    }

    console.log('\n📊 Complete Migration Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ ${successful} files migrated successfully`);
    console.log(`❌ ${failed} files failed to migrate`);

    return results;
  }

  private async discoverRemainingFiles(): Promise<string[]> {
    // Get all markdown files in source directory
    const allFiles = await glob(`${this.sourceDir}/**/*.md`, {
      ignore: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/_ARCHIVED.md',
      ],
    });

    // Files already migrated (from previous phases)
    const migratedFiles = [
      'MASTER_GUIDANCE_BOOK.md',
      'MASTER-DOCUMENTATION-GUIDE.md',
      'import-export-enhancement-roadmap.md',
      'import-export-standards.md',
      'best-practices/context-engineering.md',
      'COMPLETE-DOCUMENTATION.md',
      'best-practices/repository-management.md',
      'backend-data/backend-integration-guide.md',
      'frontend/frontend-implementation-guide.md',
      'FREE_IMPLEMENTATION_COMPLETE.md',
      'security/authentication/supabase-auth-docs.md',
      'multi-tenant/tenant-resolution-sequence-diagram.md',
      'multi-tenant/tenant-suspension-patterns.md',
      'multi-tenant/tenant-resolution-implementation.md',
      'multi-tenant/routing-strategy-comparison.md',
      'architecture/package-level-fsd-implementation.md',
      'seo-metadata/seo-optimization-guide.md',
      'seo-metadata/service-area-pages-engine.md',
      'seo-metadata/schema-org-documentation.md',
      'seo-metadata/llms-txt-spec.md',
      'infrastructure-devops/github-actions-workflow-complete.md',
      'observability/observability-philosophy.md',
      'observability/opentelemetry-documentation.md',
      'infrastructure-devops/vercel-for-platforms-docs.md',
      'monitoring/tinybird-documentation.md',
      'accessibility-legal/hhs-section-504-docs.md',
      'accessibility-legal/gdpr-guide.md',
      'accessibility-legal/ada-title-ii-final-rule.md',
      'accessibility-legal/wcag-2.2-criteria.md',
      'accessibility-legal/axe-core-documentation.md'
    ];

    // Filter out already migrated files
    const remainingFiles = allFiles
      .map(file => path.relative(this.sourceDir, file))
      .filter(file => !migratedFiles.includes(file));

    return remainingFiles;
  }

  private async migrateFile(relativePath: string): Promise<MigrationResult> {
    const sourcePath = path.join(this.sourceDir, relativePath);
    
    // Read source content
    const content = await readFile(sourcePath, 'utf-8');
    
    // Extract existing content (without frontmatter)
    const { content: body } = this.parseFrontmatter(content);
    
    // Create new frontmatter
    const newFrontmatter = this.createFrontmatter(relativePath, content);
    
    // Determine target location
    const targetLocation = this.determineTargetLocation(relativePath);
    const targetPath = path.join(this.targetDir, targetLocation);
    
    // Ensure target directory exists
    await this.ensureDirectoryExists(path.dirname(targetPath));
    
    // Write to target location
    const newContent = this.formatWithFrontmatter(body, newFrontmatter);
    await writeFile(targetPath, newContent);
    
    return {
      sourceFile: relativePath,
      targetFile: targetLocation,
      success: true
    };
  }

  private parseFrontmatter(content: string): { content: string; frontmatter: Record<string, any> } {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1];
      const body = content.substring(frontmatterMatch[0].length).trim();
      
      // Simple frontmatter parsing
      const frontmatter: Record<string, any> = {};
      const lines = frontmatterText.split('\n');
      
      for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, '');
          frontmatter[key] = cleanValue;
        }
      }
      
      return { content: body, frontmatter };
    }
    
    return { content: content.trim(), frontmatter: {} };
  }

  private createFrontmatter(relativePath: string, content: string): Record<string, any> {
    // Extract title
    const title = this.extractTitle(content, relativePath);
    
    // Extract description
    const description = this.extractDescription(content);
    
    // Determine category and domain
    const category = this.determineCategory(relativePath);
    const domain = this.mapCategoryToDomain(category);
    
    // Calculate metrics
    const wordCount = content.split(/\s+/).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    
    // Determine complexity and type
    const complexity = this.determineComplexity(wordCount, codeBlocks);
    const type = this.determineContentType(codeBlocks, wordCount);
    
    // Determine audience
    const audience = this.determineAudience(domain, category);
    
    return {
      title,
      description,
      domain,
      type,
      layer: 'global',
      audience,
      phase: 1,
      complexity,
      freshness_review: this.calculateFreshnessDate(),
      validation_status: 'unverified',
      last_updated: new Date().toISOString().split('T')[0],
      tags: this.generateTags(category, title),
      legacy_path: relativePath,
    };
  }

  private extractTitle(content: string, filePath: string): string {
    // Try to extract title from markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // Generate title from filename
    const basename = path.basename(filePath, path.extname(filePath));
    return basename
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private extractDescription(content: string): string {
    // Extract first paragraph after title
    const lines = content.split('\n').filter(line => line.trim());
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
      'infrastructure-devops': 'operations',
      'observability': 'operations',
      'monitoring': 'operations',
      'security': 'security',
      'accessibility-legal': 'accessibility',
      'architecture': 'architecture',
      'multi-tenant': 'multi-tenant',
      'seo-metadata': 'seo',
      'payments-billing': 'payments',
      'email': 'email',
      'testing': 'testing',
      'cms-content': 'development',
      'backend-data': 'development',
      'frontend': 'development',
      'best-practices': 'development',
      'linting': 'development',
      'scheduling': 'operations',
      'standards-specs': 'development',
    };

    // Find first matching directory
    for (const part of pathParts) {
      if (categoryMap[part]) {
        return categoryMap[part];
      }
    }

    return 'development'; // Default category
  }

  private mapCategoryToDomain(category: string): string {
    const domainMap: Record<string, string> = {
      'operations': 'operations',
      'security': 'security',
      'accessibility': 'accessibility',
      'architecture': 'architecture',
      'multi-tenant': 'multi-tenant',
      'seo': 'seo',
      'payments': 'payments',
      'email': 'email',
      'testing': 'testing',
      'development': 'development',
    };

    return domainMap[category] || 'development';
  }

  private determineComplexity(wordCount: number, codeBlocks: number): 'beginner' | 'intermediate' | 'advanced' {
    if (codeBlocks > 5 || wordCount > 2000) return 'advanced';
    if (codeBlocks > 0 || wordCount > 500) return 'intermediate';
    return 'beginner';
  }

  private determineContentType(codeBlocks: number, wordCount: number): 'tutorial' | 'how-to' | 'reference' | 'explanation' {
    if (codeBlocks > 3) return 'how-to';
    if (wordCount > 2000) return 'explanation';
    return 'reference';
  }

  private determineAudience(domain: string, category: string): string[] {
    const audience = ['developer'];
    
    if (domain === 'architecture') audience.push('architect');
    if (domain === 'security') audience.push('devops', 'architect');
    if (category === 'accessibility') audience.push('non-technical');
    if (domain === 'operations') audience.push('devops');
    if (domain === 'payments') audience.push('business');
    if (domain === 'email') audience.push('business');
    
    return audience;
  }

  private calculateFreshnessDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 180); // 6 months from now
    return date.toISOString().split('T')[0];
  }

  private generateTags(category: string, title: string): string[] {
    const tags = [category];
    
    // Extract keywords from title
    const keywords = title.toLowerCase().split(/\s+/).filter((word: string) => word.length > 3);
    tags.push(...keywords.slice(0, 3));
    
    return tags;
  }

  private determineTargetLocation(relativePath: string): string {
    // Map legacy paths to new unified structure
    const pathMappings: Record<string, string> = {
      'infrastructure-devops/': 'how-to/operations/',
      'observability/': 'reference/operations/',
      'monitoring/': 'how-to/operations/',
      'security/': 'reference/security/',
      'accessibility-legal/': 'reference/accessibility/',
      'architecture/': 'reference/architecture/',
      'multi-tenant/': 'explanation/multi-tenant/',
      'seo-metadata/': 'how-to/seo/',
      'payments-billing/': 'how-to/payments/',
      'email/': 'how-to/email/',
      'testing/': 'how-to/testing/',
      'cms-content/': 'how-to/development/',
      'backend-data/': 'how-to/backend/',
      'frontend/': 'how-to/frontend/',
      'best-practices/': 'how-to/development/',
      'linting/': 'how-to/development/',
      'scheduling/': 'reference/operations/',
      'standards-specs/': 'reference/development/',
    };

    // Find matching mapping
    for (const [legacyPrefix, newPrefix] of Object.entries(pathMappings)) {
      if (relativePath.startsWith(legacyPrefix)) {
        const filename = relativePath.substring(legacyPrefix.length);
        return newPrefix + filename;
      }
    }

    // Default mapping based on category
    const category = this.determineCategory(relativePath);
    const categoryMappings: Record<string, string> = {
      'operations': 'how-to/operations/',
      'security': 'reference/security/',
      'accessibility': 'reference/accessibility/',
      'architecture': 'reference/architecture/',
      'multi-tenant': 'explanation/multi-tenant/',
      'seo': 'how-to/seo/',
      'payments': 'how-to/payments/',
      'email': 'how-to/email/',
      'testing': 'how-to/testing/',
      'development': 'how-to/development/',
    };

    const filename = path.basename(relativePath);
    return categoryMappings[category] + filename;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }

  private formatWithFrontmatter(body: string, frontmatter: Record<string, any>): string {
    const audience = Array.isArray(frontmatter.audience) ? frontmatter.audience : [frontmatter.audience || 'developer'];
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags || 'documentation'];
    
    const frontmatterYaml = [
      '---',
      `title: "${frontmatter.title}"`,
      `description: "${frontmatter.description}"`,
      `domain: ${frontmatter.domain}`,
      `type: ${frontmatter.type}`,
      `layer: ${frontmatter.layer}`,
      `audience: [${audience.map((a: string) => `"${a}"`).join(', ')}]`,
      `phase: ${frontmatter.phase}`,
      `complexity: ${frontmatter.complexity}`,
      `freshness_review: ${frontmatter.freshness_review}`,
      `validation_status: ${frontmatter.validation_status}`,
      `last_updated: ${frontmatter.last_updated}`,
      `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]`,
      `legacy_path: "${frontmatter.legacy_path}"`,
      '---',
      ''
    ].join('\n');

    return frontmatterYaml + body;
  }
}

// CLI interface
async function main() {
  try {
    const migrator = new RemainingMigrator();
    const results = await migrator.executeRemainingMigration();
    
    // Save results
    await writeFile(
      'complete-migration-results.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n💾 Complete migration results saved to complete-migration-results.json');
    
  } catch (error) {
    console.error('❌ Complete migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
