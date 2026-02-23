#!/usr/bin/env node

/**
 * Complex Test Migration Script
 * Handles files with complex Jest patterns that need manual attention
 */

const fs = require('fs');
const path = require('path');

const COMPLEX_MIGRATIONS = {
  // Contact Actions (17 jest references)
  'packages/features/src/contact/lib/__tests__/contact-actions.test.ts': {
    patterns: [
      { from: /import.*from ['"]@jest\/globals['"];?/g, to: "import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';" },
      { from: /jest\.mock\(/g, to: "vi.mock(" },
      { from: /jest\.fn\(\)/g, to: "vi.fn()" },
      { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
      { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
      { from: /as jest\.Mock/g, to: "as any" },
      { from: /\.mockImplementation\(/g, to: ".mockImplementation(" },
      { from: /\.mockReturnValue\(/g, to: ".mockReturnValue(" },
      { from: /\.mockResolvedValue\(/g, to: ".mockResolvedValue(" }
    ]
  },
  
  // Adapter Tests (12 jest references)
  'packages/integrations/shared/src/__tests__/adapter.test.ts': {
    patterns: [
      { from: /import.*from ['"]@jest\/globals['"];?/g, to: "import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';" },
      { from: /jest\.mock\(/g, to: "vi.mock(" },
      { from: /jest\.fn\(\)/g, to: "vi.fn()" },
      { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
      { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
      { from: /as jest\.MockedFunction/g, to: "as any" },
      { from: /createLogger as jest\.MockedFunction/g, to: "createLogger as any" }
    ]
  },
  
  // Circuit Breaker Basic (9 jest references)
  'packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts': {
    patterns: [
      { from: /import.*from ['"]@jest\/globals['"];?/g, to: "import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';" },
      { from: /jest\.mock\(/g, to: "vi.mock(" },
      { from: /jest\.fn\(\)/g, to: "vi.fn()" },
      { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
      { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
      { from: /as jest\.MockedFunction/g, to: "as any" }
    ]
  }
};

function migrateComplexFile(filePath, config) {
  console.log(`🔄 Migrating complex file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply specific patterns for this file
  for (const { from, to } of config.patterns) {
    const originalContent = content;
    content = content.replace(from, to);
    if (content !== originalContent) {
      modified = true;
      console.log(`  ✅ Applied: ${from.toString().substring(0, 30)}...`);
    }
  }
  
  // Add Vitest import if missing and modifications were made
  if (modified && !content.includes("from 'vitest'")) {
    const importMatch = content.match(/^import\s+.*$/m);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n${importMatch[0]}`
      );
    } else {
      content = `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n${content}`;
    }
  }
  
  // Write back if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

function createTestUtilsMigration() {
  const filePath = 'packages/features/src/__tests__/test-utils.ts';
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  console.log(`🔄 Migrating test utils: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Test utils specific migrations
  const replacements = [
    { from: /jest\.fn\(\)/g, to: "vi.fn()" },
    { from: /jest\.mock\(/g, to: "vi.mock(" },
    { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
    { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
    { from: /jest\.resetModules\(\)/g, to: "vi.resetModules()" },
    { from: /jest\.isolateModules\(/g, to: "vi.isolateModules(" },
    { from: /as jest\.Mock/g, to: "as any" }
  ];
  
  let modified = false;
  for (const { from, to } of replacements) {
    const originalContent = content;
    content = content.replace(from, to);
    if (content !== originalContent) {
      modified = true;
    }
  }
  
  // Add Vitest import
  if (modified && !content.includes("from 'vitest'")) {
    const importMatch = content.match(/^import\s+.*$/m);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n${importMatch[0]}`
      );
    } else {
      content = `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n${content}`;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🎯 Starting complex test migrations...\n');
  
  let migratedCount = 0;
  
  // Migrate complex files
  for (const [filePath, config] of Object.entries(COMPLEX_MIGRATIONS)) {
    if (migrateComplexFile(filePath, config)) {
      migratedCount++;
    }
  }
  
  // Migrate test utils
  if (createTestUtilsMigration()) {
    migratedCount++;
  }
  
  console.log(`\n📊 Complex Migration Summary:`);
  console.log(`✅ Migrated: ${migratedCount} complex files`);
  
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Run tests: pnpm test`);
  console.log(`2. Fix any remaining issues manually`);
  console.log(`3. Verify all Jest patterns are converted`);
}

if (require.main === module) {
  main();
}

module.exports = { migrateComplexFile, createTestUtilsMigration, main };
