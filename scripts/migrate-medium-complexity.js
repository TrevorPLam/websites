#!/usr/bin/env node

/**
 * Medium Complexity Migration Script
 * Handles files with moderate Jest patterns (60% success rate)
 */

const fs = require('fs');
const path = require('path');

// Files with medium complexity Jest patterns
const MEDIUM_FILES = [
  'packages/features/src/booking/lib/__tests__/booking-repository.test.ts',
  'packages/features/src/booking/lib/__tests__/booking-schema.test.ts',
  'packages/features/src/booking/lib/__tests__/multi-tenant-isolation.test.ts',
  'packages/features/src/search/lib/__tests__/filter-items.test.ts',
  'packages/features/src/search/lib/__tests__/search-index.test.ts',
  'packages/integrations/chat/__tests__/adapters.test.ts',
  'packages/integrations/chat/__tests__/consent.test.ts',
  'packages/integrations/maps/__tests__/adapters.test.ts',
  'packages/integrations/maps/__tests__/consent.test.ts',
  'packages/integrations/reviews/__tests__/adapters.test.ts',
  'packages/integrations/scheduling/__tests__/adapters.test.ts',
  'packages/integrations/supabase/__tests__/supabase-security.test.ts',
  'packages/marketing-components/src/comparison/__tests__/ComparisonTable.test.tsx',
  'packages/marketing-components/src/hero/__tests__/HeroCentered.test.tsx',
  'packages/marketing-components/src/location/__tests__/LocationCard.test.tsx'
];

function migrateMediumFile(filePath) {
  console.log(`🔄 Migrating: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipped: ${filePath} (not found)`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Medium complexity Jest to Vitest replacements
  const replacements = [
    { from: /import.*from ['"]@jest\/globals['"];?/g, to: "import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';" },
    { from: /jest\.fn\(\)/g, to: "vi.fn()" },
    { from: /jest\.mock\(/g, to: "vi.mock(" },
    { from: /jest\.spyOn\(/g, to: "vi.spyOn(" },
    { from: /jest\.clearAllMocks\(\)/g, to: "vi.clearAllMocks()" },
    { from: /jest\.resetModules\(\)/g, to: "vi.resetModules()" },
    { from: /jest\.isolateModules\(/g, to: "vi.isolateModules(" },
    { from: /as jest\.Mock/g, to: "as any" },
    { from: /as jest\.MockedFunction/g, to: "as any" },
    { from: /from ['\"]@jest\/globals['\"]/g, to: "from 'vitest'" },
    { from: /const mockFetch = jest\.fn\(\);/g, to: "const mockFetch = vi.fn();" },
    { from: /global\.fetch = mockFetch;/g, to: "global.fetch = mockFetch;" },
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
  console.log('🚀 Starting medium complexity migrations...\n');
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const file of MEDIUM_FILES) {
    if (migrateMediumFile(file)) {
      migratedCount++;
    } else {
      skippedCount++;
    }
  }
  
  console.log(`\n📊 Medium Complexity Migration Summary:`);
  console.log(`✅ Migrated: ${migratedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`📋 Total processed: ${MEDIUM_FILES.length} files`);
  
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Run tests: pnpm test --run packages/features/src/booking/lib/__tests__/booking-repository.test.ts`);
  console.log(`2. Fix any failing tests manually`);
  console.log(`3. Run Phase 3: node scripts/migrate-complex.js`);
}

if (require.main === module) {
  main();
}

module.exports = { migrateMediumFile, main };
