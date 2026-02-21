#!/usr/bin/env tsx

/**
 * Fix unused underscored variables in @repo/ui package
 *
 * This script removes or properly handles variables that were prefixed
 * with underscore but are still completely unused.
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

function fixUnusedUnderscored(content: string): { content: string; fixes: number } {
  let fixes = 0;

  // Remove completely unused underscored parameters from function signatures
  // Pattern: (_param, otherParam) => or (_param: Type, otherParam: Type) =>
  const unusedParamPattern = /\(_([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:][^,)]+\s*,?\s*/g;

  // Remove unused destructured properties
  // Pattern: { _unused, used } or { _unused: alias, used }
  const unusedDestructurePattern = /\{\s*_([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?::[^,}]+)?\s*,?\s*/g;

  let fixedContent = content;

  // Fix unused parameters in function signatures
  fixedContent = fixedContent.replace(unusedParamPattern, (match) => {
    fixes++;
    return ''; // Remove the unused parameter entirely
  });

  // Fix unused destructured properties
  fixedContent = fixedContent.replace(unusedDestructurePattern, (match) => {
    fixes++;
    return ''; // Remove the unused property entirely
  });

  // Clean up double commas or trailing commas that might result
  fixedContent = fixedContent.replace(/\(,\s*/g, '('); // (, param -> (param
  fixedContent = fixedContent.replace(/,\s*,/g, ','); // param,, next -> param,next
  fixedContent = fixedContent.replace(/\{\s*,/g, '{'); // {, prop -> {prop
  fixedContent = fixedContent.replace(/,\s*\}/g, '}'); // {prop, } -> {prop}

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
      const { content: fixedContent, fixes } = fixUnusedUnderscored(originalContent);

      if (fixes > 0) {
        writeFileSync(filePath, fixedContent, 'utf-8');
        console.log(`✅ Fixed ${fixes} unused underscored variables in ${file}`);
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
  console.log('🔧 Fixing unused underscored variables in @repo/ui...\n');

  const results = await fixAllFiles();

  const totalFixes = results.reduce((sum, result) => sum + result.fixes, 0);
  const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0);

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${results.length}`);
  console.log(`   Variables fixed: ${totalFixes}`);
  console.log(`   Errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('\n❌ Some files had errors. Please check the output above.');
    process.exit(1);
  } else {
    console.log('\n✅ All unused underscored variables fixed successfully!');
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
