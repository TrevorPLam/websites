#!/bin/bash

echo "🚀 Phase 1: Quick Wins Migration (80% Success Rate)"
echo "================================================"

# Simple UI components with basic Jest patterns
QUICK_WIN_FILES=(
  "packages/ui/src/components/__tests__/Alert.test.tsx"
  "packages/ui/src/components/__tests__/Input.test.tsx"
  "packages/ui/src/components/__tests__/Label.test.tsx"
  "packages/ui/src/components/__tests__/Slider.test.tsx"
  "packages/ui/src/components/__tests__/Tabs.test.tsx"
  "packages/infra/__tests__/border.test.ts"
  "packages/infra/__tests__/color.test.ts"
  "packages/infra/__tests__/create-middleware.test.ts"
  "packages/infra/__tests__/csp.test.ts"
  "packages/infra/__tests__/sanitize.test.ts"
  "packages/infra/__tests__/security-headers.test.ts"
  "packages/infra/__tests__/shadow.test.ts"
  "packages/infra/__tests__/spacing.test.ts"
  "packages/infra/__tests__/typography.test.ts"
)

migrate_file() {
  local file=$1
  echo "🔄 Migrating: $file"
  
  if [ ! -f "$file" ]; then
    echo "⏭️  Skipped: $file (not found)"
    return 1
  fi
  
  # Apply basic Jest to Vitest replacements
  sed -i.bak \
    -e 's/jest\.fn()/vi.fn()/g' \
    -e 's/jest\.mock(/vi.mock(/g' \
    -e 's/jest\.spyOn(/vi.spyOn(/g' \
    -e 's/jest\.clearAllMocks()/vi.clearAllMocks()/g' \
    -e 's/as jest\.Mock/as any/g' \
    -e 's/from ['"'"']@jest\/globals['"'"']/from '\''vitest'\''/g' \
    "$file"
  
  # Add Vitest import if needed
  if ! grep -q "from 'vitest'" "$file"; then
    sed -i.bak '1i import { vi, describe, it, expect, beforeEach, afterEach } from '\''vitest'\'';' "$file"
  fi
  
  echo "✅ Migrated: $file"
  return 0
}

migrated_count=0
skipped_count=0

for file in "${QUICK_WIN_FILES[@]}"; do
  if migrate_file "$file"; then
    ((migrated_count++))
  else
    ((skipped_count++))
  fi
done

echo ""
echo "📊 Phase 1 Results:"
echo "✅ Migrated: $migrated_count files"
echo "⏭️  Skipped: $skipped_count files"
echo "📋 Total processed: ${#QUICK_WIN_FILES[@]} files"

echo ""
echo "🎯 Next steps:"
echo "1. Run tests: pnpm test packages/ui/src/components/__tests__/Button.test.tsx"
echo "2. Fix any failing tests manually"
echo "3. Run Phase 2: node scripts/migrate-medium-complexity.js"
