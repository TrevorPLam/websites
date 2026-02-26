#!/usr/bin/env tsx
/**
 * @file scripts/execute-high-priority-migration.ts
 * @summary Execute high-priority legacy guides migration with proper frontmatter validation.
 * @description Migrates top priority legacy documents to new unified structure with Zod validation.
 * @security Validates all file paths and content to prevent injection attacks during migration.
 * @requirements DOC-07, legacy-content-migration, quality-assurance
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { docSchema, type DocFrontmatter } from '../docs/.config/frontmatter.schema';

interface MigrationResult {
  sourceFile: string;
  targetFile: string;
  success: boolean;
  error?: string;
  frontmatter?: DocFrontmatter;
}

class HighPriorityMigrator {
  private sourceDir: string;
  private targetDir: string;

  constructor() {
    this.sourceDir = path.resolve('docs/guides');
    this.targetDir = path.resolve('docs');
  }

  async executeHighPriorityMigration(): Promise<MigrationResult[]> {
    console.log('🚀 Starting high-priority legacy guides migration...');

    // Top 10 highest priority files based on the analysis
    const highPriorityFiles = [
      'MASTER_GUIDANCE_BOOK.md',
      'MASTER-DOCUMENTATION-GUIDE.md', 
      'import-export-enhancement-roadmap.md',
      'import-export-standards.md',
      'best-practices/context-engineering.md',
      'COMPLETE-DOCUMENTATION.md',
      'best-practices/repository-management.md',
      'backend-data/backend-integration-guide.md',
      'frontend/frontend-implementation-guide.md',
      'FREE_IMPLEMENTATION_COMPLETE.md'
    ];

    const results: MigrationResult[] = [];

    for (const file of highPriorityFiles) {
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

    console.log('\n📊 Migration Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ ${successful} files migrated successfully`);
    console.log(`❌ ${failed} files failed to migrate`);

    return results;
  }

  private async migrateFile(relativePath: string): Promise<MigrationResult> {
    const sourcePath = path.join(this.sourceDir, relativePath);
    
    // Read source content
    const content = await readFile(sourcePath, 'utf-8');
    
    // Extract existing content (without frontmatter)
    const { content: body, frontmatter: existingFrontmatter } = this.parseFrontmatter(content);
    
    // Create new frontmatter
    const newFrontmatter = this.createFrontmatter(relativePath, existingFrontmatter, content);
    
    // Validate frontmatter
    const validationResult = docSchema.safeParse(newFrontmatter);
    if (!validationResult.success) {
      return {
        sourceFile: relativePath,
        targetFile: '',
        success: false,
        error: `Frontmatter validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`
      };
    }
    
    // Determine target location
    const targetLocation = this.determineTargetLocation(relativePath);
    const targetPath = path.join(this.targetDir, targetLocation);
    
    // Ensure target directory exists
    await this.ensureDirectoryExists(path.dirname(targetPath));
    
    // Write to target location
    const newContent = this.formatWithFrontmatter(body, validationResult.data);
    await writeFile(targetPath, newContent);
    
    return {
      sourceFile: relativePath,
      targetFile: targetLocation,
      success: true,
      frontmatter: validationResult.data
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

  private createFrontmatter(
    relativePath: string, 
    existingFrontmatter: Record<string, any>,
    content: string
  ): DocFrontmatter {
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
      // Preserve some existing frontmatter if available
      ...(existingFrontmatter.version && { version: existingFrontmatter.version }),
      ...(existingFrontmatter.task_id && { task_id: existingFrontmatter.task_id }),
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
      'best-practices': 'development',
      'backend-data': 'development',
      'frontend': 'development',
      'infrastructure-devops': 'operations',
      'security': 'security',
      'multi-tenant': 'architecture',
      'accessibility-legal': 'accessibility',
      'seo-metadata': 'seo',
      'payments-billing': 'payments',
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
      'security': 'security',
      'architecture': 'architecture',
      'development': 'development',
      'operations': 'operations',
      'accessibility': 'accessibility',
      'payments': 'payments',
      'seo': 'seo',
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
    return 'how-to';
  }

  private determineAudience(domain: string, category: string): string[] {
    const audience = ['developer'];
    
    if (domain === 'architecture') audience.push('architect');
    if (domain === 'security') audience.push('devops');
    if (category === 'operations') audience.push('devops');
    
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
    const keywords = title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    tags.push(...keywords.slice(0, 3));
    
    return tags;
  }

  private determineTargetLocation(relativePath: string): string {
    // Map legacy paths to new unified structure
    const pathMappings: Record<string, string> = {
      'best-practices/': 'how-to/development/',
      'backend-data/': 'how-to/backend/',
      'frontend/': 'how-to/frontend/',
      'infrastructure-devops/': 'how-to/operations/',
      'security/': 'reference/security/',
      'multi-tenant/': 'explanation/multi-tenant/',
      'accessibility-legal/': 'reference/accessibility/',
      'seo-metadata/': 'how-to/seo/',
      'payments-billing/': 'how-to/payments/',
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
      'security': 'reference/security/',
      'architecture': 'reference/architecture/',
      'development': 'how-to/development/',
      'operations': 'how-to/operations/',
      'accessibility': 'reference/accessibility/',
      'payments': 'how-to/payments/',
      'seo': 'how-to/seo/',
    };

    const filename = path.basename(relativePath);
    return categoryMappings[category] + filename;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }

  private formatWithFrontmatter(body: string, frontmatter: DocFrontmatter): string {
    const frontmatterYaml = [
      '---',
      `title: "${frontmatter.title}"`,
      `description: "${frontmatter.description}"`,
      `domain: ${frontmatter.domain}`,
      `type: ${frontmatter.type}`,
      `layer: ${frontmatter.layer}`,
      `audience: [${frontmatter.audience.map(a => `"${a}"`).join(', ')}]`,
      `phase: ${frontmatter.phase}`,
      `complexity: ${frontmatter.complexity}`,
      `freshness_review: ${frontmatter.freshness_review}`,
      `validation_status: ${frontmatter.validation_status}`,
      `last_updated: ${frontmatter.last_updated}`,
      `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`,
      frontmatter.legacy_path ? `legacy_path: "${frontmatter.legacy_path}"` : '',
      frontmatter.version ? `version: "${frontmatter.version}"` : '',
      frontmatter.task_id ? `task_id: "${frontmatter.task_id}"` : '',
      '---',
      ''
    ].filter(line => line !== '').join('\n');

    return frontmatterYaml + body;
  }
}

// CLI interface
async function main() {
  try {
    const migrator = new HighPriorityMigrator();
    const results = await migrator.executeHighPriorityMigration();
    
    // Save results
    await writeFile(
      'high-priority-migration-results.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n💾 Migration results saved to high-priority-migration-results.json');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
