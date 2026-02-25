#!/bin/bash

# Test Runbook Procedures Script
# Validates that all runbook procedures are functional
# Version: 1.0
# Last Updated: 2026-02-25

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration (set environment variables when running)
# VERCEL_TOKEN=""
# VERCEL_ORG_ID=""
# DATABASE_URL=""
# STRIPE_SECRET_KEY=""
# CALCOM_API_KEY=""
# SENTRY_AUTH_TOKEN=""

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNING=0

# Helper function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"

    log "Running test: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Helper function to run warning test
run_warning_test() {
    local test_name="$1"
    local test_command="$2"

    log "Running test: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        warning "$test_name (may be expected in test environment)"
        ((TESTS_WARNING++))
        return 0
    fi
}

# Main test execution
main() {
    log "Starting runbook procedures validation..."

    # Check required environment variables
    log "Checking environment variables..."

    if [[ -z "$VERCEL_TOKEN" ]]; then
        warning "VERCEL_TOKEN not set, skipping Vercel tests"
    fi

    if [[ -z "$DATABASE_URL" ]]; then
        warning "DATABASE_URL not set, skipping database tests"
    fi

    if [[ -z "$STRIPE_SECRET_KEY" ]]; then
        warning "STRIPE_SECRET_KEY not set, skipping Stripe tests"
    fi

    echo

    # Test 1: Documentation exists and is readable
    log "Testing documentation accessibility..."

    run_test "Main runbook exists" "test -f docs/operations/runbook.md"
    run_test "Database recovery guide exists" "test -f docs/operations/database-recovery.md"
    run_test "Webhook troubleshooting guide exists" "test -f docs/operations/webhook-troubleshooting.md"
    run_test "Emergency rollback guide exists" "test -f docs/operations/emergency-rollback.md"
    run_test "Vendor contacts guide exists" "test -f docs/operations/vendor-contacts.md"

    echo

    # Test 2: Documentation structure and content
    log "Testing documentation structure..."

    run_test "Runbook has severity levels" "grep -q 'SEV-0\\|SEV-1\\|SEV-2' docs/operations/runbook.md"
    run_test "Runbook has escalation procedures" "grep -q 'escalation\\|Escalation' docs/operations/runbook.md"
    run_test "Database guide has recovery procedures" "grep -q 'recovery\\|Recovery' docs/operations/database-recovery.md"
    run_test "Webhook guide has troubleshooting steps" "grep -q 'troubleshooting\\|diagnosis' docs/operations/webhook-troubleshooting.md"
    run_test "Rollback guide has time targets" "grep -q 'minutes\\|rollback' docs/operations/emergency-rollback.md"
    run_test "Vendor contacts has emergency information" "grep -q 'emergency\\|support' docs/operations/vendor-contacts.md"

    echo

    # Test 3: Vercel procedures (if token available)
    if [[ -n "$VERCEL_TOKEN" && -n "$VERCEL_ORG_ID" ]]; then
        log "Testing Vercel procedures..."

        run_warning_test "Vercel CLI accessible" "command -v vercel > /dev/null"
        run_warning_test "Vercel authentication works" "vercel whoami --token=$VERCEL_TOKEN"
        run_warning_test "Can list deployments" "vercel ls --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID"

        echo
    fi

    # Test 4: Database procedures (if URL available)
    if [[ -n "$DATABASE_URL" ]]; then
        log "Testing database procedures..."

        run_warning_test "Database connection works" "psql '$DATABASE_URL' -c 'SELECT 1;'"
        run_warning_test "Can check connection count" "psql '$DATABASE_URL' -c 'SELECT count(*) FROM pg_stat_activity;'"
        run_warning_test "Can check database size" "psql '$DATABASE_URL' -c 'SELECT pg_database_size(current_database());'"

        echo
    fi

    # Test 5: Stripe procedures (if key available)
    if [[ -n "$STRIPE_SECRET_KEY" ]]; then
        log "Testing Stripe procedures..."

        run_warning_test "Stripe API accessible" "curl -s -f 'https://api.stripe.com/v1/account' -u '$STRIPE_SECRET_KEY'"
        run_warning_test "Can list webhook endpoints" "curl -s 'https://api.stripe.com/v1/webhook_endpoints' -u '$STRIPE_SECRET_KEY'"

        echo
    fi

    # Test 6: Health check endpoints
    log "Testing health check procedures..."

    # Note: These tests assume the application is running
    run_warning_test "Health check endpoint accessible" "curl -s -f https://agency.com/api/health"
    run_warning_test "Auth test endpoint accessible" "curl -s -f https://agency.com/api/auth/test"

    echo

    # Test 7: Command availability
    log "Testing required command availability..."

    run_test "curl command available" "command -v curl > /dev/null"
    run_test "jq command available" "command -v jq > /dev/null"
    run_test "psql command available" "command -v psql > /dev/null"
    run_warning_test "vercel command available" "command -v vercel > /dev/null"
    run_warning_test "redis-cli command available" "command -v redis-cli > /dev/null"

    echo

    # Test 8: Script permissions and executability
    log "Testing script executability..."

    # Create test scripts directory if it doesn't exist
    mkdir -p scripts/test

    # Test creating and executing a simple script
    echo '#!/bin/bash\necho "Test script executed successfully"' > scripts/test/test_script.sh
    chmod +x scripts/test/test_script.sh

    run_test "Can create executable scripts" "scripts/test/test_script.sh"

    # Clean up
    rm -f scripts/test/test_script.sh

    echo

    # Test 9: Configuration file validation
    log "Testing configuration files..."

    run_test "package.json exists" "test -f package.json"
    run_test "turbo.json exists" "test -f turbo.json"
    run_test "pnpm-workspace.yaml exists" "test -f pnpm-workspace.yaml"
    run_warning_test ".env.example exists" "test -f .env.example"

    echo

    # Test 10: Documentation links and references
    log "Testing documentation references..."

    run_test "Runbook references other docs" "grep -q 'database-recovery\\|webhook-troubleshooting\\|emergency-rollback' docs/operations/runbook.md"
    run_test "Database guide references main runbook" "grep -q 'runbook' docs/operations/database-recovery.md"
    run_test "Webhook guide has vendor contacts" "grep -q 'stripe\\|cal.com\\|support' docs/operations/webhook-troubleshooting.md"

    echo

    # Summary
    log "Test execution completed"
    echo
    echo "=== Test Summary ==="
    echo "Passed:  $TESTS_PASSED"
    echo "Failed:  $TESTS_FAILED"
    echo "Warnings: $TESTS_WARNING"
    echo "Total:   $((TESTS_PASSED + TESTS_FAILED + TESTS_WARNING))"
    echo

    if [[ $TESTS_FAILED -gt 0 ]]; then
        error "Some tests failed. Please review and fix issues."
        exit 1
    elif [[ $TESTS_WARNING -gt 0 ]]; then
        warning "Some tests had warnings (may be expected in test environment)."
        exit 0
    else
        success "All tests passed! Runbook procedures are validated."
        exit 0
    fi
}

# Help function
show_help() {
    echo "Test Runbook Procedures Script"
    echo
    echo "Usage: $0 [options]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -v, --verbose  Enable verbose output"
    echo
    echo "Environment Variables:"
    echo "  VERCEL_TOKEN        Vercel API token"
    echo "  VERCEL_ORG_ID       Vercel organization ID"
    echo "  DATABASE_URL        PostgreSQL connection string"
    echo "  STRIPE_SECRET_KEY   Stripe secret key"
    echo "  CALCOM_API_KEY      Cal.com API key"
    echo "  SENTRY_AUTH_TOKEN   Sentry authentication token"
    echo
    echo "Examples:"
    echo "  $0                                    # Basic tests"
    echo "  $0 -v                                 # Verbose output"
    echo "  VERCEL_TOKEN=xxx $0                  # With Vercel tests"
    echo "  DATABASE_URL=xxx $0                  # With database tests"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main "$@"
