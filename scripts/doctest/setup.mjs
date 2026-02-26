#!/usr/bin/env node

/**
 * Doctest Configuration and Test Generator
 * 
 * Generates test files for documentation code examples
 * and provides configuration for different testing scenarios.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface DoctestConfig {
  enabled: boolean;
  languages: string[];
  timeout: number;
  tempDir: string;
  excludePatterns: string[];
  includePatterns: string[];
  hooks: {
    beforeAll?: string;
    afterAll?: string;
    beforeEach?: string;
    afterEach?: string;
  };
}

const defaultConfig: DoctestConfig = {
  enabled: true,
  languages: ['javascript', 'typescript', 'bash', 'shell', 'sql', 'json', 'yaml'],
  timeout: 5000,
  tempDir: '.doctest-temp',
  excludePatterns: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**'
  ],
  includePatterns: [
    'docs/**/*.md',
    'docs/**/*.mdx'
  ],
  hooks: {
    beforeAll: 'echo "Starting doctests..."',
    afterAll: 'echo "Doctests completed"',
    beforeEach: 'echo "Testing example..."',
    afterEach: 'echo "Example test completed"'
  }
};

/**
 * Generate doctest configuration file
 */
function generateConfig(): void {
  const configPath = join(process.cwd(), 'doctest.config.json');
  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`✅ Generated doctest configuration: ${configPath}`);
}

/**
 * Generate example test files
 */
function generateExamples(): void {
  const examplesDir = join(process.cwd(), 'scripts', 'doctest', 'examples');
  
  if (!existsSync(examplesDir)) {
    mkdirSync(examplesDir, { recursive: true });
  }

  // JavaScript example
  const jsExample = `
# JavaScript Example

This example demonstrates basic JavaScript functionality:

\`\`\`javascript
const greeting = (name) => {
  return \`Hello, \${name}!\`;
};

// expected: Hello, World!
console.log(greeting('World'));
\`\`\`

This will output "Hello, World!" when executed.
`;

  writeFileSync(join(examplesDir, 'javascript-example.md'), jsExample.trim());

  // TypeScript example
  const tsExample = `
# TypeScript Example

This example demonstrates TypeScript with types:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (name: string, email: string): User => {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email
  };
};

// expected: User object
const user = createUser('John Doe', 'john@example.com');
console.log(JSON.stringify(user, null, 2));
\`\`\`

This creates a typed User object and logs it.
`;

  writeFileSync(join(examplesDir, 'typescript-example.md'), tsExample.trim());

  // Shell example
  const shellExample = `
# Shell Example

This example demonstrates shell commands:

\`\`\`bash
# expected: Current directory
echo "Current directory: $(pwd)"

# expected: Files in current directory
ls -la | head -5
\`\`\`

This shows the current directory and lists files.
`;

  writeFileSync(join(examplesDir, 'shell-example.md'), shellExample.trim());

  console.log(`✅ Generated example files: ${examplesDir}`);
}

/**
 * Generate CI/CD integration script
 */
function generateCIIntegration(): void {
  const ciScript = `
#!/bin/bash

# CI/CD Integration for Doctests
# Part of 2026 Documentation Standards

set -e

echo "🧪 Running documentation doctests..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run doctests
node scripts/doctest/runner.mjs docs

echo "✅ All doctests passed!"
`;

  const ciPath = join(process.cwd(), 'scripts', 'doctest', 'ci-integration.sh');
  writeFileSync(ciPath, ciScript.trim());
  console.log(`✅ Generated CI integration script: ${ciPath}`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  switch (command) {
    case 'config':
      generateConfig();
      break;
    case 'examples':
      generateExamples();
      break;
    case 'ci':
      generateCIIntegration();
      break;
    case 'all':
      generateConfig();
      generateExamples();
      generateCIIntegration();
      console.log('✅ Generated all doctest files');
      break;
    default:
      console.log('Usage: node setup.mjs [config|examples|ci|all]');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { defaultConfig, DoctestConfig };
