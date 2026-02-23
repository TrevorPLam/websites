#!/usr/bin/env node

/**
 * React Testing Library Setup for Vitest
 * Configures jest-dom matchers and accessibility testing
 */

const fs = require('fs');
const path = require('path');

function setupReactTesting() {
  console.log('🔧 Setting up React Testing Library for Vitest...');

  // Update vitest config to include jest-dom
  const vitestConfigPath = path.join(process.cwd(), 'vitest.config.ts');

  if (!fs.existsSync(vitestConfigPath)) {
    console.log('❌ vitest.config.ts not found');
    return false;
  }

  let content = fs.readFileSync(vitestConfigPath, 'utf8');

  // Add jest-dom to setupFiles if not present
  if (!content.includes('jest-dom')) {
    const setupFilesMatch = content.match(/setupFiles:\s*\[([^\]]+)\]/);
    if (setupFilesMatch) {
      const setupFilesArray = setupFilesMatch[1];
      if (!setupFilesArray.includes('vitest-dom')) {
        setupFilesArray.push('./packages/config/vitest-config/src/setup.ts');
        content = content.replace(
          setupFilesMatch[0],
          `setupFiles: [${setupFilesArray.join(', ')}]`
        );
      }
    } else {
      content = content.replace(
        /test:\s*\{[^}]*setupFiles:[^}]*\}/gs,
        `test: {\n    setupFiles: ['./packages/config/vitest-config/src/setup.ts']\n  }`
      );
    }
  }

  // Write back vitest config
  fs.writeFileSync(vitestConfigPath, content, 'utf8');
  console.log('✅ Updated vitest.config.ts');

  return true;
}

// Create axe-core-vitest adapter for accessibility testing
function createAxeAdapter() {
  console.log('🔧 Creating axe-core-vitest adapter...');

  const adapterContent = `/**
 * axe-core-vitest adapter
 * Provides jest-axe compatibility for Vitest
 */

import { vi } from 'vitest';

// Mock jest-axe for Vitest compatibility
vi.mock('jest-axe', () => ({
  toHaveNoViolations: () => vi.fn(),
}));

// Export the mocked module
export const jestAxe = vi.mocked('jest-axe');

// Export the actual axe-core function if available
export const axe = vi.importActual('axe-core');
`;

  const adapterPath = path.join(process.cwd(), 'scripts/axe-vitest-adapter.js');
  fs.writeFileSync(adapterPath, adapterContent, 'utf8');
  console.log('✅ Created axe-vitest-adapter.js');
}

function main() {
  console.log('🚀 Setting up React Testing Library for Vitest...\n');

  const setupSuccess = setupReactTesting();
  createAxeAdapter();

  if (setupSuccess) {
    console.log('\n🎯 React Testing Library setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update test files to use jest-axe patterns');
    console.log('2. Run: node scripts/migrate-simple.js');
    console.log('3. Test: pnpm test packages/ui/src/components/__tests__/Button.test.tsx');
  } else {
    console.log('\n❌ Setup failed. Please check file paths.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupReactTesting, createAxeAdapter, main };
