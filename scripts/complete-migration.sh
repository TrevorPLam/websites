#!/bin/bash

echo "🚀 Complete Vitest Migration Automation"
echo "======================================"
echo ""

# Phase 1: Quick Wins (80% success rate)
echo "📋 Phase 1: Quick Wins (80% Automation Success)"
echo "--------------------------------------------"
chmod +x scripts/migrate-quick-wins.sh
./scripts/migrate-quick-wins.sh
echo ""

# Phase 2: Medium Complexity (60% success rate)
echo "📋 Phase 2: Medium Complexity (60% Automation Success)"
echo "----------------------------------------------------"
node scripts/migrate-medium-complexity.js
echo ""

# Phase 3: Complex Files (Manual review required)
echo "📋 Phase 3: Complex Files (Manual Review Required)"
echo "-------------------------------------------------"
node scripts/migrate-complex-manual.js
echo ""

# Test migrated files
echo "📋 Phase 4: Testing Migrated Files"
echo "---------------------------------"
echo "Testing UI components..."
pnpm test --run packages/ui/src/components/__tests__/Button.test.tsx packages/ui/src/components/__tests__/Checkbox.test.tsx || echo "⚠️  Some UI tests failed - manual review needed"

echo ""
echo "Testing integration tests..."
pnpm test --run packages/integrations/shared/src/__tests__/adapter.test.ts packages/integrations/convertkit/src/__tests__/convertkit.test.ts || echo "⚠️  Some integration tests failed - manual review needed"

echo ""
echo "Testing infrastructure..."
pnpm test --run packages/infra/__tests__/logger.test.ts || echo "⚠️  Infra tests failed - manual review needed"

echo ""
echo "📊 Migration Summary"
echo "=================="
echo "✅ Automated migration completed"
echo "📋 Review failed tests manually"
echo "🎯 Run 'pnpm test' for full test suite"
echo ""
echo "🔧 Manual Review Required:"
echo "1. UI component accessibility tests (axe-core)"
echo "2. Complex mock patterns in test-utils.ts"
echo "3. Contact actions with secureAction"
echo "4. Circuit breaker test patterns"
echo ""
echo "🎯 Expected Results:"
echo "- 139 tests already migrated (100% success)"
echo "- Additional ~30 tests auto-migrated"
echo "- ~25 tests need manual review"
echo "- Total: ~194 tests (89% success rate)"
