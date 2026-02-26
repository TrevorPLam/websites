#!/bin/bash

# MCP/Skills Workspace Validation Script
# Validates the refactored MCP/skills structure

set -e

echo "🔍 Validating MCP/Skills workspace structure..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to run a validation check
validate_check() {
    local description="$1"
    local command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    print_status "Checking: $description"
    
    if eval "$command"; then
        print_success "✓ $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_error "✗ $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".mcp" ]; then
    print_error "Please run this script from the repository root directory"
    exit 1
fi

print_status "Starting MCP/Skills workspace validation..."

# Phase 1: Directory Structure Validation
print_status "Phase 1: Validating directory structure..."

validate_check ".mcp/manifests directory exists" "[ -d .mcp/manifests ]"
validate_check "skills/core directory exists" "[ -d skills/core ]"
validate_check "skills/integration directory exists" "[ -d skills/integration ]"
validate_check "skills/domain directory exists" "[ -d skills/domain ]"
validate_check "skills/templates directory exists" "[ -d skills/templates ]"
validate_check "docs/mcp/tutorials directory exists" "[ -d docs/mcp/tutorials ]"
validate_check "docs/mcp/how-to directory exists" "[ -d docs/mcp/how-to ]"
validate_check "docs/mcp/reference directory exists" "[ -d docs/mcp/reference ]"
validate_check "docs/mcp/explanation directory exists" "[ -d docs/mcp/explanation ]"
validate_check "scripts/mcp directory exists" "[ -d scripts/mcp ]"

# Phase 2: Configuration Files Validation
print_status "Phase 2: Validating configuration files..."

validate_check ".mcp/config.json exists" "[ -f .mcp/config.json ]"
validate_check ".mcp/config.development.json exists" "[ -f .mcp/config.development.json ]"
validate_check ".mcp/config.production.json exists" "[ -f .mcp/config.production.json ]"
validate_check ".mcp/manifests/security-audit.json exists" "[ -f .mcp/manifests/security-audit.json ]"
validate_check ".mcp/manifests/supply-chain-safety.json exists" "[ -f .mcp/manifests/supply-chain-safety.json ]"
validate_check ".mcp/manifests/trusted-manifest.json exists" "[ -f .mcp/manifests/trusted-manifest.json ]"

# Phase 3: Skills Files Validation
print_status "Phase 3: Validating skills files..."

validate_check "Core deploy skill exists" "[ -f skills/core/deploy/SKILL.md ]"
validate_check "Core review skill exists" "[ -f skills/core/review/SKILL.md ]"
validate_check "Core test skill exists" "[ -f skills/core/test/SKILL.md ]"
validate_check "Integration azure skill exists" "[ -f skills/integration/azure/SKILL.md ]"
validate_check "Domain marketing skill exists" "[ -f skills/domain/marketing/SKILL.md ]"
validate_check "Skill templates exist" "[ -f skills/templates/workflow-skill.md ]"
validate_check "Integration template exists" "[ -f skills/templates/integration-skill.md ]"

# Phase 4: Documentation Files Validation
print_status "Phase 4: Validating documentation files..."

validate_check "Getting started tutorial exists" "[ -f docs/mcp/tutorials/getting-started.md ]"
validate_check "MCP basics tutorial exists" "[ -f docs/mcp/tutorials/mcp-basics.md ]"
validate_check "AI integration guide exists" "[ -f docs/mcp/how-to/ai-integration.md ]"
validate_check "Git server setup guide exists" "[ -f docs/mcp/how-to/git-server-setup.md ]"
validate_check "Production deployment guide exists" "[ -f docs/mcp/how-to/production-deployment.md ]"
validate_check "Configuration reference exists" "[ -f docs/mcp/reference/configuration-reference.md ]"
validate_check "Skill format reference exists" "[ -f docs/mcp/reference/skill-format.md ]"
validate_check "Skills guide exists" "[ -f docs/mcp/reference/skills-guide.md ]"
validate_check "Implementation guide exists" "[ -f docs/mcp/explanation/implementation-guide.md ]"
validate_check "Advanced research exists" "[ -f docs/mcp/explanation/advanced-research-2026.md ]"
validate_check "A2A integration guide exists" "[ -f docs/mcp/how-to/a2a-integration.md ]"

# Phase 5: Scripts Validation
print_status "Phase 5: Validating scripts..."

validate_check "Setup script exists" "[ -f scripts/mcp/setup.sh ]"
validate_check "Setup batch file exists" "[ -f scripts/mcp/setup.bat ]"
validate_check "Migration script exists" "[ -f scripts/mcp/migrate.sh ]"
validate_check "Validation script exists" "[ -f scripts/mcp/validate.sh ]"
validate_check "Dev workflow script exists" "[ -f scripts/mcp/dev-workflow.js ]"
validate_check "Setup development script exists" "[ -f scripts/mcp/setup-development.js ]"
validate_check "Test AI integration script exists" "[ -f scripts/mcp/test-ai-integration.js ]"
validate_check "Test development script exists" "[ -f scripts/mcp/test-development.js ]"
validate_check "Test integration script exists" "[ -f scripts/mcp/test-integration.js ]"
validate_check "Validate production script exists" "[ -f scripts/mcp/validate-production.js ]"

# Phase 6: Navigation Files Validation
print_status "Phase 6: Validating navigation files..."

validate_check "MCP index exists" "[ -f MCP_INDEX.md ]"
validate_check "Root README exists" "[ -f README.md ]"

