#!/usr/bin/env node

/**
 * Complex File Migration Script
 * For files requiring manual review and specialized handling
 */

const fs = require('fs');
const path = require('path');

function migrateComplexFile(filePath) {
  console.log(`🔄 Manual migration required: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Show current Jest patterns
  const jestPatterns = [
    /jest\.fn\(\)/g,
    /jest\.mock\(/g,
    /jest\.spyOn\(/g,
    /jest\.clearAllMocks\(\)/g,
    /as jest\.Mock/g
  ];
  
  console.log(`📋 Found Jest patterns in ${filePath}:`);
  jestPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`   - ${pattern.source}: ${matches.length} occurrences`);
    }
  });
  
  console.log(`\n🔧 Manual steps required:`);
  console.log(`1. Review the file content`);
  console.log(`2. Apply Jest to Vitest replacements`);
  console.log(`3. Test the migration`);
  console.log(`4. Verify functionality`);
  
  return true;
}

// Process complex files
const complexFiles = [
  {
    "path": "packages/features/src/__tests__/test-utils.ts",
    "reason": "Shared testing infrastructure - affects all tests",
    "patterns": [
      "jest.fn()",
      "jest.mock()",
      "jest.spyOn()",
      "jest.clearAllMocks()",
      "jest.resetModules()"
    ],
    "manualSteps": [
      "Review all mock utilities",
      "Update global test setup",
      "Test with multiple test files",
      "Verify mock isolation"
    ]
  },
  {
    "path": "packages/features/src/contact/lib/__tests__/contact-actions.test.ts",
    "reason": "17 jest references - complex mocking patterns",
    "patterns": [
      "jest.mock()",
      "jest.fn()",
      "jest.spyOn()",
      "jest.clearAllMocks()"
    ],
    "manualSteps": [
      "Update secureAction mocks",
      "Fix form validation patterns",
      "Test contact form functionality",
      "Verify error handling"
    ]
  },
  {
    "path": "packages/integrations/shared/src/__tests__/adapter.test.ts",
    "reason": "12 jest references - adapter pattern complexity",
    "patterns": [
      "jest.mock()",
      "jest.fn()",
      "as jest.MockedFunction"
    ],
    "manualSteps": [
      "Update adapter mocks",
      "Fix circuit breaker patterns",
      "Test error recovery",
      "Verify retry logic"
    ]
  },
  {
    "path": "packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts",
    "reason": "9 jest references - circuit breaker testing",
    "patterns": [
      "jest.mock()",
      "jest.fn()",
      "as jest.MockedFunction"
    ],
    "manualSteps": [
      "Update circuit breaker mocks",
      "Fix timeout patterns",
      "Test failure scenarios",
      "Verify recovery logic"
    ]
  }
];

complexFiles.forEach(file => {
  migrateComplexFile(file.path);
});

console.log(`\n🎯 Migration complete! Run tests to verify:`);
console.log(`pnpm test --run packages/features/src/__tests__/test-utils.ts`);
