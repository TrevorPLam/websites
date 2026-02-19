#!/usr/bin/env node

/**
 * Simple type-check workaround for turbo Windows Application Control issue
 * Runs type-check on key packages in dependency order
 */

const { execSync } = require('child_process');

const packages = [
  'packages/utils',
  'packages/types', 
  'packages/config/eslint-config',
  'packages/config/typescript-config',
  'packages/infra',
  'packages/ui',
  'packages/features',
  'packages/marketing-components',
  'packages/page-templates',
];

function runCommand(command, cwd) {
  try {
    console.log(`📦 ${cwd}: ${command}`);
    execSync(command, { cwd, stdio: 'pipe' });
    console.log(`✅ ${cwd} - OK`);
    return true;
  } catch (error) {
    console.error(`❌ ${cwd} - FAILED`);
    console.error(error.stdout?.toString());
    console.error(error.stderr?.toString());
    return false;
  }
}

function main() {
  console.log('🔍 Running type-check on all packages...\n');
  
  let successCount = 0;
  let totalCount = 0;

  for (const packagePath of packages) {
    totalCount++;
    if (runCommand('pnpm type-check', packagePath)) {
      successCount++;
    }
  }

  console.log(`\n✅ Type-check completed: ${successCount}/${totalCount} packages successful`);
  
  if (successCount !== totalCount) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
