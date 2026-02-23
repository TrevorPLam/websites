#!/bin/bash

# Batch Vitest Migration Script
# Migrates remaining Jest tests to Vitest in batches

echo "🚀 Starting batch Vitest migration..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

# Install glob package if not available
if ! npm list -g glob &> /dev/null; then
    echo "📦 Installing glob package..."
    npm install -g glob
fi

echo "📋 Phase 1: Simple UI Component Tests"
echo "=================================="

# Migrate UI component tests (highest success rate)
node -e "
const fs = require('fs');
const path = require('path');

const uiFiles = [
    'packages/ui/src/components/__tests__/Button.test.tsx',
    'packages/ui/src/components/__tests__/Checkbox.test.tsx',
    'packages/ui/src/components/__tests__/Dialog.test.tsx',
    'packages/marketing-components/src/**/*.test.tsx',
    'packages/marketing-components/dist/**/*.test.jsx'
];

function migrateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(\`⏭️  Skipped: \${filePath} (not found)\`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Basic Jest to Vitest replacements
    const replacements = [
        { from: /jest\.fn\(\)/g, to: 'vi.fn()' },
        { from: /jest\.mock\(/g, to: 'vi.mock(' },
        { from: /jest\.spyOn\(/g, to: 'vi.spyOn(' },
        { from: /jest\.clearAllMocks\(\)/g, to: 'vi.clearAllMocks()' },
        { from: /as jest\.Mock/g, to: 'as any' },
        { from: /from ['\"]@jest\/globals['\"]/g, to: \"from 'vitest'\" }
    ];
    
    for (const { from, to } of replacements) {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    }
    
    // Add Vitest import if needed
    if (modified && !content.includes(\"from 'vitest'\")) {
        const importMatch = content.match(/^import .+$/m);
        if (importMatch) {
            content = content.replace(importMatch[0], \`import { vi, describe, it, expect } from 'vitest';\n\${importMatch[0]}\`);
        } else {
            content = \`import { vi, describe, it, expect } from 'vitest';\n\n\${content}\`;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(\`✅ Migrated: \${filePath}\`);
        return true;
    } else {
        console.log(\`⏭️  Skipped: \${filePath} (no Jest patterns)\`);
        return false;
    }
}

let migrated = 0;
uiFiles.forEach(file => {
    if (migrateFile(file)) migrated++;
});

console.log(\`✅ UI Components: \${migrated} files migrated\`);
"

echo ""
echo "📋 Phase 2: Infrastructure Tests"
echo "================================"

# Migrate infra tests
node -e "
const fs = require('fs');
const path = require('path');

const infraFiles = [
    'packages/infra/__tests__/border.test.ts',
    'packages/infra/__tests__/color.test.ts',
    'packages/infra/__tests__/create-middleware.test.ts',
    'packages/infra/__tests__/csp.test.ts',
    'packages/infra/__tests__/logger.test.ts',
    'packages/infra/__tests__/sanitize.test.ts',
    'packages/infra/__tests__/secure-action.test.ts',
    'packages/infra/__tests__/security-headers.test.ts',
    'packages/infra/__tests__/shadow.test.ts',
    'packages/infra/__tests__/spacing.test.ts',
    'packages/infra/__tests__/typography.test.ts'
];

function migrateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(\`⏭️  Skipped: \${filePath} (not found)\`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Basic Jest to Vitest replacements
    const replacements = [
        { from: /jest\.fn\(\)/g, to: 'vi.fn()' },
        { from: /jest\.mock\(/g, to: 'vi.mock(' },
        { from: /jest\.spyOn\(/g, to: 'vi.spyOn(' },
        { from: /jest\.clearAllMocks\(\)/g, to: 'vi.clearAllMocks()' },
        { from: /as jest\.Mock/g, to: 'as any' },
        { from: /from ['\"]@jest\/globals['\"]/g, to: \"from 'vitest'\" }
    ];
    
    for (const { from, to } of replacements) {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    }
    
    // Add Vitest import if needed
    if (modified && !content.includes(\"from 'vitest'\")) {
        const importMatch = content.match(/^import .+$/m);
        if (importMatch) {
            content = content.replace(importMatch[0], \`import { vi, describe, it, expect, beforeEach } from 'vitest';\n\${importMatch[0]}\`);
        } else {
            content = \`import { vi, describe, it, expect, beforeEach } from 'vitest';\n\n\${content}\`;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(\`✅ Migrated: \${filePath}\`);
        return true;
    } else {
        console.log(\`⏭️  Skipped: \${filePath} (no Jest patterns)\`);
        return false;
    }
}

let migrated = 0;
infraFiles.forEach(file => {
    if (migrateFile(file)) migrated++;
});

console.log(\`✅ Infrastructure: \${migrated} files migrated\`);
"

echo ""
echo "📋 Phase 3: Feature Tests"
echo "========================"

# Migrate feature tests
node -e "
const fs = require('fs');
const path = require('path');

const featureFiles = [
    'packages/features/src/booking/lib/__tests__/booking-repository.test.ts',
    'packages/features/src/booking/lib/__tests__/booking-schema.test.ts',
    'packages/features/src/booking/lib/__tests__/multi-tenant-isolation.test.ts',
    'packages/features/src/contact/lib/__tests__/contact-actions.test.ts',
    'packages/features/src/search/lib/__tests__/filter-items.test.ts',
    'packages/features/src/search/lib/__tests__/search-index.test.ts'
];

function migrateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(\`⏭️  Skipped: \${filePath} (not found)\`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Basic Jest to Vitest replacements
    const replacements = [
        { from: /jest\.fn\(\)/g, to: 'vi.fn()' },
        { from: /jest\.mock\(/g, to: 'vi.mock(' },
        { from: /jest\.spyOn\(/g, to: 'vi.spyOn(' },
        { from: /jest\.clearAllMocks\(\)/g, to: 'vi.clearAllMocks()' },
        { from: /as jest\.Mock/g, to: 'as any' },
        { from: /from ['\"]@jest\/globals['\"]/g, to: \"from 'vitest'\" }
    ];
    
    for (const { from, to } of replacements) {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    }
    
    // Add Vitest import if needed
    if (modified && !content.includes(\"from 'vitest'\")) {
        const importMatch = content.match(/^import .+$/m);
        if (importMatch) {
            content = content.replace(importMatch[0], \`import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\${importMatch[0]}\`);
        } else {
            content = \`import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n\${content}\`;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(\`✅ Migrated: \${filePath}\`);
        return true;
    } else {
        console.log(\`⏭️  Skipped: \${filePath} (no Jest patterns)\`);
        return false;
    }
}

let migrated = 0;
featureFiles.forEach(file => {
    if (migrateFile(file)) migrated++;
});

console.log(\`✅ Features: \${migrated} files migrated\`);
"

echo ""
echo "📋 Phase 4: Integration Tests"
echo "=========================="

# Migrate integration tests
node -e "
const fs = require('fs');
const path = require('path');

const integrationFiles = [
    'packages/integrations/chat/__tests__/adapters.test.ts',
    'packages/integrations/chat/__tests__/consent.test.ts',
    'packages/integrations/convertkit/src/__tests__/convertkit.test.ts',
    'packages/integrations/maps/__tests__/adapters.test.ts',
    'packages/integrations/maps/__tests__/consent.test.ts',
    'packages/integrations/reviews/__tests__/adapters.test.ts',
    'packages/integrations/scheduling/__tests__/adapters.test.ts'
];

function migrateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(\`⏭️  Skipped: \${filePath} (not found)\`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Integration test replacements (more complex)
    const replacements = [
        { from: /jest\.fn\(\)/g, to: 'vi.fn()' },
        { from: /jest\.mock\(/g, to: 'vi.mock(' },
        { from: /jest\.spyOn\(/g, to: 'vi.spyOn(' },
        { from: /jest\.clearAllMocks\(\)/g, to: 'vi.clearAllMocks()' },
        { from: /as jest\.Mock/g, to: 'as any' },
        { from: /from ['\"]@jest\/globals['\"]/g, to: \"from 'vitest'\" },
        { from: /const mockFetch = jest\.fn\(\);/g, to: 'const mockFetch = vi.fn();' },
        { from: /global\.fetch = mockFetch;/g, to: 'global.fetch = mockFetch;' }
    ];
    
    for (const { from, to } of replacements) {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    }
    
    // Add Vitest import if needed
    if (modified && !content.includes(\"from 'vitest'\")) {
        const importMatch = content.match(/^import .+$/m);
        if (importMatch) {
            content = content.replace(importMatch[0], \`import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\${importMatch[0]}\`);
        } else {
            content = \`import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';\n\n\${content}\`;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(\`✅ Migrated: \${filePath}\`);
        return true;
    } else {
        console.log(\`⏭️  Skipped: \${filePath} (no Jest patterns)\`);
        return false;
    }
}

let migrated = 0;
integrationFiles.forEach(file => {
    if (migrateFile(file)) migrated++;
});

console.log(\`✅ Integration: \${migrated} files migrated\`);
"

echo ""
echo "🎯 Migration Complete!"
echo "===================="
echo ""
echo "📊 Next steps:"
echo "1. Run tests to verify migrations: pnpm test"
echo "2. Fix any failing tests manually"
echo "3. Review complex files that need manual attention:"
echo "   - packages/features/src/__tests__/test-utils.ts"
echo "   - packages/features/src/contact/lib/__tests__/contact-actions.test.ts"
echo "   - packages/integrations/shared/src/__tests__/adapter.test.ts"
echo "   - packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts"
echo ""
echo "🚀 Run 'pnpm test' to verify all migrations!"
