#!/usr/bin/env tsx

/**
 * Master Batch Execution Script
 *
 * Runs all batch fixes in priority order:
 * 1. Security fixes (P1)
 * 2. Component bug fixes (P1)
 * 3. Type safety improvements (P1)
 *
 * Usage: npx tsx scripts/batch-fixes/run-all-fixes.ts
 */

import { runSecurityFixes } from './security-fixes';
import { runComponentFixes } from './component-fixes';
import { runTypeSafetyFixes } from './type-safety-fixes';

interface ExecutionResult {
  phase: string;
  success: boolean;
  duration: number;
  error?: string;
}

async function runPhase(phaseName: string, phaseFunction: () => void): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    console.log(`\n🚀 Starting ${phaseName}...`);
    phaseFunction();
    const duration = Date.now() - startTime;

    return {
      phase: phaseName,
      success: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      phase: phaseName,
      success: false,
      duration,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runAllFixes(): Promise<void> {
  console.log('🎯 MARKETING WEBSITES - BATCH FIX EXECUTION');
  console.log('='.repeat(60));
  console.log('Applying 2026 best practices in priority order...\n');

  const startTime = Date.now();

  // Execute phases in priority order
  const results: ExecutionResult[] = [
    await runPhase('Security Fixes (P1)', runSecurityFixes),
    await runPhase('Component Bug Fixes (P1)', runComponentFixes),
    await runPhase('Type Safety Improvements (P1)', runTypeSafetyFixes),
  ];

  const totalDuration = Date.now() - startTime;

  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 EXECUTION SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  successful.forEach((result) => {
    console.log(`✅ ${result.phase} (${result.duration}ms)`);
  });

  if (failed.length > 0) {
    console.log('\n❌ Failed phases:');
    failed.forEach((result) => {
      console.log(`❌ ${result.phase} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
  }

  console.log(`\n⏱️  Total execution time: ${totalDuration}ms`);
  console.log(`🎯 Success rate: ${successful.length}/${results.length} phases completed`);

  if (failed.length === 0) {
    console.log('\n🎉 ALL FIXES APPLIED SUCCESSFULLY!');
    console.log('🚀 Your codebase now follows 2026 best practices');
    console.log('\nNext steps:');
    console.log('1. Run `pnpm lint` to check for any lint issues');
    console.log('2. Run `pnpm type-check` to verify TypeScript compilation');
    console.log('3. Run `pnpm test` to ensure tests still pass');
    console.log('4. Test the application manually');
  } else {
    console.log('\n⚠️  Some fixes failed. Please review the errors above.');
    console.log('You may need to manually fix some issues.');
  }
}

// Run if executed directly
if (require.main === module) {
  runAllFixes().catch((error) => {
    console.error('❌ Batch execution failed:', error);
    process.exit(1);
  });
}

export { runAllFixes };
