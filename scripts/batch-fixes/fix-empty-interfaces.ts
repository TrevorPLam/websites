#!/usr/bin/env tsx

/**
 * Fix empty interface types in @repo/ui package
 *
 * This script converts:
 * export interface Props extends Something {}
 * to:
 * export type Props = Something
 *
 * Following 2026 TypeScript best practices for type aliases vs interfaces
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

const UI_DIR = join(__dirname, '../../packages/ui/src');

interface FixResult {
  file: string;
  fixes: number;
  errors: string[];
}

function fixEmptyInterfaces(content: string): { content: string; fixes: number } {
  let fixes = 0;

  // Pattern to match empty interfaces that extend something
  // export interface Name extends Something {}
  const emptyInterfacePattern = /export\s+interface\s+(\w+)\s+extends\s+([^{}]+)\s*\{\s*\}/g;

  const fixedContent = content.replace(emptyInterfacePattern, (match, name, baseType) => {
    fixes++;
    // Clean up the base type and convert to type alias
    const cleanBaseType = baseType.trim();
    return `export type ${name} = ${cleanBaseType}`;
  });

  return { content: fixedContent, fixes };
}

async function fixAllFiles(): Promise<FixResult[]> {
  const results: FixResult[] = [];

  // Find all TypeScript files in @repo/ui
  const files = await glob('**/*.tsx', { cwd: UI_DIR });

  for (const file of files) {
    const filePath = join(UI_DIR, file);
    const errors: string[] = [];

    try {
      const originalContent = readFileSync(filePath, 'utf-8');
      const { content: fixedContent, fixes } = fixEmptyInterfaces(originalContent);

      if (fixes > 0) {
        writeFileSync(filePath, fixedContent, 'utf-8');
        console.log(`✅ Fixed ${fixes} empty interfaces in ${file}`);
      }

      results.push({ file, fixes, errors });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(errorMsg);
      results.push({ file, fixes: 0, errors });
      console.error(`❌ Error processing ${file}: ${errorMsg}`);
    }
  }

  return results;
}

async function main() {
  console.log('🔧 Fixing empty interface types in @repo/ui...\n');

  const results = await fixAllFiles();

  const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
  const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0);

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${results.length}`);
  console.log(`   Interfaces fixed: ${totalFixes}`);
  console.log(`   Errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('\n❌ Some files had errors. Please check the output above.');
    process.exit(1);
  } else {
    console.log('\n✅ All empty interface types fixed successfully!');
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
