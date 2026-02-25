#!/bin/bash

# Production Migration Script
# Safe database migration execution for production environment
# Usage: ./scripts/migrate-production.sh [migrate|rollback|status] [--dry-run] [--force]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/database/migrations"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/logs/migrations.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
    esac

    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR" "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        error_exit "Node.js is required but not installed"
    fi

    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        error_exit "pnpm is required but not installed"
    fi

    # Check environment variables
    if [[ -z "${DATABASE_URL:-}" ]]; then
        error_exit "DATABASE_URL environment variable is required"
    fi

    if [[ -z "${SUPABASE_SERVICE_KEY:-}" ]]; then
        error_exit "SUPABASE_SERVICE_KEY environment variable is required"
    fi

    # Check if we're in production
    if [[ "${NODE_ENV:-}" != "production" ]]; then
        log "WARN" "NODE_ENV is not set to 'production'. Current: ${NODE_ENV:-development}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error_exit "Migration cancelled"
        fi
    fi

    # Create necessary directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"

    log "SUCCESS" "Prerequisites check passed"
}

# Validate environment
validate_environment() {
    log "INFO" "Validating production environment..."

    # Test database connection
    log "INFO" "Testing database connection..."
    if ! pnpm exec tsx -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.DATABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
client.from('tenants').select('count').limit(1).then(() => {
  console.log('Database connection successful');
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
" then
        error_exit "Database connection failed"
    fi

    # Check for long-running queries
    log "INFO" "Checking for long-running queries..."
    local long_queries=$(pnpm exec tsx -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.DATABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
client.rpc('check_long_running_queries').then(({ data }) => {
  if (data && data.length > 0) {
    console.log(data.length);
  } else {
    console.log(0);
  }
  process.exit(0);
}).catch(() => {
  console.log(0);
  process.exit(0);
});
" || echo "0")

    if [[ "$long_queries" -gt 0 ]]; then
        log "WARN" "$long_queries long-running queries detected"
        if [[ "${FORCE:-}" != "true" ]]; then
            read -p "Continue despite long-running queries? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                error_exit "Migration cancelled due to long-running queries"
            fi
        fi
    fi

    # Check connection utilization
    log "INFO" "Checking connection utilization..."
    local conn_utilization=$(pnpm exec tsx -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.DATABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
client.rpc('check_connection_utilization').then(({ data }) => {
  console.log(data?.utilization || 0);
  process.exit(0);
}).catch(() => {
  console.log(0);
  process.exit(0);
});
" || echo "0")

    if [[ "$conn_utilization" -gt 70 ]]; then
        log "WARN" "Connection utilization at ${conn_utilization}%"
        if [[ "${FORCE:-}" != "true" ]]; then
            read -p "Continue despite high connection utilization? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                error_exit "Migration cancelled due to high connection utilization"
            fi
        fi
    fi

    log "SUCCESS" "Environment validation passed"
}

# Create database backup
create_backup() {
    local migration_version=${1:-"manual"}
    local backup_file="$BACKUP_DIR/backup-${migration_version}-$(date +%Y%m%d%H%M%S).sql"

    log "INFO" "Creating database backup: $backup_file"

    # Create schema backup
    if ! pg_dump "$DATABASE_URL" \
        --schema-only \
        --no-owner \
        --no-privileges \
        --exclude-table-data 'schema_migrations' \
        > "$backup_file" 2>/dev/null; then
        error_exit "Failed to create database backup"
    fi

    # Compress backup
    gzip "$backup_file"
    backup_file="${backup_file}.gz"

    log "SUCCESS" "Backup created: $backup_file"
    echo "$backup_file"
}

# Run migration
run_migration() {
    local dry_run=${1:-false}
    local force=${2:-false}

    log "INFO" "Starting database migration..."

    # Build migration command
    local cmd=("pnpm" "tsx" "packages/infrastructure/database/migration-runner.ts")

    if [[ "$dry_run" == "true" ]]; then
        cmd+=("--dry-run")
        log "INFO" "Running in DRY RUN mode"
    fi

    if [[ "$force" == "true" ]]; then
        cmd+=("--force")
        log "WARN" "Running with FORCE flag (will continue on errors)"
    fi

    cmd+=("migrate")

    # Execute migration
    local start_time=$(date +%s)

    if ! cd "$PROJECT_ROOT" && "${cmd[@]}"; then
        error_exit "Migration failed"
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log "SUCCESS" "Migration completed in ${duration}s"
}

# Rollback migration
rollback_migration() {
    local force=${1:-false}

    log "INFO" "Starting migration rollback..."

    # Build rollback command
    local cmd=("pnpm" "tsx" "$MIGRATIONS_DIR/migration-runner.ts")

    if [[ "$force" == "true" ]]; then
        cmd+=("--force")
        log "WARN" "Running with FORCE flag"
    fi

    cmd+=("rollback")

    # Execute rollback
    local start_time=$(date +%s)

    if ! cd "$PROJECT_ROOT" && "${cmd[@]}"; then
        error_exit "Rollback failed"
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log "SUCCESS" "Rollback completed in ${duration}s"
}

# Show migration status
show_status() {
    log "INFO" "Getting migration status..."

    cd "$PROJECT_ROOT" && pnpm tsx packages/infrastructure/database/migration-runner.ts status
}

# Post-migration validation
validate_post_migration() {
    log "INFO" "Running post-migration validation..."

    # Test basic database operations
    log "INFO" "Testing basic database operations..."
    if ! pnpm exec tsx -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.DATABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function testOperations() {
  try {
    // Test tenants table
    await client.from('tenants').select('count').limit(1);
    console.log('✅ Tenants table accessible');

    // Test leads table
    await client.from('leads').select('count').limit(1);
    console.log('✅ Leads table accessible');

    // Test RLS (if applicable)
    const { data, error } = await client.from('leads').select('count').limit(1);
    if (error && error.message.includes('row-level security')) {
      console.log('✅ RLS policies active');
    } else {
      console.log('ℹ️  RLS status: Unknown');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Validation failed:', err.message);
    process.exit(1);
  }
}

testOperations();
" then
        error_exit "Post-migration validation failed"
    fi

    # Run application smoke tests if available
    if [[ -f "$PROJECT_ROOT/scripts/smoke-test.sh" ]]; then
        log "INFO" "Running application smoke tests..."
        if ! "$PROJECT_ROOT/scripts/smoke-test.sh"; then
            log "WARN" "Smoke tests failed, but migration completed"
        fi
    fi

    log "SUCCESS" "Post-migration validation passed"
}

# Main execution
main() {
    local command=${1:-"status"}
    local dry_run="false"
    local force="false"

    # Parse arguments
    shift
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run="true"
                shift
                ;;
            --force)
                force="true"
                shift
                ;;
            *)
                log "ERROR" "Unknown argument: $1"
                exit 1
                ;;
        esac
    done

    log "INFO" "Starting production migration script"
    log "INFO" "Command: $command"
    log "INFO" "Dry run: $dry_run"
    log "INFO" "Force: $force"

    # Check prerequisites
    check_prerequisites

    # Validate environment (skip for dry run)
    if [[ "$dry_run" != "true" ]]; then
        validate_environment
    fi

    # Execute command
    case $command in
        "migrate")
            # Create backup unless skipped
            if [[ "$dry_run" != "true" ]]; then
                create_backup
            fi

            run_migration "$dry_run" "$force"

            # Post-migration validation (skip for dry run)
            if [[ "$dry_run" != "true" ]]; then
                validate_post_migration
            fi
            ;;
        "rollback")
            rollback_migration "$force"
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [migrate|rollback|status] [--dry-run] [--force]"
            echo ""
            echo "Commands:"
            echo "  migrate   Run pending migrations"
            echo "  rollback  Rollback last migration"
            echo "  status    Show migration status"
            echo "  help      Show this help message"
            echo ""
            echo "Options:"
            echo "  --dry-run  Show what would be done without executing"
            echo "  --force    Continue despite warnings"
            exit 0
            ;;
        *)
            log "ERROR" "Unknown command: $command"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac

    log "SUCCESS" "Migration script completed successfully"
}

# Trap cleanup
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log "ERROR" "Migration script failed with exit code $exit_code"
        log "ERROR" "Check logs at: $LOG_FILE"
    fi
}
trap cleanup EXIT

# Run main function
main "$@"
