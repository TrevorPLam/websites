#!/usr/bin/env node

/**
 * Temporary workaround for turbo Windows Application Control policy issue
 * Runs individual package commands directly until turbo is fixed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple YAML parser for workspace packages
function parseWorkspaceYaml(yamlContent) {
  const lines = yamlContent.split('\n');
  const packages = [];
  let inPackages = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === 'packages:') {
      inPackages = true;
      continue;
    }

    if (inPackages && trimmed.startsWith('- ')) {
      packages.push(trimmed.substring(2));
    } else if (inPackages && !trimmed.startsWith('- ') && trimmed !== '') {
      break;
    }
  }

  return packages;
}

// Get packages from workspace
const workspaceYaml = fs.readFileSync('./pnpm-workspace.yaml', 'utf8');
const packagePatterns = parseWorkspaceYaml(workspaceYaml);

// Use glob to expand patterns
const glob = require('glob');
const packages = packagePatterns
  .map((pattern) => {
    return glob.sync(pattern);
  })
  .flat();

function runCommand(command, cwd) {
  try {
    console.log(`📦 Running in ${cwd}: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Failed in ${cwd}: ${command}`);
    console.error(error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'dev';

  console.log(`🚀 Running ${command} across all packages (turbo workaround)...\n`);

  let successCount = 0;
  let totalCount = 0;

  for (const packagePath of packages) {
    const packageJsonPath = path.join(packagePath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};

    // Check if package has the requested script
    if (scripts[command]) {
      totalCount++;
      if (runCommand(`pnpm ${command}`, packagePath)) {
        successCount++;
      }
    }
  }

  console.log(`\n✅ Completed: ${successCount}/${totalCount} packages successful`);

  if (successCount !== totalCount) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCommand };
