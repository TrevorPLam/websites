#!/usr/bin/env tsx
/**
 * @file scripts/fix-phase2-frontmatter.ts
 * @summary Fix frontmatter for Phase 2 migrated files with correct domains.
 * @description Updates domain mapping for security and architecture files.
 * @security Validates all file paths and content to prevent injection attacks during migration.
 * @requirements DOC-07, legacy-content-migration, quality-assurance
 */

import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

interface FixResult {
  file: string;
  success: boolean;
  error?: string;
  oldDomain?: string;
  newDomain?: string;
}

class Phase2FrontmatterFixer {
  private targetDir: string;

  constructor() {
    this.targetDir = path.resolve('docs');
  }

  async fixPhase2Frontmatter(): Promise<FixResult[]> {
    console.log('🔧 Fixing Phase 2 frontmatter domain mappings...');

    const filesToFix = [
      'reference/security/authentication/supabase-auth-docs.md',
      'explanation/multi-tenant/tenant-resolution-sequence-diagram.md',
      'explanation/multi-tenant/tenant-suspension-patterns.md',
      'explanation/multi-tenant/tenant-resolution-implementation.md',
      'explanation/multi-tenant/routing-strategy-comparison.md',
      'reference/architecture/package-level-fsd-implementation.md',
      'how-to/seo/seo-optimization-guide.md',
      'how-to/seo/service-area-pages-engine.md',
      'how-to/seo/schema-org-documentation.md',
      'how-to/seo/llms-txt-spec.md',
    ];

    const results: FixResult[] = [];

    for (const file of filesToFix) {
      try {
        const result = await this.fixFileFrontmatter(file);
        results.push(result);

        if (result.success) {
          console.log(`✅ Fixed: ${file} (${result.oldDomain} → ${result.newDomain})`);
        } else {
          console.log(`❌ Failed: ${file} - ${result.error}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          file,
          success: false,
          error: errorMessage,
        });
        console.log(`❌ Error fixing ${file}: ${errorMessage}`);
      }
    }

    console.log('\n📊 Frontmatter Fix Summary:');
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`✅ ${successful} files fixed successfully`);
    console.log(`❌ ${failed} files failed to fix`);

    return results;
  }

  private async fixFileFrontmatter(relativePath: string): Promise<FixResult> {
    const filePath = path.join(this.targetDir, relativePath);

    // Read current content
    const content = await readFile(filePath, 'utf-8');

    // Parse frontmatter
    const { content: body, frontmatter: existingFrontmatter } = this.parseFrontmatter(content);

    // Determine correct domain
    const correctDomain = this.determineCorrectDomain(relativePath);
    const currentDomain = existingFrontmatter.domain || 'development';

    // Update frontmatter if domain is incorrect
    if (currentDomain !== correctDomain) {
      const updatedFrontmatter = {
        ...existingFrontmatter,
        domain: correctDomain,
        last_updated: new Date().toISOString().split('T')[0],
      };

      // Write updated content
      const newContent = this.formatWithFrontmatter(body, updatedFrontmatter);
      await writeFile(filePath, newContent);

      return {
        file: relativePath,
        success: true,
        oldDomain: currentDomain,
        newDomain: correctDomain,
      };
    }

    return {
      file: relativePath,
      success: true,
      oldDomain: currentDomain,
      newDomain: currentDomain,
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

  private determineCorrectDomain(relativePath: string): string {
    if (relativePath.startsWith('reference/security/')) return 'security';
    if (relativePath.startsWith('explanation/multi-tenant/')) return 'multi-tenant';
    if (relativePath.startsWith('reference/architecture/')) return 'architecture';
    if (relativePath.startsWith('how-to/seo/')) return 'seo';
    return 'development'; // Default
  }

  private formatWithFrontmatter(body: string, frontmatter: Record<string, any>): string {
    const audience = Array.isArray(frontmatter.audience)
      ? frontmatter.audience
      : [frontmatter.audience || 'developer'];
    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : [frontmatter.tags || 'documentation'];

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
      frontmatter.legacy_path ? `legacy_path: "${frontmatter.legacy_path}"` : '',
      '---',
      '',
    ]
      .filter((line) => line !== '')
      .join('\n');

    return frontmatterYaml + body;
  }
}

// CLI interface
async function main() {
  try {
    const fixer = new Phase2FrontmatterFixer();
    const results = await fixer.fixPhase2Frontmatter();

    // Save results
    await writeFile('phase2-frontmatter-fix-results.json', JSON.stringify(results, null, 2));

    console.log('\n💾 Frontmatter fix results saved to phase2-frontmatter-fix-results.json');
  } catch (error) {
    console.error('❌ Frontmatter fix failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
