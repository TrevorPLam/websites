#!/usr/bin/env node

/**
 * Simple Test Migration Script
 * Handles files with basic Jest patterns (80% success rate)
 */

const fs = require('fs');
const path = require('path');

// Files with simple Jest patterns (high automation success)
const SIMPLE_FILES = [
  'packages/ui/src/components/__tests__/Alert.test.tsx',
  'packages/ui/src/components/__tests__/Input.test.tsx',
  'packages/ui/src/components/__tests__/Label.test.tsx',
  'packages/ui/src/components/__tests__/Slider.test.tsx',
  'packages/ui/src/components/__tests__/Tabs.test.tsx',
  'packages/infra/__tests__/border.test.ts',
  'packages/infra/__tests__/color.test.ts',
  'packages/infra/__tests__/create-middleware.test.ts',
  'packages/infra/__tests__/csp.test.ts',
  'packages/infra/__tests__/sanitize.test.ts',
  'packages/infra/__tests__/security-headers.test.ts',
  'packages/infra/__tests__/shadow.test.ts',
  'packages/infra/__tests__/spacing.test.ts',
  'packages/infra/__tests__/typography.test.ts',
  'packages/features/src/booking/lib/__tests__/booking-repository.test.ts',
  'packages/features/src/booking/lib/__tests__/booking-schema.test.ts',
  'packages/features/src/booking/lib/__tests__/multi-tenant-isolation.test.ts',
  'packages/features/src/search/lib/__tests__/filter-items.test.ts',
  'packages/features/src/search/lib/__tests__/search-index.test.ts'
];

function migrateSimpleFile(filePath) {
  console.log(`🔄 Migrating: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipped: ${filePath} (not found)`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Simple Jest to Vitest replacements
  const replacements = [
    { from: /import.*from ['"]@jest\/globals['"];?/g, to: "import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';" },
    { from: /jest\.fn\(\)/g, to: "vi.fn()" },
    { from: /jest\.mock\(/g, to: "vi.mock(" },
    { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
    { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
    { from: /as jest\.Mock/g, to: "as any" },
    { from: /from ['\"]@jest\/globals['\"]/g, to: "from 'vitest'" },
    { from: /beforeEach\(\(\)\s*=>\s*\{\s*jest\.clearAllMocks\(\);\s*\}/g, to: "beforeEach(() => {\n    vi.clearAllMocks();\n  })" }
  ];
  
  for (const { from, to } of replacements) {
    const originalContent = content;
    content = content.replace(from, to);
    if (content !== originalContent) {
      modified = true;
    }
  }
  
  // Add Vitest import if needed
  if (modified && !content.includes("from 'vitest'")) {
    const importMatch = content.match(/^import\s+.*$/m);
    if (importMatch) {
      content = content.replace(importMatch[0], `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n${importMatch[0]}`);
    } else {
      content = `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n${content}`;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Skipped: ${filePath} (no Jest patterns)`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting simple test migrations...\n');
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const file of SIMPLE_FILES) {
    if (migrateSimpleFile(file)) {
      migratedCount++;
    } else {
      skippedCount++;
    }
  }
  
  console.log(`\n📊 Simple Migration Summary:`);
  console.log(`✅ Migrated: ${migratedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`📋 Total processed: ${SIMPLE_FILES.length} files`);
  
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Run tests: pnpm test --run packages/ui/src/components/__tests__/Button.test.tsx`);
  console.log(`2. Fix any failing tests manually`);
  console.log(`3. Run complex migration for remaining files`);
}

if (require.main === module) {
  main();
}

module.exports = { migrateSimpleFile, main };
