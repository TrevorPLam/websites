#!/usr/bin/env node

/**
 * Complex Files Manual Migration Guide
 * Files requiring manual review and specialized handling
 */

const fs = require('fs');
const path = require('path');

// Complex files that need manual review
const COMPLEX_FILES = [
  {
    path: 'packages/features/src/__tests__/test-utils.ts',
    reason: 'Shared testing infrastructure - affects all tests',
    patterns: ['jest.fn()', 'jest.mock()', 'jest.spyOn()', 'jest.clearAllMocks()', 'jest.resetModules()'],
    manualSteps: [
      'Review all mock utilities',
      'Update global test setup',
      'Test with multiple test files',
      'Verify mock isolation'
    ]
  },
  {
    path: 'packages/features/src/contact/lib/__tests__/contact-actions.test.ts',
    reason: '17 jest references - complex mocking patterns',
    patterns: ['jest.mock()', 'jest.fn()', 'jest.spyOn()', 'jest.clearAllMocks()'],
    manualSteps: [
      'Update secureAction mocks',
      'Fix form validation patterns',
      'Test contact form functionality',
      'Verify error handling'
    ]
  },
  {
    path: 'packages/integrations/shared/src/__tests__/adapter.test.ts',
    reason: '12 jest references - adapter pattern complexity',
    patterns: ['jest.mock()', 'jest.fn()', 'as jest.MockedFunction'],
    manualSteps: [
      'Update adapter mocks',
      'Fix circuit breaker patterns',
      'Test error recovery',
      'Verify retry logic'
    ]
  },
  {
    path: 'packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts',
    reason: '9 jest references - circuit breaker testing',
    patterns: ['jest.mock()', 'jest.fn()', 'as jest.MockedFunction'],
    manualSteps: [
      'Update circuit breaker mocks',
      'Fix timeout patterns',
      'Test failure scenarios',
      'Verify recovery logic'
    ]
  }
];

function generateManualGuide() {
  console.log('🎯 Complex Files Manual Migration Guide\n');
  console.log('==========================================\n');
  
  COMPLEX_FILES.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}`);
    console.log(`   Reason: ${file.reason}`);
    console.log(`   Patterns: ${file.patterns.join(', ')}`);
    console.log(`   Manual Steps:`);
    file.manualSteps.forEach((step, stepIndex) => {
      console.log(`     ${stepIndex + 1}. ${step}`);
    });
    console.log('');
  });
  
  console.log('🔧 Manual Migration Commands:\n');
  
  COMPLEX_FILES.forEach(file => {
    console.log(`# ${file.path}`);
    console.log(`# Reason: ${file.reason}`);
    console.log(`# Steps:`);
    file.manualSteps.forEach((step, stepIndex) => {
      console.log(`# ${stepIndex + 1}. ${step}`);
    });
    console.log('');
  });
}

function createComplexMigrationScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * Complex File Migration Script
 * For files requiring manual review and specialized handling
 */

const fs = require('fs');
const path = require('path');

function migrateComplexFile(filePath) {
  console.log(\`🔄 Manual migration required: \${filePath}\`);
  
  if (!fs.existsSync(filePath)) {
    console.log(\`❌ File not found: \${filePath}\`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Show current Jest patterns
  const jestPatterns = [
    /jest\\.fn\\(\\)/g,
    /jest\\.mock\\(/g,
    /jest\\.spyOn\\(/g,
    /jest\\.clearAllMocks\\(\\)/g,
    /as jest\\.Mock/g
  ];
  
  console.log(\`📋 Found Jest patterns in \${filePath}:\`);
  jestPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(\`   - \${pattern.source}: \${matches.length} occurrences\`);
    }
  });
  
  console.log(\`\\n🔧 Manual steps required:\`);
  console.log(\`1. Review the file content\`);
  console.log(\`2. Apply Jest to Vitest replacements\`);
  console.log(\`3. Test the migration\`);
  console.log(\`4. Verify functionality\`);
  
  return true;
}

// Process complex files
const complexFiles = ${JSON.stringify(COMPLEX_FILES, null, 2)};

complexFiles.forEach(file => {
  migrateComplexFile(file.path);
});

console.log(\`\\n🎯 Migration complete! Run tests to verify:\`);
console.log(\`pnpm test --run packages/features/src/__tests__/test-utils.ts\`);
`;
  
  const scriptPath = path.join(process.cwd(), 'scripts/migrate-complex-exec.js');
  fs.writeFileSync(scriptPath, scriptContent, 'utf8');
  console.log('✅ Created migrate-complex-exec.js');
}

function main() {
  console.log('🎯 Complex Files Migration Strategy\n');
  console.log('===================================\n');
  
  generateManualGuide();
  createComplexMigrationScript();
  
  console.log('📊 Summary:');
  console.log(`- Complex files: ${COMPLEX_FILES.length}`);
  console.log('- Manual review required for all');
  console.log('- Automated script created for guidance');
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: node scripts/migrate-complex-exec.js');
  console.log('2. Manually review each file');
  console.log('3. Apply Jest to Vitest patterns');
  console.log('4. Test migrations individually');
  console.log('5. Run final test suite');
}

if (require.main === module) {
  main();
}

module.exports = { generateManualGuide, createComplexMigrationScript, main };
