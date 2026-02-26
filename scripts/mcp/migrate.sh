#!/bin/bash

# MCP/Skills Workspace Migration Script
# This script helps migrate from the old distributed structure to the new organized structure

set -e

echo "🚀 Starting MCP/Skills workspace migration..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".mcp" ]; then
    print_error "Please run this script from the repository root directory"
    exit 1
fi

# Backup current state
print_status "Creating backup of current MCP configuration..."
BACKUP_DIR=".mcp-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup .mcp directory
if [ -d ".mcp" ]; then
    cp -r .mcp "$BACKUP_DIR/"
    print_success "Backed up .mcp directory"
fi

# Backup .codex directory
if [ -d ".codex" ]; then
    cp -r .codex "$BACKUP_DIR/"
    print_success "Backed up .codex directory"
fi

# Backup root MCP files
if [ -f "mcp_skills.md" ]; then
    cp mcp_skills.md "$BACKUP_DIR/"
    print_success "Backed up mcp_skills.md"
fi

if [ -f "mcp_skills_guide.md" ]; then
    cp mcp_skills_guide.md "$BACKUP_DIR/"
    print_success "Backed up mcp_skills_guide.md"
fi

# Phase 1: Configuration Consolidation
print_status "Phase 1: Consolidating MCP configuration..."

# Create manifests directory
mkdir -p .mcp/manifests

# Move documentation files
if [ -f ".mcp/IMPLEMENTATION_GUIDE.md" ]; then
    mkdir -p docs/mcp/explanation
    mv .mcp/IMPLEMENTATION_GUIDE.md docs/mcp/explanation/implementation-guide.md
    print_success "Moved implementation guide to docs/mcp/explanation/"
fi

if [ -f ".mcp/ADVANCED_IMPLEMENTATION_RESEARCH_2026.md" ]; then
    mv .mcp/ADVANCED_IMPLEMENTATION_RESEARCH_2026.md docs/mcp/explanation/advanced-research-2026.md
    print_success "Moved research document to docs/mcp/explanation/"
fi

if [ -f ".mcp/MCP_A2A_INTEGRATION_GUIDE.md" ]; then
    mkdir -p docs/mcp/how-to
    mv .mcp/MCP_A2A_INTEGRATION_GUIDE.md docs/mcp/how-to/a2a-integration.md
    print_success "Moved A2A guide to docs/mcp/how-to/"
fi

if [ -f ".mcp/RESEARCH_RESULTS.md" ]; then
    mv .mcp/RESEARCH_RESULTS.md docs/mcp/explanation/research-results.md
    print_success "Moved research results to docs/mcp/explanation/"
fi

if [ -f ".mcp/README.md" ]; then
    mkdir -p docs/mcp/tutorials
    mv .mcp/README.md docs/mcp/tutorials/getting-started.md
    print_success "Moved README to docs/mcp/tutorials/"
fi

# Move security manifests
if [ -f ".mcp/security-audit.json" ]; then
    mv .mcp/security-audit.json .mcp/manifests/
    print_success "Moved security audit to manifests/"
fi

if [ -f ".mcp/supply-chain-safety.json" ]; then
    mv .mcp/supply-chain-safety.json .mcp/manifests/
    print_success "Moved supply chain safety to manifests/"
fi

if [ -f ".mcp/trusted-manifest.json" ]; then
    mv .mcp/trusted-manifest.json .mcp/manifests/
    print_success "Moved trusted manifest to manifests/"
fi

# Create environment configs
if [ -f ".mcp/config.json" ]; then
    cp .mcp/config.json .mcp/config.development.json
    cp .mcp/config.json .mcp/config.production.json
    print_success "Created environment-specific configurations"
fi

# Phase 2: Skills Reorganization
print_status "Phase 2: Reorganizing skills structure..."

# Create skills directory structure
mkdir -p skills/{core,integration,domain,templates}

