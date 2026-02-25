#!/bin/bash

# Fast documentation validation script
# Use this instead of pre-commit hooks if they freeze

echo "🔍 Running documentation validation..."

# Version sync check
echo "📦 Checking version consistency..."
python scripts/version_sync.py --check

# Quick markdown check (only changed files)
echo "📝 Running markdown lint on changed files..."
if command -v markdownlint-cli2 &> /dev/null; then
    # Only check files that changed in the last commit
    git diff --name-only HEAD~1 HEAD --diff-filter=ACM | grep '\.md$' | head -5 | xargs -r markdownlint-cli2
else
    echo "⚠️  markdownlint-cli2 not found, skipping markdown lint"
fi

# Quick spell check (only docs folder)
echo "🔤 Running spell check on docs..."
if command -v cspell &> /dev/null; then
    cspell docs/guides/ --no-summary --quiet
else
    echo "⚠️  cspell not found, skipping spell check"
fi

echo "✅ Documentation validation complete!"
