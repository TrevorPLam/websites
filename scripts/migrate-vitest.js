#!/usr/bin/env node

/**
 * Automated Vitest Migration Script
 * Migrates Jest patterns to Vitest in test files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Migration patterns
const MIGRATIONS = [
  // Import statements
  {
    pattern: /import\s*\{\s*describe,\s*it,\s*expect,\s*beforeEach,\s*afterEach\s*\}\s*from\s*['"`]@jest\/globals['"`]/g,
    replacement: "import { describe, it, expect, beforeEach, afterEach } from 'vitest';"
  },
  {
    pattern: /import\s*\{\s*describe,\s*it,\s*expect\s*\}\s*from\s*['"`]@jest\/globals['"`]/g,
    replacement: "import { describe, it, expect } from 'vitest';"
  },
  {
    pattern: /import\s*\{\s*describe,\s*test\s*\}\s*from\s*['"`]@jest\/globals['"`]/g,
    replacement: "import { describe, test } from 'vitest';"
  },
  
  // Mock functions
  {
    pattern: /jest\.fn\(\)/g,
    replacement: "vi.fn()"
  },
  {
    pattern: /jest\.fn\(/g,
    replacement: "vi.fn("
  },
  
  // Mock methods
  {
    pattern: /jest\.mock\(/g,
    replacement: "vi.mock("
  },
  {
    pattern: /jest\.spyOn\(/g,
    replacement: "vi.spyOn("
  },
  {
    pattern: /jest\.clearAllMocks\(\)/g,
    replacement: "vi.clearAllMocks()"
  },
  {
    pattern: /jest\.resetModules\(\)/g,
    replacement: "vi.resetModules()"
  },
  {
    pattern: /jest\.isolateModules\(/g,
    replacement: "vi.isolateModules("
  },
  
  // Mock implementations
  {
    pattern: /\.mockImplementation\(/g,
    replacement: ".mockImplementation("
  },
  {
    pattern: /\.mockReturnValue\(/g,
    replacement: ".mockReturnValue("
  },
  {
    pattern: /\.mockResolvedValue\(/g,
    replacement: ".mockResolvedValue("
  },
  {
    pattern: /\.mockRejectedValue\(/g,
    replacement: ".mockRejectedValue("
  },
  
  // Mock return values
  {
    pattern: /\.mockReturnThis\(\)/g,
    replacement: ".mockReturnThis()"
  },
  
  // Type assertions
  {
    pattern: /as jest\.Mock/g,
    replacement: "as any"
  },
  {
    pattern: /as jest\.MockedFunction/g,
    replacement: "as any"
  },
  
  // Require mock patterns
  {
    pattern: /jest\.requireMock\(/g,
    replacement: "vi.mocked("
  },
  
  // Global mock clearing
  {
    pattern: /beforeEach\(\(\)\s*=>\s*\{\s*jest\.clearAllMocks\(\);\s*\}/g,
    replacement: "beforeEach(() => {\n    vi.clearAllMocks();\n  })"
  }
];

// Files that need special handling
const COMPLEX_FILES = [
  'packages/features/src/__tests__/test-utils.ts',
  'packages/features/src/contact/lib/__tests__/contact-actions.test.ts',
  'packages/integrations/shared/src/__tests__/adapter.test.ts',
  'packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts'
];

// Simple pattern files (high automation success rate)
const SIMPLE_PATTERNS = [
  'packages/ui/**/*.test.tsx',
  'packages/marketing-components/**/*.test.tsx',
  'packages/marketing-components/**/*.test.jsx',
  'packages/infra/**/*.test.ts',
  'packages/features/src/booking/lib/__tests__/booking-*.test.ts',
  'packages/features/src/contact/components/**/*.test.tsx'
];

function migrateFile(filePath) {
  console.log(`🔄 Migrating: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply migrations
  for (const migration of MIGRATIONS) {
    const originalContent = content;
    content = content.replace(migration.pattern, migration.replacement);
    if (content !== originalContent) {
      modified = true;
    }
  }
  
  // Add Vitest import if missing and Jest patterns found
  if (modified && !content.includes("from 'vitest'")) {
    // Find the first import statement and add Vitest import before it
    const importMatch = content.match(/^import\s+.*$/m);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n${importMatch[0]}`
      );
    } else {
      // Add at the beginning if no imports found
      content = `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n${content}`;
    }
  }
  
  // Write back if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Skipped: ${filePath} (no Jest patterns found)`);
    return false;
  }
}

function findTestFiles() {
  const testFiles = [];
  
  // Find all test files
  const files = glob.sync('packages/**/__tests__/**/*.test.*', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/dist/**']
  });
  
  return files.filter(file => {
    // Skip already migrated files
    if (file.includes('booking-actions.test.ts') || 
        file.includes('booking-providers-registry.test.ts') ||
        file.includes('core.test.ts') ||
        file.includes('request-validation.test.ts') ||
        file.includes('tenant-context.test.ts') ||
        file.includes('rate-limit.test.ts') ||
        file.includes('base.test.ts') ||
        file.includes('cn.test.ts') ||
        file.includes('industry-configs.test.ts')) {
      return false;
    }
    
    // Skip complex files for manual review
    return !COMPLEX_FILES.some(complex => file.includes(complex));
  });
}

function main() {
  console.log('🚀 Starting automated Vitest migration...\n');
  
  const testFiles = findTestFiles();
  console.log(`📋 Found ${testFiles.length} test files to process\n`);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const file of testFiles) {
    if (migrateFile(file)) {
      migratedCount++;
    } else {
      skippedCount++;
    }
  }
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Migrated: ${migratedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`📋 Total processed: ${testFiles.length} files`);
  
  console.log(`\n🔴 Manual review required for:`);
  COMPLEX_FILES.forEach(file => {
    console.log(`   - ${file}`);
  });
  
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Run tests to verify migrations: pnpm test`);
  console.log(`2. Fix any failing tests manually`);
  console.log(`3. Review and migrate complex files`);
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, findTestFiles, main };