# Migrate existing skills
if [ -d ".codex/skills" ]; then
    # Move azure-deploy to integration/azure
    if [ -d ".codex/skills/azure-deploy" ]; then
        mkdir -p skills/integration/azure
        cp -r .codex/skills/azure-deploy/* skills/integration/azure/
        print_success "Moved azure-deploy to skills/integration/azure/"
    fi

    # Move code-review to core/review
    if [ -d ".codex/skills/code-review" ]; then
        mkdir -p skills/core/review
        cp -r .codex/skills/code-review/* skills/core/review/
        print_success "Moved code-review to skills/core/review/"
    fi

    # Move deploy-production to core/deploy
    if [ -d ".codex/skills/deploy-production" ]; then
        mkdir -p skills/core/deploy
        cp -r .codex/skills/deploy-production/* skills/core/deploy/
        print_success "Moved deploy-production to skills/core/deploy/"
    fi

    # Move skill-discovery to core/test
    if [ -d ".codex/skills/skill-discovery" ]; then
        mkdir -p skills/core/test
        cp -r .codex/skills/skill-discovery/* skills/core/test/
        print_success "Moved skill-discovery to skills/core/test/"
    fi

    # Move tenant-setup to domain/marketing
    if [ -d ".codex/skills/tenant-setup" ]; then
        mkdir -p skills/domain/marketing
        cp -r .codex/skills/tenant-setup/* skills/domain/marketing/
        print_success "Moved tenant-setup to skills/domain/marketing/"
    fi
fi

# Phase 3: Documentation Restructuring
print_status "Phase 3: Restructuring documentation..."

# Create docs structure
mkdir -p docs/mcp/{tutorials,how-to,reference,explanation}

# Move documentation files
if [ -f "docs/guides/mcp.md" ]; then
    mv docs/guides/mcp.md docs/mcp/tutorials/mcp-basics.md
    print_success "Moved mcp.md to docs/mcp/tutorials/"
fi

if [ -f "docs/guides/mcp-ai-integration-guide.md" ]; then
    mv docs/guides/mcp-ai-integration-guide.md docs/mcp/how-to/ai-integration.md
    print_success "Moved AI integration guide to docs/mcp/how-to/"
fi

if [ -f "docs/guides/mcp-git-server-installation.md" ]; then
    mv docs/guides/mcp-git-server-installation.md docs/mcp/how-to/git-server-setup.md
    print_success "Moved git server guide to docs/mcp/how-to/"
fi

if [ -f "docs/guides/mcp-production-deployment-guide.md" ]; then
    mv docs/guides/mcp-production-deployment-guide.md docs/mcp/how-to/production-deployment.md
    print_success "Moved production deployment guide to docs/mcp/how-to/"
fi

if [ -f "docs/research/mcp-agentic-coding-innovative-techniques-2026.md" ]; then
    mv docs/research/mcp-agentic-coding-innovative-techniques-2026.md docs/mcp/explanation/agentic-coding-techniques.md
    print_success "Moved agentic coding research to docs/mcp/explanation/"
fi

if [ -f "docs/research/mcp-ai-agent-skills-2026-comprehensive-research.md" ]; then
    mv docs/research/mcp-ai-agent-skills-2026-comprehensive-research.md docs/mcp/explanation/agent-skills-research.md
    print_success "Moved agent skills research to docs/mcp/explanation/"
fi

if [ -f "mcp_skills.md" ]; then
    mkdir -p docs/mcp/reference
    mv mcp_skills.md docs/mcp/reference/skills-guide.md
    print_success "Moved skills guide to docs/mcp/reference/"
fi

if [ -f "mcp_skills_guide.md" ]; then
    mv mcp_skills_guide.md docs/mcp/reference/comprehensive-guide.md
    print_success "Moved comprehensive guide to docs/mcp/reference/"
fi

# Phase 4: Scripts Organization
print_status "Phase 4: Organizing scripts..."

# Create scripts directory
mkdir -p scripts/mcp

# Move MCP scripts
for script in scripts/mcp-*.js; do
    if [ -f "$script" ]; then
        new_name=$(basename "$script" | sed 's/mcp-//')
        mv "$script" "scripts/mcp/$new_name"
        print_success "Moved $(basename $script) to scripts/mcp/"
    fi
done

# Move setup scripts
if [ -f ".mcp/setup.sh" ]; then
    mv .mcp/setup.sh scripts/mcp/setup.sh
    print_success "Moved setup.sh to scripts/mcp/"
fi

if [ -f ".mcp/setup.bat" ]; then
    mv .mcp/setup.bat scripts/mcp/setup.bat
    print_success "Moved setup.bat to scripts/mcp/"
fi

# Phase 5: Create Navigation
print_status "Phase 5: Creating navigation index..."

# Create MCP_INDEX.md
cat > MCP_INDEX.md << 'EOF'
# MCP/Skills Workspace Index

## Quick Start
- [Getting Started](docs/mcp/tutorials/getting-started.md)
- [MCP Basics](docs/mcp/tutorials/mcp-basics.md)
- [First Skill](docs/mcp/tutorials/first-skill.md)

## Configuration
- [Configuration Reference](docs/mcp/reference/configuration-reference.md)
- [Environment Setup](docs/mcp/how-to/setup-configuration.md)

## Skills
- [Core Skills](skills/core/)
- [Integration Skills](skills/integration/)
- [Domain Skills](skills/domain/)
- [Skill Templates](skills/templates/)

## Servers
- [Server List](packages/mcp-servers/)
- [Server API](docs/mcp/reference/server-api.md)

## Documentation
- [Tutorials](docs/mcp/tutorials/)
- [How-To Guides](docs/mcp/how-to/)
- [Reference](docs/mcp/reference/)
- [Explanation](docs/mcp/explanation/)

## Scripts
- [Setup Scripts](scripts/mcp/)
- [Development Scripts](scripts/mcp/dev-*)
- [Testing Scripts](scripts/mcp/test-*)
- [Validation Scripts](scripts/mcp/validate-*)
EOF

print_success "Created MCP_INDEX.md navigation file"

# Phase 6: Validation
print_status "Phase 6: Validating migration..."

# Check if all directories exist
required_dirs=(
    ".mcp/manifests"
    "skills/core"
    "skills/integration"
    "skills/domain"
    "docs/mcp/tutorials"
    "docs/mcp/how-to"
    "docs/mcp/reference"
    "docs/mcp/explanation"
    "scripts/mcp"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_success "✓ $dir exists"
    else
        print_error "✗ $dir missing"
    fi
done

# Check if key files exist
required_files=(
    ".mcp/config.json"
    "MCP_INDEX.md"
    "docs/mcp/tutorials/getting-started.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing"
    fi
done

# Summary
print_success "Migration completed successfully!"
echo ""
echo "📊 Migration Summary:"
echo "  - Configuration: Consolidated in .mcp/"
echo "  - Skills: Organized in skills/ by category"
echo "  - Documentation: Restructured in docs/mcp/ (Diátaxis)"
echo "  - Scripts: Organized in scripts/mcp/"
echo "  - Navigation: Created MCP_INDEX.md"
echo ""
echo "📁 Backup location: $BACKUP_DIR"
echo ""
echo "🔍 Next steps:"
echo "  1. Review the migrated structure"
echo "  2. Test MCP server functionality"
echo "  3. Update any hardcoded paths"
echo "  4. Run validation scripts"
echo ""
echo "📖 For help, see: docs/mcp/tutorials/getting-started.md"