# Phase 7: Configuration Validation
print_status "Phase 7: Validating configuration syntax..."

validate_check "MCP config is valid JSON" "node -e 'JSON.parse(require(\"fs\").readFileSync(\".mcp/config.json\", \"utf8\"))' 2>/dev/null"
validate_check "Development config is valid JSON" "node -e 'JSON.parse(require(\"fs\").readFileSync(\".mcp/config.development.json\", \"utf8\"))' 2>/dev/null"
validate_check "Production config is valid JSON" "node -e 'JSON.parse(require(\"fs\").readFileSync(\".mcp/config.production.json\", \"utf8\"))' 2>/dev/null"

# Phase 8: Skills Frontmatter Validation
print_status "Phase 8: Validating skills frontmatter..."

validate_skill_frontmatter() {
    local skill_file="$1"
    if [ -f "$skill_file" ]; then
        # Check if file has YAML frontmatter
        if head -n 1 "$skill_file" | grep -q "^---"; then
            # Extract frontmatter and check for required fields
            frontmatter=$(sed -n '/^---/,/^---/p' "$skill_file" | head -n -1 | tail -n +2)
            
            if echo "$frontmatter" | grep -q "name:" && echo "$frontmatter" | grep -q "description:" && echo "$frontmatter" | grep -q "meta:"; then
                return 0
            fi
        fi
    fi
    return 1
}

validate_check "Core deploy skill frontmatter is valid" "validate_skill_frontmatter skills/core/deploy/SKILL.md"
validate_check "Core review skill frontmatter is valid" "validate_skill_frontmatter skills/core/review/SKILL.md"
validate_check "Integration azure skill frontmatter is valid" "validate_skill_frontmatter skills/integration/azure/SKILL.md"

# Phase 9: Package Structure Validation
print_status "Phase 9: Validating package structure..."

validate_check "packages/mcp-servers exists" "[ -d packages/mcp-servers ]"
validate_check "packages/mcp-servers/src exists" "[ -d packages/mcp-servers/src ]"
validate_check "packages/mcp-servers/package.json exists" "[ -f packages/mcp-servers/package.json ]"

# Check for key MCP server files
validate_check "Enterprise registry server exists" "[ -f packages/mcp-servers/src/enterprise-registry.ts ]"
validate_check "Security gateway server exists" "[ -f packages/mcp-servers/src/enterprise-security-gateway.ts ]"
validate_check "Sequential thinking server exists" "[ -f packages/mcp-servers/src/sequential-thinking.ts ]"
validate_check "GitHub server exists" "[ -f packages/mcp-servers/src/github-server.ts ]"

# Phase 10: Workspace Configuration Validation
print_status "Phase 10: Validating workspace configuration..."

validate_check "pnpm-workspace.yaml exists" "[ -f pnpm-workspace.yaml ]"
validate_check "Root package.json exists" "[ -f package.json ]"
validate_check "tsconfig.base.json exists" "[ -f tsconfig.base.json ]"

# Check if workspace includes MCP packages
if grep -q "packages/mcp-servers" pnpm-workspace.yaml; then
    print_success "✓ Workspace includes MCP servers package"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    print_error "✗ Workspace missing MCP servers package"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Phase 11: File Permissions Validation
print_status "Phase 11: Validating file permissions..."

validate_check "Setup script is executable" "[ -x scripts/mcp/setup.sh ]"
validate_check "Migration script is executable" "[ -x scripts/mcp/migrate.sh ]"
validate_check "Validation script is executable" "[ -x scripts/mcp/validate.sh ]"

# Phase 12: Content Validation
print_status "Phase 12: Validating content quality..."

# Check if MCP_INDEX.md has expected sections
if [ -f "MCP_INDEX.md" ]; then
    if grep -q "## Quick Start" MCP_INDEX.md && grep -q "## Configuration" MCP_INDEX.md && grep -q "## Skills" MCP_INDEX.md; then
        print_success "✓ MCP_INDEX.md has expected sections"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_error "✗ MCP_INDEX.md missing expected sections"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
fi

# Check if skills have proper descriptions
validate_skill_description() {
    local skill_file="$1"
    if [ -f "$skill_file" ]; then
        if grep -q "\*\*.*SKILL\*\*" "$skill_file"; then
            return 0
        fi
    fi
    return 1
}

validate_check "Core deploy skill has proper description" "validate_skill_description skills/core/deploy/SKILL.md"
validate_check "Integration azure skill has proper description" "validate_skill_description skills/integration/azure/SKILL.md"

# Results Summary
echo ""
echo "🔍 Validation Results:"
echo "======================"
echo "Total checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $FAILED_CHECKS"

if [ $FAILED_CHECKS -eq 0 ]; then
    print_success "🎉 All validation checks passed!"
    echo ""
    echo "✅ MCP/Skills workspace is properly configured and ready to use."
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Test MCP server functionality"
    echo "  2. Run skills validation"
    echo "  3. Test documentation links"
    echo "  4. Verify development workflow"
    exit 0
else
    print_error "❌ $FAILED_CHECKS validation check(s) failed!"
    echo ""
    echo "🔧 Please fix the issues above and re-run validation."
    echo ""
    echo "💡 For help, see:"
    echo "  - docs/mcp/tutorials/getting-started.md"
    echo "  - docs/mcp/reference/configuration-reference.md"
    exit 1
fi
