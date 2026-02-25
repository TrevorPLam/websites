# Fast documentation validation script for Windows
# Use this instead of pre-commit hooks if they freeze

Write-Host "🔍 Running documentation validation..." -ForegroundColor Green

# Version sync check
Write-Host "📦 Checking version consistency..." -ForegroundColor Blue
python scripts/version_sync.py --check

# Quick markdown check (only changed files)
Write-Host "📝 Running markdown lint on changed files..." -ForegroundColor Blue
if (Get-Command markdownlint-cli2 -ErrorAction SilentlyContinue) {
    # Only check files that changed in the last commit
    $changedFiles = git diff --name-only HEAD~1 HEAD --diff-filter=ACM | Where-Object { $_ -match '\.md$' } | Select-Object -First 5
    if ($changedFiles) {
        $changedFiles | ForEach-Object { markdownlint-cli2 $_ }
    }
} else {
    Write-Host "⚠️  markdownlint-cli2 not found, skipping markdown lint" -ForegroundColor Yellow
}

# Quick spell check (only docs folder)
Write-Host "🔤 Running spell check on docs..." -ForegroundColor Blue
if (Get-Command cspell -ErrorAction SilentlyContinue) {
    cspell docs/guides/ --no-summary --quiet
} else {
    Write-Host "⚠️  cspell not found, skipping spell check" -ForegroundColor Yellow
}

Write-Host "✅ Documentation validation complete!" -ForegroundColor Green
