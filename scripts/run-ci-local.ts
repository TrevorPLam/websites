#!/usr/bin/env npx tsx
/**
 * @file scripts/run-ci-local.ts
 * @role script
 * @summary Local CI orchestrator - runs all required CI gates in order.
 *          Single command equals full CI pipeline for local development.
 * @security Read-only script, executes existing commands.
 * @adr none
 * @requirements none
 *
 * @exports
 * - CLI: pnpm ci:local
 *
 * @invariants
 * - Runs commands in the correct order matching CI pipeline
 * - Stops immediately if any gate fails
 * - Provides clear feedback on which gate failed
 * - Exit code matches CI expectations (0 for success, 1 for failure)
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-26
 */

import { execSync } from 'child_process';
import path from 'path';

// CI gates in execution order
const CI_GATES = [
  { name: 'Type Check', command: 'pnpm type-check', critical: true },
  { name: 'Lint', command: 'pnpm lint', critical: true },
  { name: 'Unit Tests', command: 'pnpm test', critical: true },
  { name: 'Validate Exports', command: 'pnpm validate:exports', critical: true },
  { name: 'Validate Workspaces', command: 'pnpm validate:workspaces', critical: true },
  { name: 'Health Check', command: 'pnpm health', critical: false }, // Non-critical for CI
];

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function logStep(step: number, total: number, name: string): void {
  console.log(`\n${BLUE}${BOLD}[${step}/${total}]${RESET} ${BOLD}${name}${RESET}`);
  console.log('─'.repeat(60));
}

function logSuccess(name: string, duration: number): void {
  console.log(`${GREEN}✓${RESET} ${name} (${(duration / 1000).toFixed(2)}s)`);
}

function logFailure(name: string, duration: number, error?: Error): void {
  console.log(`${RED}✗${RESET} ${name} (${(duration / 1000).toFixed(2)}s)`);
  if (error) {
    console.log(`${RED}Error:${RESET} ${error.message}`);
  }
}

function logWarning(name: string, duration: number): void {
  console.log(`${YELLOW}⚠${RESET} ${name} (${(duration / 1000).toFixed(2)}s)`);
}

function runCommand(
  command: string,
  critical: boolean
): { success: boolean; duration: number; error?: Error } {
  const startTime = Date.now();

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    const duration = Date.now() - startTime;
    return { success: true, duration };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      duration,
      error: new Error(error.message || 'Command failed'),
    };
  }
}

function main(): void {
  console.log(`${BOLD}🚀 Local CI Orchestrator${RESET}`);
  console.log(`Running ${CI_GATES.length} gates in CI order...\n`);

  let passedCount = 0;
  let failedCount = 0;
  let warningCount = 0;
  const totalDuration = Date.now();

  for (let i = 0; i < CI_GATES.length; i++) {
    const gate = CI_GATES[i];
    logStep(i + 1, CI_GATES.length, gate.name);

    const result = runCommand(gate.command, gate.critical);

    if (result.success) {
      logSuccess(gate.name, result.duration);
      passedCount++;
    } else if (gate.critical) {
      logFailure(gate.name, result.duration, result.error);
      failedCount++;

      console.log(`\n${RED}❌ CI Gate Failed${RESET}`);
      console.log(`${gate.name} is a critical gate. Fix the above errors and re-run.`);
      console.log(`\n${YELLOW}Tip:${RESET} Run the failing command directly for more details:`);
      console.log(`  ${gate.command}`);

      process.exit(1);
    } else {
      logWarning(gate.name, result.duration);
      warningCount++;
    }
  }

  const totalDurationMs = Date.now() - totalDuration;

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`${BOLD}📊 CI Results:${RESET}`);
  console.log(`  ${GREEN}✓ Passed:${RESET} ${passedCount}`);
  console.log(`  ${YELLOW}⚠ Warnings:${RESET} ${warningCount}`);
  console.log(`  ${RED}✗ Failed:${RESET} ${failedCount}`);
  console.log(`  ⏱️  Total Time: ${(totalDurationMs / 1000).toFixed(2)}s`);

  if (failedCount === 0) {
    console.log(`\n${GREEN}🎉 All CI gates passed!${RESET}`);
    console.log(`${GREEN}✅ Ready to commit and push.${RESET}`);
    process.exit(0);
  } else {
    console.log(`\n${RED}❌ CI failed with ${failedCount} critical errors.${RESET}`);
    process.exit(1);
  }
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.error(`\n${RED}Unexpected error:${RESET} ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(`\n${RED}Unhandled rejection:${RESET} ${reason}`);
  process.exit(1);
});

main();
